import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import {PrismaClient} from '@prisma/client';
import fs from 'fs';
import https from "https";
import schedule from 'node-schedule'

const prisma = new PrismaClient({log: ['query']});

async function request(url, options = {}) {
  try {
    const res = await fetch(url, options)
    return {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers.raw(),
      redirected: res.redirected,
      data: cheerio.load(await res.text())
    }
  } catch (err) {
    return err
  }
}

function strHandle(str) {
  return str.replaceAll(/(^\s*)|(\s*$)|(\n|\r|(\r\n)|(\u0085)|(\u2028)|(\u2029))/ig, '')
}

function saveImg(url, path) {
  https.get(url, function (req, res) {
    let imgData = '';
    req.setEncoding("binary");
    req.on('data', function (chunk) {
      imgData += chunk;
    });
    req.on("end", function () {
      fs.writeFile(path, imgData, "binary", function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log('图片保存成功，db地址%s', url)
        }
      });
    });
  });
}

async function getMoviesIncoming() {
  const searchHtml = await request('https://movie.douban.com/cinema/later/chengdu/');

  let movies = []
  const arr = searchHtml.data('#showing-soon .item ').each(async (i, el) => {
    let result = {}
    result['name'] = strHandle(searchHtml.data(el).find('.intro a').text())
    //处理名字可能带预告片几个字
    if (result['name'].indexOf('预告片') != -1) {
      result['name'] = result['name'].replace('预告片', '')
    }
    const href = strHandle(searchHtml.data(el).find('.intro h3 a').attr('href'))
    result['db_href'] = href
    const hrefStr = href.split('/')
    result['db_id'] = hrefStr[4]
    const onlineDate = strHandle(searchHtml.data(el).find('ul li').first().text())
    result['online_date'] = onlineDate
    const dbImgUrl = strHandle(searchHtml.data(el).find('img').attr('src'));
    console.log(dbImgUrl)
    const imgName = dbImgUrl.substring(dbImgUrl.lastIndexOf('/')+1);
    saveImg(dbImgUrl, `./imgs/${imgName}`)
    result['img_url'] = 'http://127.0.0.1:8081/imgs/' + imgName
    movies.push(result)
  })
  for (let info of movies) {
    //获取详情
    const response = await fetch('https://movie.douban.com/j/subject_abstract?subject_id=' + info.db_id)
    const body = await response.json();
    const releaseYear = body.subject.release_year;
    const dateStr = `${releaseYear}年${info['online_date']}`
    const onlineDate = new Date(Date.parse(dateStr.replace('年', '-').replace('月', '-').replace('日', '')));
    info['online_date'] = onlineDate
  }
  console.log(movies)

  //插入前判断是否已经存在 存在则过滤掉
  const incoming = [];
  for (let movie of movies) {
    await prisma.movie.findFirst({
      where: {
        db_id: movie.db_id
      }
    }).then(result => {
      if (!result) {
        incoming.push(movie)
      }
    })
  }
  async function batchInsert() {
    await prisma.movie.createMany({data: incoming});
  }

  batchInsert()
    .then(async () => {
      await prisma.$disconnect()
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect()
      process.exit(1)
    })

}

//定时任务获取即将上映的电影
const rule = new schedule.RecurrenceRule();
rule.hour = 13;
rule.minute = 46;
rule.second = 0;
schedule.scheduleJob(rule, () => {
  getMoviesIncoming()
});


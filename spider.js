import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import dayjs from 'dayjs'
import {DATETIME, DATETIME2} from "mysql/lib/protocol/constants/types.js";
import moment from "moment";

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

const searchHtml = await request('https://movie.douban.com/cinema/later/chengdu/');

let infos = []
const arr = searchHtml.data('#showing-soon .item .intro').each( async (i, el) => {
  let result = {}
  result['name'] = strHandle(searchHtml.data(el).find('a').text())
  const href = strHandle(searchHtml.data(el).find('h3 a').attr('href'))
  result['href'] = href
  const hrefStr = href.split('/')
  result['db_id'] = hrefStr[4]
  const onlineDate = strHandle(searchHtml.data(el).find('ul li').first().text())
  result['onlineDate'] = onlineDate

  infos.push(result)
})


// infos.forEach(async info => {
//   //获取详情
//   // const response = await fetch('https://movie.douban.com/j/subject_abstract?subject_id=4811774')
//   const response = await fetch('https://movie.douban.com/j/subject_abstract?subject_id=' + info.db_id)
//   const body = await response.json();
//   // console.log(body)
//   const releaseYear = body.subject.release_year;
//
//   console.log('===============================')
//   const date = new Date();
//   date.setFullYear(releaseYear)
//   console.log(info.onlineDate)
//   date.setMonth(11)
//   date.setDate(16)
//   const s = dayjs(date).format('YYYY-MM-DD');
//   info.onlineDate = s
//   console.log(info)
// })

const dealOnlineDate = new Promise( (resolve, reject) => {
  infos.forEach(async info => {
    //获取详情
    // const response = await fetch('https://movie.douban.com/j/subject_abstract?subject_id=4811774')
    const response = await fetch('https://movie.douban.com/j/subject_abstract?subject_id=' + info.db_id)
    const body = await response.json();
    // console.log(body)
    const releaseYear = body.subject.release_year;

    console.log('===============================')
    // const date = new Date();
    // date.setFullYear(releaseYear)
    // console.log(info.onlineDate)
    // date.setMonth(11)
    // date.setDate(16)
    const date = new Date('2022-12-15');
    console.log(date)
    info['onlineDate'] = date
    console.log(info)
  })
}).then(console.log(infos));

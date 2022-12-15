import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import {Prisma, PrismaClient} from '@prisma/client';

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

const searchHtml = await request('https://movie.douban.com/cinema/later/chengdu/');

let movies = []
const arr = searchHtml.data('#showing-soon .item .intro').each(async (i, el) => {
  let result = {}
  result['name'] = strHandle(searchHtml.data(el).find('a').text())
  const href = strHandle(searchHtml.data(el).find('h3 a').attr('href'))
  result['db_href'] = href
  const hrefStr = href.split('/')
  result['db_id'] = hrefStr[4]
  const onlineDate = strHandle(searchHtml.data(el).find('ul li').first().text())
  result['online_date'] = onlineDate

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

// async function batchInsert() {
//   await Promise.all(
//     movies.map(async (movie) => {
//       await prisma.movie.create({
//         data: movie,
//       })
//     })
//   )
// }

batchInsert()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect()
    process.exit(1)
  })

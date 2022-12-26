import express from 'express';
import {PrismaClient} from "@prisma/client";
import bodyParser from "body-parser";
import moment from "moment/moment.js";

//创建 application/x-www-form-urlencoded 编码解析
const urlencodedParser = bodyParser.urlencoded({extended: false})

const prisma = new PrismaClient({log: ['query']});


const app = express();

app.use('/imgs', express.static('imgs'))


app.post('/index-table', urlencodedParser, async function (req, res) {
  const pageSize = req.body.pageSize;
  const pageNum = req.body.pageNum;
  const movies = await findMovieList()
  res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"})
  res.end(JSON.stringify(movies), 'utf-8');
});

async function findMovieList() {
  const movies = await prisma.movie.findMany();
  // console.log(movies)
  movies.forEach(movie => movie['online_date'] = moment(movie.online_date).format('YYYY-MM-DD'))
  return movies;
}

app.listen(8081)
import express from "express";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient({log: ['query']});
const app = express();

app.get('/profile', async function (req, res) {
  const openid = req.query.openid;
  const user = await prisma.user.findFirst({
    where: {
      openid: openid
    }
  });
  const result = await prisma.movie.findMany({
    where: {
      users: {
        some: {
          user: {
            id: user.id
          }
        }
      }
    }
  });
  console.log(result)
  //处理中文乱码
  res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"})
  res.end(JSON.stringify(result),'utf-8')
});

app.listen(8084)
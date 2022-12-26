import express from "express";
import {PrismaClient} from "@prisma/client";

const app = express();

const prisma = new PrismaClient({log: ['query']})

//用户订阅通知
app.get('/subscribe', async function (req, res) {
  const db_id = req.query.id;
  const openid = req.query.openid;
  await prisma.movie.findFirst({
      where: {
        db_id: db_id
      }
  }).then(async movie => {
    const result = await prisma.subscribe.findFirst({
      where: {
        openid: openid,
        movie_id: movie.id,
        deleted: false
      }
    });
    if (!result) {
      await prisma.user.findFirst({
        where: {
          openid: openid
        }
      }).then(async user => {
        await prisma.subscribe.create({
          data: {
            user_id: user.id,
            movie_id: movie.id,
            notice_time: movie.online_date,
            openid: openid,
            deleted: false
          }
        })
      })
    }
  });
});

app.listen(8083)
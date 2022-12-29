import express from "express";
import {PrismaClient} from "@prisma/client";

const app = express();

const prisma = new PrismaClient({log: ['query']})

//获取用户某部影片是否已订阅
app.get('/subscribeInfo', async function (req, res) {
  const openid = req.query.openid;
  const movieId = req.query.movie_id;
  const result = await prisma.subscribe.findFirst({
    where: {
      openid: openid,
      movie_id: parseInt(movieId),
      deleted: false
    }
  });
  if (result) {
    res.end(JSON.stringify(true))
  } else {
    res.end(JSON.stringify(false))
  }
});

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
        res.end(JSON.stringify(true))
      })
    }
  });
});

app.get('/cancelSubscribe', async function (req, res) {
  const openid = req.query.openid;
  const movieId = req.query.movie_id;
  const subscribed = await prisma.subscribe.findFirst({
    where: {
      openid: openid,
      movie_id: parseInt(movieId),
      deleted: false
    }
  });

  const result = await prisma.subscribe.update({
    where: {
      id: subscribed.id
    },
    data: {
      deleted: true
    }
  });
  res.end(JSON.stringify(true))
});
app.listen(8083)
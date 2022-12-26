import express from "express";
import fetch from "node-fetch";
import https from "https";
import bodyParser from "body-parser";
import {PrismaClient} from "@prisma/client";

const urlencodedParser = bodyParser.urlencoded({extend: false});

const prisma = new PrismaClient({log: ['query']});


const app = express();
const appSecret = 'c867799f54adfd7bf6d2d6958d6a1c67';
const appId = 'wx4df407e54680b5d0';
app.get('/login', async function (req, res) {
  const result = await wxJsCode2Session(req.query.code);
  //保存用户 用于用户订阅影片后绑定 用户和订阅影片关系
  await saveUser(result.openid)
  res.writeHead(200, {"Content-Type": "application/json; charset=utf-8"})
  res.end(JSON.stringify(result), 'utf-8')
});

async function saveUser(openid) {
  const result = await prisma.user.findFirst({
    where: {
      openid: openid,
    },
  });
  if (!result) {
    await prisma.user.create({
      data: {
        deleted: false,
        openid: openid
      }
    })
  }
}

async function wxJsCode2Session(code) {
  const response = await fetch('https://api.weixin.qq.com/sns/jscode2session?js_code=' + code + `&secret=${appSecret}&appid=${appId}&grant_type='authorization_code'`);
  const result = await response.json();
  console.log(result)
  return result
}

//消息通知
app.post('/sendMessage', urlencodedParser, async function (req, res) {
  const token = await getWxToken();
  const openid = req.body.openid;
  return await sendMessage(token, openid)
});

async function getWxToken() {
  const response = await fetch('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential' + `&appid=${appId}&secret=${appSecret}`)
  const result = await response.json();
  console.log(result)
  return result['access_token']
}

async function sendMessage(token, openId) {
  let query = {
    "touser": openId,
    "template_id": "-fOjG7JgXNt179YeSNAstwpCxyErZB-sBVoxEvU8xvw",
    "page": "pages/index/index",
    "miniprogram_state": "developer",
    "lang": "zh_CN",
    "data": {
      "thing1": {
        "value": "339208499"
      },
      "time2": {
        "value": "2015年01月05日"
      },
      "thing3": {
        "value": "即将上映"
      },
      "site2": {
        "value": "广州市新港中路397号"
      }
    }
  }

  const response = await fetch('https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=' + token, {
    method: 'post',
    body: JSON.stringify(query),
    headers: {'Content-Type': 'application/json'}
  });
  const result = await response.json();
  console.log(result)
  return result
}

// async function getUserInfo(openid) {
//   await getWxToken().then(async token => {
//     let query = {
//       openid: openid
//     }
//     const response = await fetch('https://api.weixin.qq.com/shop/userinfo/del?access_token=' + token, {
//       method: 'post',
//       body: JSON.stringify(query),
//       headers: {'Content-Type': 'application/json'}
//     });
//     const result = await response.json();
//     return result;
//   });
// }

app.listen(8082);

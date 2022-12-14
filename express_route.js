let express = require('express');
let app = express();


app.get('/list_user', function (req, res) {
  console.log("/list_user GET 请求");
  res.send('用户列表页面');
});

let server = app.listen(8899, function () {
  let host = server.address().address;
  let port = server.address().port;
  console.log("应用实例，访问地址 http://%s:%s", host, port);
});
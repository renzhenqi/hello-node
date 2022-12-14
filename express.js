let express = require('express');
let app = express();
app.get('/', function (req, res) {
  res.send('Hello World');
});

let server = app.listen(8899, function () {
  let host = app.address().address;
  console.log(server.address())
  let port = app.address().port;
  console.log("应用实例，访问地址为 http://%s:%s", host, port);
});
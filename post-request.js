let http = require('http');
let querystring = require('querystring');

//post请求
let postHtml = '<html lang="zh-CN">'+
  '<head>'+
  '  <meta charset="UTF-8">'+
  '  <title>网站标题</title>'+
  '  <meta name="description" content="网站描述">'+
  '  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">'+
  '</head>'+
  '<body>'+
  '<form action="" method="post">'+
  '  网站名：<input type="text" name="name"><br>'+
  '  网站url：<input type="text" name="url"><br>'+
  '  <input type="submit">'+
  '</form>'+
  ''+
  '</body>'+
  '</html>';

http.createServer(function (req, res) {
  let body = "";
  req.on("data", function (chunk) {
    body += chunk;
  });

  req.on("end", function () {
    body = querystring.parse(body);
    res.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
    if (body.name && body.url) {
      res.write("网站名：" + body.name);
      res.write("网站url：" + body.url);
    } else {
      res.write(postHtml);
    }
    res.end();
  });
}).listen(3000);




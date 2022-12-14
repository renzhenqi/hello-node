let http = require('http');
let url = require('url');
let util = require('util');
let querystring = require('querystring');
//get请求
http.createServer(function (req, res) {
  res.writeHead(200, {"Content-Type": "text/plain; charSet=utf-8"});
  let params = url.parse(req.url, true).query;
  res.write("网站名:" + params.name + "\n");
  res.write("url:" + params.url);
  res.end();
}).listen(3000);


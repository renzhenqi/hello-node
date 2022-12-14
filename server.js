/*
 * @Author: renzhenqi qinze5577@gmail.com
 * @Date: 2022-12-06 11:16:09
 * @LastEditors: renzhenqi qinze5577@gmail.com
 * @LastEditTime: 2022-12-08 16:02:17
 * @FilePath: /movie-notice/Users/qinze/workspace/code/hello-node/service.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
var http = require("http");
http.createServer(function (request, response) {
    //发送TTP头部
    //HTTP状态值 200 OK
    //内容类型 text/plain
    response.writeHead(200, { "Content-Type": "text/plain" });
    request.
    //发送响应数据
    response.end("Hello World\n");
  })
  .listen(8888);
console.log("Server running at http://127.0.0.1:8888/");

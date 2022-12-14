let server = require("./serverV2");
let router = require("./router");
console.log(__filename);
console.log(__dirname)
let timeout = setTimeout(function () {
  console.log("hello setTimeOut");
}, 2000);
let timeout2 = setTimeout(function () {
  console.log("hello setTimeOut2");
}, 3000);
clearTimeout(timeout);

function printHello(){
  console.log( "Hello, World!");
}
// 两秒后执行以上函数
setInterval(printHello, 2000);

server.start(router.route);
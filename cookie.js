let express = require('express');
let cookieParser = require('cookie-parser');
let util = require('util');

let app = express();
app.use(cookieParser());

app.get('/', function (req, res) {
  console.log("Cookies:" + util.inspect(req.cookies));
});

app.listen(8081);
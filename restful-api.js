let express = require('express');
let fs = require('fs');
let app = express();

app.get('/listUsers', function (req, res) {
  fs.readFile(__dirname + "/" + "user.json", 'utf-8', function (err, data) {
    console.log(data);
    data = JSON.parse(data);
    delete data['user1']
    res.end(JSON.stringify(data));
  });
});

app.listen(8081);


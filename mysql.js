let mysql = require('mysql');
let connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootroot',
  database: 'movie-notice',
});

connection.connect();

connection.query('select * from movie as movie', function (err, results, fields) {
  if (err) {
    throw err;
  }
  let movie = results[0];

  console.log("name:" + movie.name + "db_id:" + movie.db_id)
});
var mysql = require('mysql');
// mysql 모듈을 사용해 node 와 database 를 연결시켜줌
var connection = mysql.createConnection({
  host: 'localhost',
  post: 3306,
  user: 'root', // MySQL id
  password: 'gotn1346', // MySQL pw
  database: 'test' // 데이터베이스 테이블 명
});

module.exports = connection;

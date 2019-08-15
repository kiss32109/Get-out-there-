var express = require('express');
var router = express.Router();
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);

var options = {
  host: 'localhost',
  post: 3306,
  user: 'root', // MySQL id
  password: 'gotn1346', // MySQL pw
  database: 'test' // 데이터베이스 스키마명
}

router.use(session({
  secret: 'asdfjxclz@#(*)#DFLKJV',
  resave: false,  // 세션 id 를 접속할 때마다 새로 발급하는 것
  saveUninitialized: true, // 실제로 세션을 사용하기 전까지 발급하지 않는다
  store: new MySQLStore(options)
}));

/* GET home page. */
router.get('/', function(req, res, next) {
    /* 요청 세션의 usersession 의 값을 확인 */
    var session_confirm = req.session.usersession;
    var validate = req.session.validate;
    if(session_confirm != undefined){
       res.render('index');
     } else {
      res.render('index');
     }

     if(validate != undefined){
       res.render('index');
     }

});

module.exports = router;

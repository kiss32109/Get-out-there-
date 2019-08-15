var express = require('express');
var router = express.Router();

var mysql_db = require('../mysql-db');
var bcrypt = require('bcrypt-nodejs');

// session & session-file-store
var session = require('express-session');
 /* express-session
  - 세션을 다룰 수 있게 해주는 모듈, 기본적으로 메모리에 세션을 담아줌
  - 실제로 사용되기에는 보안적으로 많이 취약함
 */
var MySQLStore = require('express-mysql-session')(session);
/*
  서버를 실행시키면 express-mysql-session 가 실행됨에 따라
  'test' 데이터베이스 스키마에
   sessions 테이블(session_id, expires, data 의 컬럼을 가진)이 자동으로 추가됨
*/
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

router.get('/', function(req, res, next){
  res.redirect('index');
});

router.post('/', function(req, res, next) {
  /* 로그인 성공 후, 게임시작으로 게임 내에 접속했다가 다시
  로그인 화면으로 와서 로그아웃 후, 재로그인을 하면
  cmd창에 Error: Cannot enqueue Handshake after invoking quit.가 떴음
  오류 해결 → 이미 require를 mysql-db.js 로 하고 그 안에서 이미 connection 이 있음
  또한 createConnection 을 하게되면 굳이 connect 를 해주지 않아도 된다고 함 (중복처리가 됨)
   */
  //mysql_db.connect();
  // index 페이지에서 보낸 아이디와 비밀번호를  변수 user에 저장함
  var user = {
    userEmail: req.body['userEmail'],
    userPassword: req.body['userPassword'],
  }

  var sql = 'SELECT * FROM test.user WHERE user_email = ?';
  var params = user.userEmail;

  mysql_db.query(sql, params , function(err, rows, fields){
    if(!err){ // 쿼리문이 오류가 나지 않았다면
        if(rows[0] != undefined){ // 쿼리문 결과 rows 의 첫번째 인덱스의 값이 있을 때
          /* 입력한 비밀번호와 해싱된 비밀번호가 일치하는지 확인하는 변수. 일치 - true, 불일치 - fasle */
          var result = bcrypt.compareSync(user.userPassword, rows[0]['user_password']);

          if(result){
            /* 로그인 한 유저의 nickname을 sessions 테이블 data 컬럼에 넣어줌 */
            req.session.nickname = rows[0].user_nickname;
            // ↓ 마찬가지로 서버가 실행될 때 생성되는 session id의 값을 sessions 테이블 data 컬럼에 넣어줌
            // ↓ usersession 은 페이지가 이동되거나 새로고침을 했을 때 로그인 상태를 유지하기 위해 사용
            req.session.usersession = req.sessionID;

            // save() 함수 설명은 밑쪽에 적어놓음
            req.session.save(function(){
              res.redirect('/');
            });
          } else {
            res.send('error : ' + err);
          }
        } else {
          res.redirect('/');
        }
      } else {
        res.send('error : ' + err);
      }
  });
});


router.get('/logout', function(req, res){
  if(req.session){
    delete req.session.destroy();
    res.redirect('/');
  } else {
    res.redirect('/');
  }
});


/* req.session.save(function(){})
 → 세션에 어떤 값을 추가하거나, 지울 때는 데이터베이스에 저장을 하는데
  저장이 끝나기도 전에, redirect() 가 실행될 수 있기 때문에
  save() 라는 함수는 데이터베이스에 저장이 끝났을 때, 콜백함수을 호출함
  즉, /logout 에서 delete 명령이 끝난 뒤에 redirect 가 실행되는 것
  이것은 redirect 를 사용할 때만 쓴다고 함.
*/

module.exports = router;

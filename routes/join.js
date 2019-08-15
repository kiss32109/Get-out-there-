var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');

var mysql_db = require('../mysql-db');

router.get('/', function (req, res, next) {
    res.render('join');
});

router.post('/', function (req, res, next) {
    /* 입력받은 회원정보들을 담을 변수 */
    var user = {
      userName: req.body['signup-nickname'],
      userEmail: req.body['signup-email'],
      userPassword: req.body['signup-password'],
    };
    /* 랜덤한 값을 더하여 결과값을 무작위로 만들어줌 */
    const salt = bcrypt.genSaltSync(10);
    const hashpw = bcrypt.hashSync(user.userPassword, salt, null);

    var params = [user.userName, user.userEmail, hashpw];

    var validate = function(){
      var sql = 'SELECT * FROM test.user WHERE user_nickname = ? OR user_email = ? ';
      mysql_db.query(sql, params, function(err, rows, fields){
        if(!err){
          if(rows[0]){
            req.session.validate = true;
            req.session.save(function(){
              res.redirect('/');
            });
          } else {
            join_function(params);
          }
        } else {
          res.send('err : ' + err);
        }
      });
    }

    var join_function = function(params){
      var sql = 'INSERT INTO test.user (user_nickname, user_email, user_password) values (?,?,?)';

      if (user.userName != null && user.userEmail != null && user.userPassword != null) {
          mysql_db.query(sql, params, function (err, rows, fields) {
              if (!err) {
                  res.redirect('/');
              } else {
                  res.send('err : ' + err);
              }
          });
      }else{
          res.send('password not match;');
      }
    }

    validate();
});



module.exports = router;

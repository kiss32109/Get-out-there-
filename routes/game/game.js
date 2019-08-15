var express = require('express');
var router = express.Router();

/* GET game page. */
router.get('/', function(req, res, next) {
  /* 로그인 상태 확인하여 게임접속을 허락 및 거절 */
  if(req.session.nickname){
    res.render('game/game');
  } else {
    res.redirect('/');
  }
});


module.exports = router;

const UTILITY = require('./utility.js');


/* Initial Setting */

SOCKET_LIST = {};
DEBUG = true;

// 세션 데이터들을 가져오기 위한 과정
var mysql_db = require('mysql');
var connect = mysql_db.createConnection({
  host: 'localhost',
  post: 3306,
  user: 'root', // MySQL id
  password: 'gotn1346', // MySQL pw
  database: 'test' // 데이터베이스 스키마명
});

/* 게임 로직 내 닉네임에 필요한 변수 */
var nickname = ''

var session_connect = function(socket_connect){
  var sql = 'SELECT * FROM test.sessions';
  connect.query(sql, function(err, rows, fields){
    if(!err){
      // 혹시나 세션이 한 개 이상 생겼을 때, 내용을 걸러주는 for 문
      for(var i=0; i < rows.length; i++){
        /*
         rows 는 쿼리문이 오류없이 정상 처리되었을 때, 출력되는 row 들이다.
         rows[i].data : {"cookie":{"originalMaxAge":null,"expires":null,"httpOnly":true,"path":"/"},"nickname":"오해수","usersession":"6-GsrDZeKvqUrpnRSCZcggUg77YFGJMP"}
         rows[i].data.substr(88) : 오해수","usersession":"6-GsrDZeKvqUrpnRSCZcggUg77YFGJMP"}

        "path":"/"} 까지는 일반 세션 데이터이고, 그 뒤가 로그인 되었을 때 세션에 넣어주는 데이터들임
       */

        if(rows[i].data.substr(88).length > 0){
          nickname = rows[i].data.substr(88).split('"'); // 오해수 라는 이름을 사용하기 위해 " 를 기준으로 잘라 배열로 만듬
          session_id = rows[i].session_id; // test.sessions 의 session_id 라는 컬럼의 데이터를 가져옴

          socket_connect();
        }
      }
    } else {
      console.log('error : ' + err);
    }
  });
}

var session_delete = function(session_id){
  var sql = "DELETE FROM test.sessions WHERE session_id = ?";
  connect.query(sql, session_id,function(err, rows,fields){
    if(!err){
      return;
    } else {
      console.log('error : ' + err);
    }
  });
}

module.exports = function(io) {
  /* session_delete 에 필요한 변수 */
  var session_id = '';
  //소켓 연결 시 이벤트

  io.on('connection', function(socket) {
    /*
    [게임시작 후, 닉네임이 undefined 로 뜨는 경우가 발생 ]
    서버가 실행되자마자 이미 query 가 한번 돌고
    session_connect() 의 if가 실행되지 않음 → 로그인이 되지 않아서
    sessions 테이블에 로그인 정보가 없기 때문에
      → if 문 : nickname 이란 변수에 nickname 을 담아주는 조건문
    버그 해결 → session_connect() 와 socket_connect() 를 나눠
    session_connect()가 정상적으로 완료되었을 경우에만
    socket_connect 를 해주도록 코딩
    */
    var socket_connect = function(){
      socket.id = UTILITY.getGUID();

      //소켓 전역 리스트에 고유 소켓 ID를 기준으로 해당 소켓 등록
      SOCKET_LIST[socket.id] = socket;

      //신규 연결된 소켓을 기준으로 플레이어 객체 생성
      Player.onConnect(socket, nickname[0]);

      /* 오브젝트의 상호 작용을 위한 소켓 연결 */
      Objects.interaction(socket);
    }

    session_connect(socket_connect);


    //소켓 연결 종료 처리 이벤트
    socket.on('disconnect',function(){
        //소켓 전역 리스트에서 연결 종료 처리된 소켓 제거
        delete SOCKET_LIST[socket.id];
        // 소켓 종료 시, 세션 데이터를 제거
        session_delete(session_id);
        //연결 종료 처리된 소켓을 기준으로 해당 플레이어 객체 처리
        Player.onDisconnect(socket);
    });

    socket.on('evalServer', function(data) {
      if(!DEBUG) {
        return;
      }
      var res = eval(data);
      socket.emit('evalAnswer', res);
    });
  });
  /* /서버, 클라이언트 간 상호 통신 이벤트 */

  /* 클라이언트 페이지 최신화 적용을 위한 인터벌 함수
     페이지 최신화 간격은 (1000/25초)를 기준으로 한다. */
    setInterval(function(){
      var packs = Entity.getFrameUpdateData();

     	for(var i in SOCKET_LIST){
     		var socket = SOCKET_LIST[i];
     		socket.emit('init',packs.initPack);
     		socket.emit('update',packs.updatePack);
     		socket.emit('remove',packs.removePack);
     	}
     },1000/25);
};

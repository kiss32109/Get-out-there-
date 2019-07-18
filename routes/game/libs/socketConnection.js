const UTILITY = require('./utility.js');

/* Initial Setting */
SOCKET_LIST = {};
DEBUG = true;
/* /Initial Setting */

module.exports = function(io) {
  //소켓 연결 시 이벤트
  io.on('connection', function(socket) {

    console.log('SOCKET CONNECTED');

    //소켓 고유 ID를 임의의 숫자로 설정
    socket.id = UTILITY.getGUID();
    //소켓 전역 리스트에 고유 소켓 ID를 기준으로 해당 소켓 등록
    SOCKET_LIST[socket.id] = socket;

		/*
			데이터 베이스 연동시 로그인 처리를 위한 작업
			(기본 예제로 상황에 맞게 변경 필요)

		socket.on('signIn',function(data){ //{username,password}
			isValidPassword(data,function(res){
				if(res){
					Player.onConnect(socket,data.username);
					socket.emit('signInResponse',{success:true});
				} else {
					socket.emit('signInResponse',{success:false});
				}
			});
		});
		socket.on('signUp',function(data){
			isUsernameTaken(data,function(res){
				if(res){
					socket.emit('signUpResponse',{success:false});
				} else {
					addUser(data,function(){
						socket.emit('signUpResponse',{success:true});
					});
				}
			});
		});
		*/

    //신규 연결된 소켓을 기준으로 플레이어 객체 생성
    Player.onConnect(socket,('Temporary_' + ("" + socket.id).slice(2, 7)));
    /* 오브젝트의 상호 작용을 위한 소켓 연결 */
    Objects.interaction(socket);
    //소켓 연결 종료 처리 이벤트
    socket.on('disconnect',function(){
      console.log('SOCKET DISCONNECTED');
        //소켓 전역 리스트에서 연결 종료 처리된 소켓 제거
        delete SOCKET_LIST[socket.id];
        //연결 종료 처리된 소켓을 기준으로 해당 플레이어 객체 처리
        console.log(socket);
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
    }, 60);
};

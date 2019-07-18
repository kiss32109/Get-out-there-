/* Player */
Player = function(param) {
  var self = Entity(param);
  //객체 닉네임 설정
  self.username = param.username;
  //마우스 포인터 기점 방향각 설정
  self.mouseAngle = 0;
  //객체 최대 이동속도 설정
  self.maxSpd = 16;
  //객체 체력 및 최대 체력 설정
  self.hp = 10;
  self.hpMax = 10;
  self.energy = 100;
  self.energyMax = 100;
  //객체 게임 스코어 설정
  self.score = 0;
  //게임 내 객체 인벤토리 설정
  self.inventory = new Inventory(self.id);
  self.closet = new Closet(self.id);
  self.weapon = new Weapon(self.id);

  //객체 이벤트 활성화 상태 변수
  self.movement = {
    LEFT: false,
    RIGHT: false,
    UP: false,
    DOWN: false,
  };

  self.interaction = {
    target: {},
    activating: false,
  };

  self.attacking = false;

  /* 플레이어 객체 상태 업데이트
     중복 상태 업데이트는 엔티티 객체의 업데이트 메서드를 상속받아 이용
   */
  var super_update = self.update;
  self.update = function() {
    //플레이어 고유 X, Y축 이동 관련 설정 업데이트
    self.updateSpd();
    //엔티티 객체 업데이트 메서드 상속
    super_update();
    //공격 이벤트 활성화 처리
    if(self.attacking) {
      if(self.energy!==0) {
        self.energy--;
        self.shootBullet(self.mouseAngle);
      }
      else {
        return;
      }
    }
  }

  //Bullet 생성 메서드
  self.shootBullet = function(angle) {
     /* 마우스 방향각과, 생성자 플레이어 객체 정보를 전달받는
        Bullet 객체 생성
        생성되는 초기 위치는 Player 객체의
        현재 X, Y 좌표를 기준으로 설정 */
     Bullet({
       parent: self.id,
       angle: angle,
       location: {
         x: self.location.x,
         y: self.location.y,
         direction: self.location.direction,
       },
       field: self.field,
     });
  }

  /* 키보드 상하좌우 이벤트 처리 */
  self.updateSpd = function() {

    if(self.movement.RIGHT || self.movement.LEFT || self.movement.DOWN || self.movement.UP) {
      self.location.status = 'MOVE';
    }

    /* X축 이동 처리 */
    if(self.movement.RIGHT) {
      self.spdX = self.maxSpd;
      //스프라이트 시트 내 오른쪽 방향칸 지정
      self.location.direction = 2;
    }
    else if(self.movement.LEFT) {
      self.spdX = -self.maxSpd;
      //스프라이트 시트 내 왼쪽 방향칸 지정
      self.location.direction = 3;
    }
    else {
      self.spdX = 0;
    }
    /* Y축 이동 처리 */
    if(self.movement.UP) {
      self.spdY = -self.maxSpd;
      //스프라이트 시트 내 위쪽 방향칸 지정
      self.location.direction = 1;
    }
    else if(self.movement.DOWN) {
      self.spdY = self.maxSpd;
      //스프라이트 시트 내 아래쪽 방향칸 지정
      self.location.direction = 0;
    }
    else {
      self.spdY = 0;
    }
    if(!(self.movement.RIGHT || self.movement.LEFT || self.movement.DOWN || self.movement.UP)
      && self.location.status!=='INTERACT') {
      self.location.status = 'HOLD';
    }
  }

  /* 클라이언트로 전달할 플레이어 객체의
     초기 설정 */
  self.getInitPack = function(){
    return {
      id: self.id,
			username: self.username,
      location: {
        x: self.location.x,
        y: self.location.y,
        status: self.location.status,
        direction: self.location.direction,
      },

      hp: self.hp,
      hpMax: self.hpMax,
      energy: self.energy,
      energyMax: self.energyMax,

      score: self.score,
      field: self.field,
      closet: self.closet,
      weapon: self.weapon,
      interaction: self.interaction,
      inventory: self.inventory,
    };
  }
  /* 클라이언트로 전달할 플레이어 객체의
     업데이트 정보 설정 */
  self.getUpdatePack = function(){
    return {
      id: self.id,
      location: {
        x: self.location.x,
        y: self.location.y,
        status: self.location.status,
        direction: self.location.direction,
      },

      hp: self.hp,
      energy: self.energy,

      score: self.score,
			field: self.field,
      closet: self.closet,
      weapon: self.weapon,
      interaction: self.interaction,
      inventory: self.inventory,
    }
  }
  /* 플레이어 전역 리스트에 고유 ID를 기준으로,
     객체 등록 후 반환 */
  Player.list[self.id] = self;
  initPack.player.push(self.getInitPack());
  return self;
}
// 플레이어 전역 리스트 설정
Player.list = {};

/* 플레이어의 접속 상태 처리 설정 */
Player.onConnect = function(socket, username) {

  /* 플레이어 생성자를 이용한 객체 생성 */
  var player = Player({
		username: username,
    id: socket.id,
    socket: socket,
  });
  player.field.setDefaultMap();
  player.closet.setDefaultMale();
  player.weapon.setDefaultBullet();

  /* */
  socket.on('quickUseItem', function(data) {
    for(var index=0; index<player.inventory.items.length; index++) {
      if(player.inventory.items[index]===undefined) {console.log(data);continue;}
      if(player.inventory.items[index].id === data) {
        player.inventory.items[index].event(player);
        if(--player.inventory.items[index].amount===0) {
          delete player.inventory.items[index];
        }
        player.socket.emit('updatingUserQuickBar', player.inventory);
      }
    };
  })

  socket.on('wearingCloth', function(data) {
    for(var index=0; index<player.inventory.items.length; index++) {
      if(player.inventory.items[index]===undefined) {console.log(data);continue;}
      if(player.inventory.items[index].id === data) {
        player.inventory.items[index].event(player);
        if(--player.inventory.items[index].amount===0) {
          delete player.inventory.items[index];
        }
        player.socket.emit('updatingUserCloset', { inventory:player.inventory, closet:player.closet });
      }
    };
  });

  socket.on('addItem', function(data) {
    let item = data.item;

    player.inventory.addItem(item);
    player.socket.emit('updatingUserQuickBar', player.inventory);
  });

  socket.on('changeItemOrder', function(data) {
    let toMoveItem = player.inventory.items[data.toMoveIndex]
    let toBeMovedItem = player.inventory.items[data.toBeMovedIndex];
    if(toMoveItem===undefined) return;
    else if(toBeMovedItem===undefined){
      player.inventory.items[data.toMoveIndex] = undefined;
      player.inventory.items[data.toBeMovedIndex] = toMoveItem;
    }
    else {
      player.inventory.items[data.toBeMovedIndex] = toMoveItem;
      player.inventory.items[data.toMoveIndex] = toBeMovedItem;
      console.log(player.inventory.items);
    }
    player.socket.emit('updatingUserQuickBar', player.inventory);
  })
  /* / */

  // 플레이어 객체에 키보드에 설정된 이동키 입력 이벤트 등록
  socket.on('movement', function(data) {
    player.movement = data;
  });
  // 오브젝트와의 상호작용을 위한 키보드 입력 이벤트 등록
  socket.on('interacting', function(data) {
    /* 상호작용이 가능한 오브젝트일 경우만 활성화 */
    if(!player.field.getFrontTile(player.location, player.field.map.field)) {
      return;
    }
    else if(player.field.getFrontTile(player.location, player.field.map.field).constructor===Object) {
        player.interaction.activating = data.activating;
        player.location.status = 'INTERACT';
        player.interaction.target = player.field.getFrontTile(player.location, player.field.map.field);
        player.socket.emit('InteractWith', player.interaction);
    }
  });
  socket.on('attacking', function(data) {
    player.attacking = data.attacking;
    player.mouseAngle = data.angle;
  });

	/*
	socket.on('changeMap', function(data) {

    console.log(data);

		if(Player.list[data].field === 'spring_forest') {
			Player.list[data].field = 'fall_forest';
		}
		else {
			Player.list[data].field = 'spring_forest';
		}
	});
  */

	/* 게임 내 전체 채팅 이벤트 설정 */
	socket.on('sendMsgToServer', function(data){
		for(var i in SOCKET_LIST) {
			SOCKET_LIST[i].emit('addToChat', {
        username: player.username,
        text: data.text
      });
		}
	});

	/* 게임 내 귓속말 채팅 이벤트 설정 */
	socket.on('sendPmToServer',function(data){ //data:{username,message}
		//귓속말 채팅을 전달받을 수신 소켓을 담을 변수
		var recipientSocket = null;
		/* 접속중인 플레이어중 수신 유저 정보와 일치하는 플레이어, 소켓 찾기 */
		for(var i in Player.list) {
			if(Player.list[i].username === data.username) {
				recipientSocket = SOCKET_LIST[i];
			}
		}
		/* 일치하는 플레이어를 찾지 못한 경우 */
		if(recipientSocket === null){
			socket.emit('addToChat','The player ' + data.username + ' is not online.');
		}
		/* 일치하는 플레이어를 찾은 경우 */
		else {
			recipientSocket.emit('addToChat','From ' + player.username + ':' + data.message);
			socket.emit('addToChat','To ' + data.username + ':' + data.message);
		}
	});

  /* 신규 유저 접속 시, 연결유저 목록에 포함시키고,
     연결중인 모든 유저들의 상태 정보를 최신화 하며,
     클라이언트로 (새로 연결된 유저에게만) 해당 정보를 전달한다. */
  socket.emit('init', {
		SELF_ID: socket.id,
		player: Player.getAllInitPack(),
		bullet: Bullet.getAllInitPack(),
	});
}

Player.getAllInitPack = function(){
	var players = [];
	for(var i in Player.list) {
		players.push(Player.list[i].getInitPack());
  }
	return players;
}

/* 플레이어의 비접속 상태 처리 설정 */
Player.onDisconnect = function(socket) {
    //플레이어 전역 리스트에서 연결 종료 처리된 소켓 ID를 기준으로 하는 객체 제거
    delete Player.list[socket.id];
    //접속종료 플레이어 리스트에 해당 플레이어 추가
    removePack.player.push(socket.id);
}

/* 연결중인 모든 플레이어 객체 최신화 */
Player.update = function() {
  //최신화된 플레이어 객체들을 담을 임시 변수
  var pack = [];
  //등록된 모든 플레이어 객체 최신화 과정
  for(var i in Player.list) {
    var player = Player.list[i];
    player.update();
    pack.push(player.getUpdatePack());
  }
  return pack;
}
/* /Player */

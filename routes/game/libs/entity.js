
/* Initial Setting */

initPack = {player:[],bullet:[]};
removePack = {player:[],bullet:[]};

/* /Initial Setting */

/*
  Entity 클래스 정의
  Bullet, Player 객체의 기반
*/
Entity = function(param) {
  var self = {
    /* 화면에 표시될 좌표 변수 X, Y */
    location: {
      x: 0,
      y: 0,
      status: 'HOLD',
      direction: 0,
    },
    /* X축, Y축 이동 속도 */
    spdX: 0,
    spdY: 0,
    /* 객체 고유 ID */
    id: "",
    /* 객체가 속할 맵 정보 */
    field: new Field(),
    socket: null,
  }

  /* 파라미터 정보를 기준으로
     플레이어 객체를 생성할 생성자 */
  if(param){
		if(param.location) {
      if(param.location.x) self.location.x = param.location.x;
  		if(param.location.y) self.location.y = param.location.y;
      if(param.location.direction) self.location.direction = param.location.direction;
    }
		if(param.id) {
      self.id = param.id;
      self.field.parent = param.id;
    }
    if(param.field) self.field = param.field;
    if(param.socket) self.socket = param.socket;
	}

  /* 객체 상태 업데이트 */
  self.update = function() {
    self.updateField();
    self.updatePosition();
  }
  self.updateField = function() {
    /* 해당 플레이어가 속한 필드 맵 찾기 */
    for(var indexMAP in Maps.list) {
      if(self.field.map.id === Maps.list[indexMAP].id) {
        self.field.map = Maps.list[indexMAP]
      }
    }
  }
  /* X, Y축 이동속도를 반영한 좌표값 변경 메소드 */
  self.updatePosition = function() {

    var leftBumper,rightBumper,topBumper,bottomBumper;

    var newX = self.location.x;
    var newY = self.location.y;

    /* 플레이어 객체 이미지를 바탕으로 상하좌우 충돌 범퍼 설정 */
    if(self.closet !== undefined) {
      leftBumper = { x:self.location.x-(self.closet.closet.parts.width) ,y:self.location.y};
  		rightBumper = { x:self.location.x+(self.closet.closet.parts.width) ,y:self.location.y};
  		topBumper = { x:self.location.x, y:self.location.y-(self.closet.closet.parts.height) };
  		bottomBumper = { x:self.location.x, y:self.location.y+(self.closet.closet.parts.height) };

      if(self.field.collision(leftBumper, self.field.map.field)==='ENTITY'
        || self.field.collision(leftBumper, self.field.map.field)==='PLAYER') {
        newX += 5;
      }
      else if(self.field.collision(rightBumper, self.field.map.field)==='ENTITY'
        || self.field.collision(rightBumper, self.field.map.field)==='PLAYER') {
        newX -= 5;
      }
      else if(self.field.collision(topBumper, self.field.map.field)==='ENTITY'
        || self.field.collision(topBumper, self.field.map.field)==='PLAYER') {
        newY += 5;
      }
      else if(self.field.collision(bottomBumper, self.field.map.field)==='ENTITY'
        || self.field.collision(bottomBumper, self.field.map.field)==='PLAYER') {
        newY -= 5;
      }
      else {
        newX += self.spdX;
        newY += self.spdY;
      }
    }

    /* 불릿 객체 이미지를 바탕으로 상하좌우 충돌 범퍼 설정 */
    if(self.toRemove !== undefined) {

      leftBumper = { x:self.location.x, y:self.location.y };
  		rightBumper = { x:self.location.x, y:self.location.y };
  		topBumper = { x:self.location.x, y:self.location.y };
  		bottomBumper = { x:self.location.x, y:self.location.y };

      if(self.field.collision(leftBumper, self.field.map.field)==='ENTITY'
        || self.field.collision(leftBumper, self.field.map.field)==='BULLET') {
        self.toRemove = true;
      }
      else if(self.field.collision(rightBumper, self.field.map.field)==='ENTITY'
        || self.field.collision(rightBumper, self.field.map.field)==='BULLET') {
        self.toRemove = true;
      }
      else if(self.field.collision(topBumper, self.field.map.field)==='ENTITY'
        || self.field.collision(topBumper, self.field.map.field)==='BULLET') {
        self.toRemove = true;
      }
      else if(self.field.collision(bottomBumper, self.field.map.field)==='ENTITY'
        || self.field.collision(bottomBumper, self.field.map.field)==='BULLET') {
        self.toRemove = true;
      }
      else {
        newX += self.spdX;
        newY += self.spdY;
      }
    }

    self.location.x = newX;
    self.location.y = newY;
  }
  /* 파라미터로 받은 타 엔티티 객체와의 거리 파악 메서드 */
  self.getDistance = function(entity) {
    return Math.sqrt(Math.pow(self.location.x-entity.location.x, 2) + Math.pow(self.location.y-entity.location.y, 2));
  }
  return self;
}
/* 클라이언트로 전달할 데이터 최신화 작업 */
Entity.getFrameUpdateData = function(){
	var pack = {
		initPack:{
			player:initPack.player,
			bullet:initPack.bullet,
		},
		removePack:{
			player:removePack.player,
			bullet:removePack.bullet,
		},
		updatePack:{
			player:Player.update(),
			bullet:Bullet.update(),
		}
	};
	initPack.player = [];
	initPack.bullet = [];
	removePack.player = [];
	removePack.bullet = [];
	return pack;
}

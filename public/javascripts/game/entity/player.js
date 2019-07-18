/* Client.Player */
/* 서버에서 전달받은 플레이어 객체를 토대로,
   클라이언트에서 표현할 플레이어 객체 생성 */
var Player = function(initPack){
  var self = {};
  /* 클라이언트에서 필요한 플레이어 객체 변수 초기화 */
  self.id = initPack.id;
  self.username = initPack.username;
  self.location = initPack.location;

	self.hp = initPack.hp;
	self.hpMax = initPack.hpMax;
  self.energy = initPack.energy;
  self.energyMax = initPack.energyMax;

	self.score = initPack.score;

	self.field = initPack.field;
  self.closet = initPack.closet;
  self.weapon = initPack.weapon;

  self.interaction = initPack.interaction;
  self.inventory = initPack.inventory;

	/* 스프라이트 시트 프레임을 기준으로 표시될 칸 설정,
	 	 애니메이션 효과를 위한 움직임 카운터 */
	self.fieldRenderer = new FieldRenderer({
    location: self.location,
    field: self.field.map.field,
  });
  self.closetRenderer = new ClosetRenderer({
    location: self.location,
    drawing: self.closet,
  });

  /* 생성한 플레이어 객체 페이지에 표시 */
  self.draw = function(){
    /* 현재 표시할 플레이어 객채의 맵정보와 상이한 플레이어 객체는
       표시하지 않기 위한 처리 */
    if(Player.list[SELF_ID].field.map.id !== self.field.map.id) {
      return;
    }
    /* 플레이어 객체가 표시될 X,Y 좌표 설정 */
    var x = self.location.x - Player.list[SELF_ID].location.x + WIDTH/2;
    var y = self.location.y - Player.list[SELF_ID].location.y + HEIGHT/2;

    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(x-21, y, 5, 5); //LEFT
    ctx.fillRect(x+16, y, 5, 5); //RIGHT
    ctx.fillRect(x, y-32, 5, 5); //TOP
    ctx.fillRect(x, y+27, 5, 5); //BOTTOM
    
    self.closetRenderer.playerClicking(self, x, y);
    self.closetRenderer.render(x, y);
  }

  /* 클라이언트 플레이어 객체 전역 리스트에 해당 플레이어 등록 후 반환 */
  Player.list[self.id] = self;
  return self;
}
//클라이언트 플레이어 객체 전역 리스트 설정
Player.list = {};
/* /Client.Player */

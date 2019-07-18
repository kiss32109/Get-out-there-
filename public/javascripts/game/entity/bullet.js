/* Client.Bullet */
/* 서버에서 전달받은 불릿 객체를 토대로,
   클라이언트에서 표현할 불릿 객체 생성 */
var Bullet = function(initPack){
  var self = {};
  /* 클라이언트에서 필요한 불릿 객체 변수 초기화 */
  self.id = initPack.id;
  self.location = {
    x: initPack.location.x,
    y: initPack.location.y,
  }
  self.field = initPack.field;
  self.angle = initPack.angle;
  self.toEffect = initPack.toRemove;

  self.bulletRenderer = new BulletRenderer({
    location: self.location,
    drawing: Player.list[SELF_ID].weapon,
  });

  /* 생성한 불릿 객체 페이지에 표시 */
  self.draw = function(){

    /* 플레이어 객체의 맵정보와 불릿 객체의 맵정보가 상이할 경우,
       해당 불릿 객체는 표시되지 않도록 설정 */
    if(Player.list[SELF_ID].field.map.id !== self.field.map.id){
      return;
    }

    /* 불릿 객체가 표시될 X,Y 좌표 설정 */
    var x = self.location.x - Player.list[SELF_ID].location.x + WIDTH/2;
    var y = self.location.y - Player.list[SELF_ID].location.y + HEIGHT/2;

    /* 위의 이미지 표시 설정 정보를 토대로,
       클라이언트 페이지에 표시 */
    self.bulletRenderer.render(x, y, self.angle, self.toEffect);
  }

  /* 클라이언트 불릿 객체 전역 리스트에 해당 불릿 객체 등록 후 반환 */
  Bullet.list[self.id] = self;
  return self;
}
//클라이언트 플레이어 객체 전역 리스트 설정
Bullet.list = {};
/* /Client.Bullet */

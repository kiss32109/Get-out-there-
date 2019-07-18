Weapon = function(parent){

    var self = {
      parent: parent,
      selected: {},
      list: {},
    }

    /* 필드에 디폴트맵 추가 작업 */
    self.setDefaultBullet = function(){
      /* 이미 목록에 있는 경우 */
		  for(var i in self.list){
      	if(self.list[i].id === Bullets.list['fire_ball']){
      		self.list = [];
      	}
    	}
      self.list = Bullets.list['fire_ball'];
      self.selected = Bullets.list['fire_ball'];
    }

	return self;
}

Bullets = function(id, name, tiles){
	var self = {
		id: id,
		name: name,
    tiles: tiles,
	}
	Bullets.list[self.id] = self;
	return self;
}
Bullets.list = {};
/* /맵 클래스 정의 */

Bullets(
  "fire_ball",
  "Fire Ball",
  tiles = {
    bullet: {
      columns: 3,
      width: 48,
      height: 48,
      img: 'bullet_fireball',
    },
    effect: {
      columns: 5,
      width: 48,
      height: 48,
      img: 'fire_effect_3',
    },
  });

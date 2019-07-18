/* Bullet */
Bullet = function(param) {
  var self = Entity(param);
  //객체 고유 ID를 임의의 숫자로 등록
  self.id = Math.random();
	//파라미터로 전달받은 불릿 객체 방향각 설정
	self.angle = param.angle;
  /* 객체 X, Y축 이동 속도 설정 */
  self.spdX = Math.cos(param.angle/180 * Math.PI) * 10;
  self.spdY = Math.sin(param.angle/180 * Math.PI) * 10;
  //불릿 객체를 생성할 플레이어 객체를 파라미터로 넘겨받아 등록
  self.parent = param.parent;
  //불릿 생성 후, 일정 시간뒤 제거하기까지의 타이머 설정
  self.timer = 0;
  //불릿 자체 제거를 위한 상태 변수 설정
  self.toRemove = false;

  //불릿 종류를 결정할 변수

  /* 불릿 객체 상태 업데이트
     중복 상태 업데이트는 엔티티 객체의 업데이트 메서드를 상속받아 이용
   */
  var super_update = self.update;
  self.update = function() {
    /* 불릿 자체 제거를 위한 타이머
       (1000/25)초 마다 1회씩 총 100회 상태 업데이트 후
       제거 예정 */
    if(self.timer++ > 100) {
      self.toRemove = true;
    }
    super_update();
    /* 플레이어 객체에 접근시 처리를 위한 과정 */
    for(var i in Player.list){
			var p = Player.list[i];

      /* 동일 맵 정보를 가진 불릿 객체들에 한해서,
				 발사채 생성자를 제외한 플레이어와 발사채 간의 거리를 파악하고,
         일정 거리 안에 들었을 시(발사채에 피격되었을 시)에 대한 이벤트 처리 */
			if(self.field.map.id === p.field.map.id && self.getDistance(p) < 32 && (self.parent !== p.id)){
        //발사채 피접근자 체력 감소
				p.hp -= 1;

        /* 피격된 플레이어의 체력이 더이상 남아있지 않는 경우,
           발사채 생성자의 스코어를 증가시키고
           피격된 플레이어의 체력을 모두 회복시킨 뒤, 임의의 좌표를 새로 등록*/
				if(p.hp <= 0){
					var shooter = Player.list[self.parent];
					if(shooter) {
            if(p.score!==0) shooter.score += p.score;
            else shooter.score += 1;
          }
          Objects.createObjectHasDiedItems(p);

					p.hp = p.hpMax;
          p.score = 0;
					p.location.x = Math.random() * 500;
					p.location.y = Math.random() * 500;
				}
        //피격 처리된 발사채 제거
				self.toRemove = true;
			}
		}
  }
  //클라이언트로 전달할 불릿 객체의 초기값 설정
  self.getInitPack = function(){
		return {
			id: self.id,
      location: {
        x: self.location.x,
        y: self.location.y,
      },
			field: self.field,
      angle: self.angle,
      toRemove: self.toRemove,
		};
	}
  //클라이언트로 전달할 불릿 객체 정보 업데이트
	self.getUpdatePack = function(){
		return {
			id: self.id,
      location: {
        x: self.location.x,
        y: self.location.y,
      },
      field: self.field,
      angle: self.angle,
      toRemove: self.toRemove,
		};
	}
  /* 불릿 전역 리스트에 고유 ID를 기준으로,
     객체 등록 후 반환 */
  Bullet.list[self.id] = self;
  initPack.bullet.push(self.getInitPack());
  return self;
}
//불릿 전역 리스트 설정
Bullet.list = {};

/* 생성된 모든 불릿 객체 최신화 */
Bullet.update = function() {
  //최신화된 불릿 객체들을 담을 임시 변수
  var pack = [];
  //등록된 모든 불릿 객체 최신화 과정
  for(var i in Bullet.list) {
    var bullet = Bullet.list[i];
    //개별 불릿 객체 상태 업데이트
    bullet.update();
    /* 불릿 객체 상태에 따른 제거 이벤트 */
    if(bullet.toRemove) {
      /* 불릿 충돌 시 이펙트 설정 */
      pack.push(bullet.getUpdatePack());
      //불릿 전역 리스트에서 해당 불릿 객체 제거
      delete Bullet.list[i];
      //제거된 불릿 객체 제거 목록에 등록
      removePack.bullet.push(bullet.id);
    }
    else {
      /* 개별 불릿 상태 업데이트 후,
         클라이언트로 전달할 필요 변수들만 임시 변수에 설정 */
      pack.push(bullet.getUpdatePack());
    }
  }
  return pack;
}

//클라이언트로 전달할 모든 불릿 객체 초기값 설정
Bullet.getAllInitPack = function(){
	var bullets = [];
	for(var i in Bullet.list)
		bullets.push(Bullet.list[i].getInitPack());
	return bullets;
}
/* /Bullet */

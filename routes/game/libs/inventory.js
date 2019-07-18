const UTILITY = require('./utility.js');

/* 인벤토리 클래스 정의 */
Inventory = function(param){

    /* 아이템 목록과 소켓을 속성으로 갖는 인벤토리 객체 */
    var self = {
      items: [], //{id:"itemId",amount:1}
      parent: param.parent,
    }

    /* 인벤토리에 아이템 추가 작업 */
    self.addItem = function(data){
      let item = UTILITY.clone(Item.list[data.id]);
      let findEmptySlot = function(items) {
        let result;
        for(var index=0; index<items.length; index++){
          if(items[index]===undefined) {
            result = index;
            return result;
          }
        }
        return result;
      }
      if(self.items.length===0) {
        item.amount += parseInt(data.amount);
        self.items.push(item);
      }
      else {
        /* 추가하려는 아이템이 이미 목록에 있는 경우 갯수만 갱신 */
        for(var i=0; i<self.items.length; i++){
          if(!self.items[i]) continue;
          if(self.items[i].id === data.id){
            self.items[i].amount += parseInt(data.amount);
            //self.refreshRender();
            return;
          }
        }
        /* 신규 아이템일 경우 ID, 갯수 값 설정 후 갱신 */
        if(!isNaN(findEmptySlot(self.items))) {
          item.amount += parseInt(data.amount);
          self.items[findEmptySlot(self.items)] = item;
          return;
        }
        else {
          item.amount += parseInt(data.amount);
          self.items.push(item);
          return;
        }
      }
    	//self.refreshRender();
    }
    /* 인벤토리 아이템 제거 작업 */
    self.removeItem = function(id,amount){

      /* 목록에서 해당 ID값을 가지는 아이템을 찾아 갯수 조절 후 갱신 */
  		for(var i in self.items){
  			if(self.items[i].id === id){
  				self.items[i].amount -= amount;

          /* 조절하려는 갯수가 더이상 남아있지 않은 경우 */
  				if(self.items[i].amount <= 0) {
            self.items.splice(i,1);
          }
  				//self.refreshRender();
  				return;
  			}
  		}
    }

    /* 인벤토리 아이템 검색 작업 */
    self.hasItem = function(id,amount){

      /* 목록에서 해당 ID값의 아이템이 존재할 경우*/
  		for(var i = 0 ; i < self.items.length; i++){
  			if(self.items[i].id === id){
  				return self.items[i].amount >= amount;
  			}
  		}
      /* 목록에서 해당 ID값의 아이템이 존재하지 않는 경우*/
		  return false;
    }

  /*
	self.refreshRender = function(){
		//server
		if(self.socket){
			self.socket.emit('updateInventory',self.items);
			return;
		}
    */

	return self;
}
/* /인벤토리 클래스 정의 */

/* 아이템 클래스 정의 */
//amout 기본값으로 0 주는 방법 생각해볼것
Item = function(id,name,img,amount,event){
	var self = {
		id: id,
		name: name,
    img: img,
    amount: amount,
    event: event,
	}
	Item.list[self.id] = self;
	return self;
}
Item.list = {};

/* Potions */
Item(
  "healing_potion_medium",
  "MEDIUM HEALING POTION",
  "healing_potion_medium",
  0,
  function(player){
    if(player.hpMax-player.hp>5) {
      player.hp += 5;
    }
    else {
      player.hp = 10;
    }
});
Item(
  "mana_potion_medium",
  "MEDIUM MANA POTION",
  "mana_potion_medium",
  0,
  function(player){
    if(player.mpMax-player.mp>5) {
      player.mp += 5;
    }
    else {
      player.mp = 10;
    }
});
Item(
  "energy_potion_medium",
  "MEDIUM ENERGY POTION",
  "energy_potion_medium",
  0,
  function(player){
    if(player.energyMax-player.energy>50) {
      player.energy += 50;
    }
    else {
      player.energy = 100;
    }
});
Item(
  "healing_potion_small",
  "SMALL HEALING POTION",
  "healing_potion_small",
  0,
  function(player){
    if(player.hpMax-player.hp>3) {
      player.hp += 3;
    }
    else {
      player.hp = 10;
    }
});
Item(
  "mana_potion_small",
  "SMALL MANA POTION",
  "mana_potion_small",
  0,
  function(player){
    if(player.mpMax-player.mp>3) {
      player.mp += 3;
    }
    else {
      player.mp = 10;
    }
});
Item(
  "energy_potion_small",
  "SMALL ENERGY POTION",
  "energy_potion_small",
  0,
  function(player){
    if(player.energyMax-player.energy>30) {
      player.energy += 30;
    }
    else {
      player.energy = 100;
    }
});
/* /Potions */

/* Closet */
Item(
  "legs_leather_white_cloth",
  "YELLOW LEATHER PANTS",
  "legs_leather_white_cloth",
  0,
  function(player){
    player.closet.closet.parts.tiles.pants.img = 'human_action_legs_merchant_cloth_white';
});
Item(
  "chest_leather_vest_yellow_cloth",
  "YELLOW LEATHER VEST",
  "chest_leather_vest_yellow_cloth",
  0,
  function(player){
    player.closet.closet.parts.tiles.chest.img = 'human_action_chest_citizen_leathervest_cloth';
});
Item(
  "head_farmer_hat_straw_cloth",
  "FARMER HAT",
  "head_farmer_hat_straw_cloth",
  0,
  function(player){
    player.closet.closet.parts.tiles.head.img = 'human_action_head_farmer_hat_straw_cloth';
});
/* /Closet */
/* /아이템 클래스 정의 */

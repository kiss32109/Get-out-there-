Closet = function(parent){

    var self = {
      parent: parent,
      closet: {},
    }

    /* 필드에 디폴트맵 추가 작업 */
    self.setDefaultMale = function(){
      /* 이미 목록에 있는 경우 */
		  for(var i in self.closet){
      	if(self.closet[i].id === Parts.list['default_male']){
      		self.closet = [];
      	}
    	} 
      self.closet = UTILITY.clone(Parts.list['default_male']);
    }

	return self;
}

Parts = function(id, name, parts){
	var self = {
		id: id,
		name: name,
    parts: parts,
    effects: {
      interaction: {
        columns: 4,
        width: 48,
        height: 48,
        img: 'interaction_indicators_effect',
      }
    }
	}
	Parts.list[self.id] = self;
	return self;
}
Parts.list = {};
/* /맵 클래스 정의 */
Parts(
  "default_male",
  "Default Male Body",
  parts = {
    columns: 2,
    width: 16,
    height: 32,

		tiles: {
			columns: 16,
			height: 16,
			width: 16,

			body: {
	      img: 'human_run_body_human_male_asian',
	    },

			head: {
	      img: 'human_run_head_female_1_blond',
	    },

			chest: {
	      img: '',
	    },

			pants: {
	      img: '',
	    },

			shoes: {
	      img: '',
	    },
		},
  },
);

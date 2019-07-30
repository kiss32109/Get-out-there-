/* Initial Setting */

var WIDTH = $(window).width();
var HEIGHT = $(window).height();

var SOCKET = io();

var SELF_ID = null;
var LAST_SCORE = null;

var SUPPLY_COUNT = 0;

//게임 컨텐츠를 포함하는 컨텍스트
var cnvs, ctx;

/* 게임 내 사용할 이미지 및 경로 등록 */
var Img = {};

$(document).ready(function() {

	settingCanvas();
	InitializeKeyboard();
	InitializeMouse();
	InitializeInteraction();

	/* 게임 설정 정보 관련 소켓 통신 이벤트 설정 */
	SOCKET.on('init',function(data){
	  if(data.SELF_ID)
	    SELF_ID = data.SELF_ID;
	  for(var i = 0 ; i < data.player.length; i++){
	    new Player(data.player[i]);
	  }
	  for(var i = 0 ; i < data.bullet.length; i++){
	    new Bullet(data.bullet[i]);
	  }

		settingUserInterface(Player.list[SELF_ID]);
		//Player.list[SELF_ID].closetRenderer.playerClicking(Player.list[SELF_ID]);
});

	Img.bullet = new Image();
	Img.bullet.src = '../../images/game/bullets/purple.png';

});

var updatingInteractInterface = function(target) {

	var dialog_container = $('div[id~=dialog-window-container]');
	var dialog_source_name = $('div[id~=dialog-source-name]');
	var dialog_quick_bar = $('div[id~=dialog-window]').find('ul[id~=quick-bar]');
	var dialog_window_close_button = $('span[id~=dialog-window-close-button]');

	if(!target || !Player.list[SELF_ID].interaction.activating) {
		dialog_container.css('display', 'none');
		return;
	}

	var slot_numbering = 0;
	dialog_quick_bar.empty();
	for(var item in target.droppable) {
		var $slot = $(
			'<li class="quick-bar-slot" id="quick-bar-slot-'+ slot_numbering +'"'
			+'style="background: url(../../images/game/items/'+ target.droppable[item].img +'.png) no-repeat, rgb(190, 190, 190) none repeat scroll 0% 0%;">'
			+'<input type="hidden" value="'+ target.droppable[item].id +'">'
			+'<span class="item-amount text-border">'+ target.droppable[item].amount +'</span>'
			+'</li>'
		);
		dialog_quick_bar.append($slot);
		slot_numbering++;
	}
	dialog_source_name.html(target.name);
	dialog_container.css('display', '');

	dialog_window_close_button.one('mousedown', function() {
		dialog_container.css('display', 'none');
	});

	dialog_quick_bar.children().one('mousedown', function(event) {
		event.stopPropagation();

		if(dialog_quick_bar.children().length===1) {
			$(this).parents('div[id*=container]').css('display', 'none');
		}
		$(this).remove();
		/* 오브젝트에서 드랍한 아이템을 가져갈 경우 서버로 알림 */
		var selected_item = target.droppable[$(this).children('input').val()];
		SOCKET.emit('addItem', {id: SELF_ID, item: selected_item});
		SOCKET.emit('updateObjects', {id: target.id, item: selected_item.id});
	});
}

var updatingUserInterface = function(player) {
	/* 플레이어 상태창 업데이트 */
	var user_hp = $('div[id~=player-life-panel]');
	user_hp.html(player.hp);
	user_hp.html(player.hp + '/' + player.hpMax);
	user_hp.css('width', player.hp/player.hpMax*100-3 + '%');

	var user_energy = $('div[id~=player-energy-panel]');
	user_energy.html(player.energy);
	user_energy.html(player.energy + '/' + player.energyMax);
	user_energy.css('width', player.energy/player.energyMax*100-3 + '%');
}

var updatingUserQuickBar = function(inventory) {
	/* 플레이어 인벤토리 업데이트 */
	if(inventory.items.length===0) {
		return;
	}
	else {
		var player_quick_bar = $('div[id~=quick-bar-container]').find('ul[id*=quick-bar]');
		for(var index=0; index<inventory.items.length; index++) {
			if(inventory.items[index]) {
				var $slot = $(
					'<li class="quick-bar-slot" id="quick-bar-slot-'+ index+'"'
					+'style="background: url(../../images/game/items/'+ inventory.items[index].img +'.png) no-repeat scroll 0% 0%, rgb(190, 190, 190) none repeat scroll 0% 0%;">'
					+'<input type="hidden" value="'+ inventory.items[index].id +'">'
					+'<span class="item-amount text-border">'+ inventory.items[index].amount +'</span>'
					+'</li>'
				);
				player_quick_bar.find('[id~=quick-bar-slot-'+index+']').replaceWith($slot);
			}
			else {
				var $slot = $(
					'<li class="quick-bar-slot" id="quick-bar-slot-'+ index+'">'
					+'</li>'
				);
				player_quick_bar.find('[id~=quick-bar-slot-'+index+']').replaceWith($slot);
			}
		}

		player_quick_bar.children().off().on('mousedown', function(event) {
			event.stopPropagation();
			if(player_quick_bar.children('[class~=selected]').length>0) {
				/* 이미 선택되어있던 슬롯을 클릭한 경우 */
				if($(this).hasClass('selected')) {
					$(this).css({
						border: '',
					});
					$(this).removeClass('selected');
					return;
				}

				SOCKET.emit('changeItemOrder', {
					toMoveIndex: player_quick_bar.children('[class~=selected]').attr('id').substring(15),
					toBeMovedIndex:	$(this).attr('id').substring(15),
				});
				/* 이미 선택되어있던 슬롯과는 다른 슬롯을 클릭한 경우 */
				player_quick_bar.children('[class~=selected]').css({
					border: '',
				});
				player_quick_bar.children('[class~=selected]').removeClass('selected');
			}
			$(this).css({
				border: '2px solid rgb(244, 87, 50)',
			});
			$(this).addClass('selected');
		});
	}
}

var updatingTargetInterface = function(player) {

	var target_container = $('div[id~=target-container]');
	target_container.css("display","");
	var target_name = $('div[id~=target-name]');
	var target_hp = $('div[id~=target-life-panel]');
	target_name.html(player.username);
	target_hp.html(player.hp + '/' + player.hpMax);
	target_hp.css('width', player.hp/player.hpMax*100-3 + '%');

	//var id = window.setTimeout(function() { target_container.css("display", "none") }, 5000);
}

var scoreHideButton = function(event) {
	var score_user_content = $('div[id~=score-user-content]');
	var score_hide_button = $('div[id~=score-hide-button]');

	if(score_hide_button.children('span').html() === 'HIDE') {
		score_user_content.empty();
		score_hide_button.children('span').html('SHOW')
	}
	else score_hide_button.children('span').html('HIDE')
}

var updatingWholeUserScore = function(players) {
	var score_whole_content = $('div[id~=score-whole-content]');
	var score_user_content = $('div[id~=score-user-content]');
	var score_hide_button = $('div[id~=score-hide-button]');

	score_user_content.css('margin-top', '0');
	score_user_content.empty();

	if(score_hide_button.children('span').html() === 'SHOW') {
		return;
	}

	var sortUserScore = function(players) {
		var beforeSorting = [];
		for(var i in players) {
			beforeSorting.push(players[i]);
		}
		beforeSorting.sort(function(a,b) {
			return a.score < b.score ? -1 : a.score > b.score ? 1 : 0;
		});
		return beforeSorting.reverse();
	}

	var afterSorting = sortUserScore(players);
	var rankIndex = 1;
	for(var i in afterSorting) {
		var $slot = $(
				'<div id="score-user-content" class="row">'
					+'<div id="score-ranking" class="col-2">'
						+'<span class="text-border">'+rankIndex+'</span>'
					+'</div>'
					+'<div id="score-user-name" class="col-4">'
						+'<span>'+afterSorting[i].username+'</span>'
					+'</div>'
					+'<div id="score-user-value" class="col-3">'
						+'<span>'+afterSorting[i].score+'</span>'
					+'</div>'
				+'</div>'
		);
		score_whole_content.append($slot);
		rankIndex++;
	}
}

var settingUserInterface = function(player) {
	var user_name = $('div[id~=player-name-panel]');
	var user_hp = $('div[id~=player-life-panel]');
	user_name.html(player.username);
	user_hp.html(player.hp + '/' + player.hpMax);
	user_hp.css('width', player.hp/player.hpMax*100-3 + '%');
}

var settingCanvas = function() {
	// canvas
	 cnvs = $('#ctx');
	 // context
	 ctx =cnvs[0].getContext("2d");

	 //클라이언트 화면 크기에 맞춰 캔버스 크기 조절
	 cnvs.attr('width', WIDTH);
	 cnvs.attr('height', HEIGHT);
}

var clearCanvas = function()
{
    // 픽셀 정리
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // 컨텍스트 리셋
    ctx.beginPath();
};
/* /Initial Setting */

//페이지가 로드된 후 실행될 메서드
$(function() {

	SOCKET.on('InteractWith', function(data) {
		updatingInteractInterface(data.target);
	});

	SOCKET.on('ObjectChanged', function(data) {
		updatingInteractInterface(data);
	});

	SOCKET.on('updatingUserQuickBar', function(inventory) {
		updatingUserQuickBar(inventory);
	});

	SOCKET.on('updatingUserCloset', function(data) {
		updatingUserQuickBar(data.inventory);
		Player.list[SELF_ID].closetRenderer.updateCloset(data.closet);
	});

	SOCKET.on('invisibleStart', function() {
		setTimeout(function(){
			SOCKET.emit('invisibleEND')
		}, 2000);
	});

	SOCKET.on('mapChanged', function(data){
		for(var i in Player.list) {
	    var p = Player.list[i];
			if(p.field){
				if(data !== undefined) {
	        p.field.map.field.deco = data;
					p.fieldRenderer.updateField(p.field);
	      };
			}
		}
	});

	SOCKET.on('update',function(data){
	  for(var i = 0 ; i < data.player.length; i++){
	    var pack = data.player[i];
	    var p = Player.list[pack.id];
	    if(p){
				if(pack.location !== undefined){
						if(pack.location.x !== undefined){
	  	        p.location.x = pack.location.x;
	  	      }
	  	      if(pack.location.y !== undefined){
	  	        p.location.y = pack.location.y;
	  	      }
						if(pack.location.status !== undefined){
	  	        p.location.status = pack.location.status;
	  	      }
	  				if(pack.location.direction !== undefined){
	  	        p.location.direction = pack.location.direction;
	  	      }
	      }

	      if(pack.hp !== undefined){
	        p.hp = pack.hp;
	      }
				if(pack.energy !== undefined){
					p.energy = pack.energy;
				}

	      if(pack.score !== undefined){
	        p.score = pack.score;
	      }
	      if(pack.spriteAnimCounter !== undefined) {
	        p.spriteAnimCounter = pack.spriteAnimCounter;
	      }
				if(pack.directionMod !== undefined) {
					p.directionMod = pack.directionMod;
				}
	      if(pack.field !== undefined) {
	        p.field = pack.field;
	      }
				if(pack.closet !== undefined) {
	        p.closet = pack.closet;
	      }
				if(pack.weapon !== undefined) {
	        p.weapon = pack.weapon;
	      }
				if(pack.inventory !== undefined) {
					p.inventory = pack.inventory;
				}
				if(pack.interaction.activating) {
					p.interaction = pack.interaction;
				}
	    }
	  }
	  for(var i = 0 ; i < data.bullet.length; i++){
	    var pack = data.bullet[i];
	    var b = Bullet.list[data.bullet[i].id];
	    if(b){
				if(pack.location.x !== undefined){
					b.location.x = pack.location.x;
				}
				if(pack.location.y !== undefined){
					b.location.y = pack.location.y;
				}
				if(pack.angle !== undefined){
					b.angle = pack.angle;
				}
				if(pack.field !== undefined) {
		      b.field = pack.field;
		    }
				if(pack.toRemove !== undefined) {
		      b.toEffect = pack.toRemove;
		    }
	    }
	  }
	});

	SOCKET.on('remove',function(data){
	  //{player:[12323],bullet:[12323,123123]}
	  for(var i = 0 ; i < data.player.length; i++){
	    delete Player.list[data.player[i]];
	  }
	  for(var i = 0 ; i < data.bullet.length; i++){
			/* 제거 이펙트 표현 후 목록에서 제거 */
			Bullet.list[data.bullet[i]].draw();
	    delete Bullet.list[data.bullet[i]];
	  }
	});



	setInterval(function(){

		SUPPLY_COUNT++;
		if(SUPPLY_COUNT>1000) {
			SUPPLY_COUNT = 0;
			const info_window_container = $('div[id~=info-window-container]');
			info_window_container.css('display','');
			setTimeout(function() {
				info_window_container.css('display', 'none')
			},6000);
			SOCKET.emit('supplyRespon');
		}

	  if(!SELF_ID)
	    return;
		clearCanvas();
		updatingUserInterface(Player.list[SELF_ID]);
		updatingWholeUserScore(Player.list);

		Player.list[SELF_ID].fieldRenderer.render();
	  for(var i in Player.list) {
			if(Player.list[i].location.status==='INVISIBLE') {
				continue;
			}
			Player.list[i].draw();
		}
	  for(var i in Bullet.list)
	    Bullet.list[i].draw();
		//drawUserNames();
	}, 60);
});

/* /Game */

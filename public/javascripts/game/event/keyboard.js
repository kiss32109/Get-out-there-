/* Keyboard Event */

Keyboard = function() {

  // PRESS_ID 생각해 볼것
    this.LEFT = false;
    this.RIGHT = false;
    this.UP = false;
    this.DOWN = false;
};

// ASCII codes
const KEY_LEFT = 37;
const KEY_RIGHT = 39;
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_W = 87;
const KEY_S = 83;
const KEY_A = 65;
const KEY_D = 68;

const DIR_E = 1;
const DIR_NE = 2;
const DIR_N = 4;
const DIR_NW = 8;
const DIR_W = 16;
const DIR_SW = 32;
const DIR_S = 64;
const DIR_SE = 128;

const KEY_1 = 49;
const KEY_2 = 50;
const KEY_3 = 51;
const KEY_4 = 52;
const KEY_5 = 53;
const KEY_6 = 54;
const KEY_7 = 55;
const KEY_8 = 56;
const KEY_9 = 57;
const KEY_0 = 48;


var isShift = false;

window.key = null;

function InitializeKeyboard() {

    window.key = new Keyboard();

    var areUsingCloth = function(value) {
      if(value.includes('cloth')) { return true; }
      else { return false; }
    };

    var areSpecialPotion = function(value) {
      switch (value) {
        case 'invisible_potion_small':
          if(Player.list[SELF_ID].location.status==='INVISIBLE') return true;
          return false;
      }
      return false;
    }

    var quickUseProcess = function(value) {
      if(value===undefined) { return; }
      else if(areUsingCloth(value)) { SOCKET.emit('wearingCloth', value); }
      else if(areSpecialPotion(value)) { console.log('already'); return; }
      else { SOCKET.emit('quickUseItem', value); }
    }

    $(document).keydown(function(e) {
        var p = Player.list[SELF_ID]
        if (e.keyCode === 16) isShift = true;
        if (e.keyCode === KEY_LEFT || e.keyCode === KEY_A) { key.LEFT = true;}
        if (e.keyCode === KEY_RIGHT || e.keyCode === KEY_D) { key.RIGHT = true;}
        if (e.keyCode === KEY_UP|| e.keyCode === KEY_W) { key.UP = true; }
        if (e.keyCode === KEY_DOWN|| e.keyCode === KEY_S) { key.DOWN = true; }

        if (e.keyCode === KEY_1) quickUseProcess($('div[id~=quick-bar-container]').find('li[id~=quick-bar-slot-0]').children('input').val());
        if (e.keyCode === KEY_2) quickUseProcess($('div[id~=quick-bar-container]').find('li[id~=quick-bar-slot-1]').children('input').val());
        if (e.keyCode === KEY_3) quickUseProcess($('div[id~=quick-bar-container]').find('li[id~=quick-bar-slot-2]').children('input').val());
        if (e.keyCode === KEY_4) quickUseProcess($('div[id~=quick-bar-container]').find('li[id~=quick-bar-slot-3]').children('input').val());
        if (e.keyCode === KEY_5) quickUseProcess($('div[id~=quick-bar-container]').find('li[id~=quick-bar-slot-4]').children('input').val());
        if (e.keyCode === KEY_6) quickUseProcess($('div[id~=quick-bar-container]').find('li[id~=quick-bar-slot-5]').children('input').val());
        if (e.keyCode === KEY_7) quickUseProcess($('div[id~=quick-bar-container]').find('li[id~=quick-bar-slot-6]').children('input').val());
        if (e.keyCode === KEY_8) quickUseProcess($('div[id~=quick-bar-container]').find('li[id~=quick-bar-slot-7]').children('input').val());
        if (e.keyCode === KEY_9) quickUseProcess($('div[id~=quick-bar-container]').find('li[id~=quick-bar-slot-8]').children('input').val());
        if (e.keyCode === KEY_0) quickUseProcess($('div[id~=quick-bar-container]').find('li[id~=quick-bar-slot-9]').children('input').val());

        SOCKET.emit('movement', key);
    });

    $(document).keyup(function(e) {
        if (e.keyCode === 16) isShift = false;
        if (e.keyCode === KEY_LEFT || e.keyCode === KEY_A) { key.LEFT = false;}
        if (e.keyCode === KEY_RIGHT || e.keyCode === KEY_D) { key.RIGHT = false;}
        if (e.keyCode === KEY_UP|| e.keyCode === KEY_W) { key.UP = false; }
        if (e.keyCode === KEY_DOWN|| e.keyCode === KEY_S) { key.DOWN = false; }

        SOCKET.emit('movement', key);
    });
}

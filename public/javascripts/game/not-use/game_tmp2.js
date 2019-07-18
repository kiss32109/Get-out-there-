
//캐릭터 방향각
var dog_angle = 0;

//캔버스 컨텍스트 객체
var Context = null;

//?
var BLOCK_W = 32;
var BLOCK_H = 32;
//?
var dog_x = 64;
var dog_y = 32;
//??
var dog_rotate = 0;


var dog = new Sprite("../../images/game/characters/dog-sprite-sheet.png");
var dog2 = new Sprite("../../images/game/characters/dog-sprite-sheet.png");

var spritesheet = new Spritesheet("../../images/game/characters/dog-sprite-sheet.png");
var dog3 = new Sprite(spritesheet);
var dog4 = new Sprite(spritesheet);
var dog5 = new Sprite(spritesheet);

var dog_is_moving = false;
var dog_direction = 0;


$(document).ready(function() {

    Context = new HTML("game", 640, 480);

    InitializeKeyboard();

    DisableScrollbars();

    InitializeAnimationCounters();
});

$(window).on('load', function() {

});

setInterval(function() {
    ResetAnimationCounter();

    dog_is_moving = false;

    dog_direction = 0;

    if (key.left) {
      dog_x -= 1;
      dog_direction |= DIR_W;
      dog_is_moving = true;
    }
    if (key.right) {
      dog_x += 1;
      dog_direction |= DIR_E;
      dog_is_moving = true;
    }
    if (key.up) {
      dog_y -= 1;
      dog_direction |= DIR_N;
      dog_is_moving = true;
    }
    if (key.down) {
      dog_y += 1;
      dog_direction |= DIR_S;
      dog_is_moving = true;
    }

    if (key.w) { /* ... */ }
    if (key.s) { /* ... */ }
    if (key.a) { /* ... */ }
    if (key.d) { /* ... */ }

    // Animated characters
    var dog_seq = 0;

    if (dog_is_moving)
    {
        if (dog_direction & DIR_W) dog_seq = [33,34,35,36];
        if (dog_direction & DIR_E) dog_seq = [1,2,3,4];
        if (dog_direction & DIR_N) dog_seq = [49,50,51,52];
        if (dog_direction & DIR_S) dog_seq = [17,18,19,20];
        if (dog_direction & DIR_N && dog_direction & DIR_E) dog_seq = [57,58,59,60];
        if (dog_direction & DIR_N && dog_direction & DIR_W) dog_seq = [41,42,43,44];
        if (dog_direction & DIR_S && dog_direction & DIR_E) dog_seq = [9,10,11,12];
        if (dog_direction & DIR_S && dog_direction & DIR_W) dog_seq = [25,26,27,28];

        // Finally, animate the dog.
        dog3.draw(dog_x, dog_y, dog_seq);
    }
    else
    {
        dog3.draw(dog_x, dog_y, 0);
    }

    /*
    dog.draw(128, 128, [17,18,19,20]);
    dog.draw(96, 96, 0);
    dog.rotAnim(32, 32, [1,2,3,4], dog_rotate++);
    dog3.rot(100, 100, dog_rotate);
    dog3.rot(120, 100, -dog_rotate);
    */



}, 12);

var HTML =  function(canvasId, width, height) {
    this.width = width;
    this.height = height;
    this.canvas = null;
    this.context = null;
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');
    $(this.canvas).attr( { width: this.width, height: this.height } );
    $(this.canvas).attr( { style: 'width:'  + this.width + 'px;' + 'height:' + this.height + 'px' } );
};

var Animate = function(animationDelay, animationIndexCounter, animationCurrentFrame)
{
    this.animationDelay = animationDelay;
    this.animationIndexCounter = animationIndexCounter;
    this.animationCurrentFrame = animationCurrentFrame;
};

var AnimationCounterIndex = 0;
var AnimationCounter = new Array();

function InitializeAnimationCounters()
{
    for (var i = 0; i < 32000; i++)
        AnimationCounter[i] = new Animate(0, 0, 0);
}

function ResetAnimationCounter()
{
    AnimationCounterIndex = 0;
}

var Spritesheet = function(filename)
{
    this.image = new Image();
    this.image.src = filename;
};

function i2xy(index, mapWidth)
{
    var x = index % mapWidth;
    var y = Math.floor(index/mapWidth);
    return [x, y];
}

function xy2i(x, y, mapWidth)
{
    return y * mapWidth + x;
}

function DisableScrollbars()
{
    document.documentElement.style.overflow = 'hidden';
    document.body.scroll = "no";
}

function ResetAnimation()
{

}

var Sprite = function(fn) {

    this.TO_RADIANS = Math.PI/180;
    this.image = null;

    this.load = function(filename) {
      this.image = new Image();
      this.image.src = filename;
      return this;
    };

    this.image = null;
    this.spritesheet = null;

    // Load from spritesheet
    if (fn instanceof Spritesheet)
    {
        this.spritesheet = fn;
        this.image = this.spritesheet.image;
    }
    else
    // Load from sprite
    if (fn != undefined && fn != "" && fn != null)
    {
        this.load(fn);
        console.log("Loaded sprite " + fn);
    }
    else
    {
        console.log("Unable to load sprite. Filename '" + fn + "' is undefined or null.");
    }

    //

    this.draw = function(x, y, various)
    {
      Context.context.clearRect(x, y, 32, 32);
        // Draw regular sprite
        if (various == undefined)
        {
            Context.context.drawImage(this.image, x, y, 32, 32);
        } else

        // If various is a single numeric frame id
        if ($.isNumeric(various) && various >= 0) {
            var res = i2xy(various, 8);
            Context.context.drawImage(this.image, res[0]*32, res[1]*32, 32, 32, x, y, 32, 32);
        } else

        // if various is Animation Sequence - an array like [1,2,3,4] or [17,18,19,20];
        if (various.length != undefined && various.length > 0)
        {
            if (AnimationCounter[AnimationCounterIndex].animationDelay++ >= 3) {
                AnimationCounter[AnimationCounterIndex].animationDelay = 0;
                AnimationCounter[AnimationCounterIndex].animationIndexCounter++;
                if (AnimationCounter[AnimationCounterIndex].animationIndexCounter >= various.length)
                    AnimationCounter[AnimationCounterIndex].animationIndexCounter = 0;
                AnimationCounter[AnimationCounterIndex].animationCurrentFrame = various[AnimationCounter[AnimationCounterIndex].animationIndexCounter];
            }
            var res = i2xy(AnimationCounter[AnimationCounterIndex].animationCurrentFrame, 8);
            Context.context.drawImage(this.image, res[0]*32, res[1]*32, 32, 32, x, y, 32, 32);

            AnimationCounterIndex++;
        }
    };


    this.rotAnim = function(x, y, sequence, angle)
    {
        if (AnimationCounter[AnimationCounterIndex].animationDelay++ >= 3) {
            AnimationCounter[AnimationCounterIndex].animationDelay = 0;
            AnimationCounter[AnimationCounterIndex].animationIndexCounter++;
            if (AnimationCounter[AnimationCounterIndex].animationIndexCounter >= sequence.length)
                AnimationCounter[AnimationCounterIndex].animationIndexCounter = 0;
            AnimationCounter[AnimationCounterIndex].animationCurrentFrame = sequence[AnimationCounter[AnimationCounterIndex].animationIndexCounter];
        }
        var res = i2xy(AnimationCounter[AnimationCounterIndex].animationCurrentFrame, 8);

        Context.context.save();
        Context.context.translate(x+16, y+16);    // Translate sprite to its center
        Context.context.rotate(angle * this.TO_RADIANS);    // Rotate sprite around its center
        Context.context.drawImage(this.image, res[0]*32, res[1]*32, 32, 32,
            -16, -16,                         // Translate sprite back to its original position
            32, 32);
        Context.context.restore();

        AnimationCounterIndex++;
    };

    // Rotated draw
    this.rot = function(x, y, angle) {
        Context.context.save();
        Context.context.translate(x, y);
        Context.context.rotate(angle * this.TO_RADIANS);
        Context.context.drawImage(this.image, -(this.image.width/2), -(this.image.height/2));
        Context.context.restore();
    };
};

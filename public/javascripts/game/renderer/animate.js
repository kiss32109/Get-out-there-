Animate = function(animationDelay, animationIndexCounter, animationCurrentFrame)
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
};

function indexToXY(index, columns)
{
		var x = index % columns;
	  var y = Math.floor(index/columns);
    return [x*16, y*48+4];
};

function indexToX0(index, columns)
{
		var x = index % columns;
    return [x*48, 0];
};
function indexToX2(index, columns)
{
		var x = index % columns;
    return [x*48, 2*48];
};

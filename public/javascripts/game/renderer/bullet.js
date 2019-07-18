/* Bullet Renderer */
BulletRenderer = function(param) {

	const BULLET_PATTERN = [3,4,5];
	const EFFECT_PATTERN = [5,6,7,8,9];

  var display, bullet, location, pattern;

  tiles = {
		bullet: {
			columns: 0,
	    height: 0,
	    width: 0,
      img: '',
    },
    effect: {
			columns: 0,
	    height: 0,
	    width: 0,
      img: '',
    },
  };

	if(param) {
		if(param.location) location = param.location;
		if(param.drawing) bullet = param.drawing.selected;
	};

	if(bullet.tiles.bullet.img !== '') { bullet.tiles.bullet.img = new Spritesheet(param.drawing.selected.tiles.bullet.img) };
	if(bullet.tiles.effect.img !== '') { bullet.tiles.effect.img = new Spritesheet(param.drawing.selected.tiles.effect.img) };

  display = {
    WIDTH: document.documentElement.clientWidth,
    HEIGHT: document.documentElement.clientHeight,

		animationCounterIndex: 0,

		animationCounter: {},

		animate: function(animationDelay, animationIndexCounter, animationCurrentFrame)
		{
		   	display.animationCounter.animationDelay = animationDelay;
				display.animationCounter.animationIndexCounter = animationIndexCounter;
				display.animationCounter.animationCurrentFrame = animationCurrentFrame;
		},

		initializeAnimationCounters: function()
		{
		   display.animate(0, 0, 0);
		},
		resetAnimationCounter: function()
		{
		    this.animationCounterIndex = 0;
		},

    buffer: document.createElement("canvas").getContext("2d"),
    context: document.querySelector("canvas").getContext("2d"),

		bufferClearing: function() {
			this.buffer.clearRect(0,0,bullet.tiles.width,bullet.tiles.height);
		},

		bufferingBullet: function(bullet, indexX, indexY, angle) {
			this.buffer.canvas.width  = bullet.width;
			this.buffer.canvas.height =	bullet.height;
      //버퍼 캔버스 상태 저장
      this.buffer.save();
      //이미지의 생성점과 회전 기준점을 설정
      this.buffer.translate(24, 24);
      //기준점을 기준으로 회전
      this.buffer.rotate((angle+90)*Math.PI/180);
      //원점으로 생성점과 기준점을 바꾼다.
      this.buffer.translate(-24, -24);
			this.buffer.drawImage(
				bullet.img,
				indexX,
				indexY,
				bullet.width,
				bullet.height,
				0,
				0,
				bullet.width,
				bullet.height,
			);
      //버퍼 캔버스 상태 복구
      this.buffer.restore();
		},
		bufferingEffect: function(effect, indexX, indexY) {
			this.buffer.canvas.width  = effect.width;
			this.buffer.canvas.height =	effect.height;
			//버퍼 캔버스 상태 저장
      this.buffer.save();
			this.buffer.drawImage(
				effect.img,
				indexX,
				indexY,
				effect.width,
				effect.height,
				0,
				0,
				effect.width,
				effect.height,
			);
      //버퍼 캔버스 상태 복구
      this.buffer.restore();
		},

		wholeBuffering: function(indexX, indexY, angle, toEffect) {
			if(toEffect) {
				if(bullet.tiles.effect.img !== '') { this.bufferingEffect(bullet.tiles.effect, indexX, indexY); };
			}
			else {
				if(bullet.tiles.bullet.img !== '') { this.bufferingBullet(bullet.tiles.bullet, indexX, indexY, angle); };
			}
		},

    render:function(x, y, angle, toEffect)
		{
			var columns;
      if (this.animationCounter.animationIndexCounter===undefined) {
        this.initializeAnimationCounters();
      }
			if(toEffect) { pattern=EFFECT_PATTERN; columns=bullet.tiles.effect.columns;}
			else { pattern = BULLET_PATTERN; columns=bullet.tiles.bullet.columns;};
      //this.bufferClearing();
			var countForEffect=0;
			do{
	      this.animationCounter['animationDelay'] += 1;
	      if (this.animationCounter['animationDelay'] >= 3) {
	          this.animationCounter['animationDelay'] = 0;
	          this.animationCounter['animationIndexCounter']++;
	          if (this.animationCounter['animationIndexCounter'] >= pattern.length)
	              this.animationCounter['animationIndexCounter'] = 0;
	          this.animationCounter['animationCurrentFrame'] = pattern[this.animationCounter['animationIndexCounter']];
	      }
	      var res = indexToX0(this.animationCounter['animationCurrentFrame'], columns);
	      this.wholeBuffering(res[0], res[1], angle, toEffect);

				this.context.drawImage(
					this.buffer.canvas,
					0,
					0,
					this.buffer.canvas.width,
					this.buffer.canvas.height,
					x-(this.buffer.canvas.width*3)/2,
					y-(this.buffer.canvas.height*3)/2,
					this.buffer.canvas.width*3,
					this.buffer.canvas.height*3,
				);

				countForEffect++;
			} while(toEffect&&countForEffect<15)
  	},

		resize:function(event) {

      display.context.canvas.width = document.documentElement.clientWidth;
      display.context.canvas.height = document.documentElement.clientHeight;
      display.buffer.imageSmoothingEnabled = display.context.imageSmoothingEnabled = false;
      display.render();
    },
	}

  return display;
};

/* /Field Renderer */

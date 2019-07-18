/* Character Renderer */
ClosetRenderer = function(param) {

	const WEST_PATTERN = [49,52,55,58];
	const EAST_PATTERN = [33,36,39,42];
	const NORTH_PATTERN = [17,20,23,26];
	const SOUTH_PATTERN = [1,4,7,10];

	const INTERACTION_PATTERN = [4,5,6,7];
  var display, closet, location, pattern;

  closet = {
    columns: 0,
    height: 0,
    width: 0,

		parts: {
			columns: 0,
			height: 0,
			width: 0,

			body: {
	      img: '',
	    },

			head: {
	      img: '',
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
  };

	var bufferingImgs = function(closet) {
		if(closet.parts.tiles.body.img !== '') { closet.parts.tiles.body.img = new Spritesheet(closet.parts.tiles.body.img) }
		if(closet.parts.tiles.head.img !== '') { closet.parts.tiles.head.img = new Spritesheet(closet.parts.tiles.head.img) }
		if(closet.parts.tiles.chest.img !== '') { closet.parts.tiles.chest.img = new Spritesheet(closet.parts.tiles.chest.img) }
		if(closet.parts.tiles.pants.img !== '') { closet.parts.tiles.pants.img = new Spritesheet(closet.parts.tiles.pants.img) }
		if(closet.parts.tiles.shoes.img !== '') { closet.parts.tiles.shoes.img = new Spritesheet(closet.parts.tiles.shoes.img) }
		if(closet.effects.interaction.img !== '') { closet.effects.interaction.img = new Spritesheet(closet.effects.interaction.img) }
  }

	if(param) {
		if(param.location) location = param.location;
		if(param.drawing) {
			closet = param.drawing.closet;
			bufferingImgs(closet);
		}
	}

	display = {
    WIDTH: document.documentElement.clientWidth,
    HEIGHT: document.documentElement.clientHeight,

		updateCloset: function(param) {
			if(param) {
				closet = param.closet;
				bufferingImgs(closet);
			}
		},

		animationCounterIndex: 0,
		animationCounter: {},
		animate: function(animationDelay, animationIndexCounter, animationCurrentFrame)
		{
		   	display.animationCounter.animationDelay = animationDelay;
				display.animationCounter.animationIndexCounter = animationIndexCounter;
				display.animationCounter.animationCurrentFrame = animationCurrentFrame;
		},
		animationCounting: function() {
			this.animationCounter['animationDelay'] += 1;
			if (this.animationCounter['animationDelay'] >= 2) {
					this.animationCounter['animationDelay'] = 0;
					this.animationCounter['animationIndexCounter']++;
					if (this.animationCounter['animationIndexCounter'] >= pattern.length)
							this.animationCounter['animationIndexCounter'] = 0;
					this.animationCounter['animationCurrentFrame'] = pattern[this.animationCounter['animationIndexCounter']];
			}
		},

		initializeAnimationCounters: function() { display.animate(0, 0, 0); },
		resetAnimationCounter: function() { this.animationCounterIndex = 0; },

    buffer: document.createElement("canvas").getContext("2d"),
    context: document.querySelector("canvas").getContext("2d"),
		bufferForInteraction: document.createElement("canvas").getContext("2d"),
    contextForInteraction: document.querySelector("canvas").getContext("2d"),

		isIntersect: function(point, location) {
  		return point.x - location.x>0
			&& point.x-location.x<closet.parts.width*2
			&& point.y - location.y>0
			&& point.y-location.y<closet.parts.height*2;
		},

		//playerInteract

		playerClicking: function(player, x, y) {
			var location = {
				x: x,
				y: y,
			}
    	$(document).on('click', this.context.canvas, function(event) {
				var point = { x:event.pageX, y:event.pageY };
				if(display.isIntersect(point,location)) {
					updatingTargetInterface(player);
				}
			});
		},

		bufferClearing: function() {
			this.buffer.clearRect(0,0,closet.parts.width,closet.parts.height);
		},

		bufferingPart: function(target, size, x, y) {
			this.buffer.drawImage(
				target.img,
				x,
				y,
				size.width,
				size.height,
				0,
				0,
				size.width,
				size.height,
			);
		},

		bufferingWholeParts: function(x, y) {
			var size = {
					width: closet.parts.width,
					height: 	closet.parts.height,
			}
			this.buffer.canvas.width  = size.width;
			this.buffer.canvas.height =	size.height;
			if(closet.parts.tiles.body.img !== '') { this.bufferingPart(closet.parts.tiles.body, size, x, y); };
			if(closet.parts.tiles.head.img !== '') { this.bufferingPart(closet.parts.tiles.head, size, x, y); };
			if(closet.parts.tiles.chest.img !== '') { this.bufferingPart(closet.parts.tiles.chest, size, x, y); };
			if(closet.parts.tiles.pants.img !== '') { this.bufferingPart(closet.parts.tiles.pants, size, x, y); };
			if(closet.parts.tiles.shoes.img !== '') { this.bufferingPart(closet.parts.tiles.shoes, size, x, y); };

		},

		bufferingInteraction: function(indexX, indexY, x, y) {
			var size = {
					width: closet.effects.interaction.width,
					height: 	closet.effects.interaction.height,
			}
			this.bufferForInteraction.canvas.width  = size.width;
			this.bufferForInteraction.canvas.height =	size.height;
			this.bufferForInteraction.drawImage(
				closet.effects.interaction.img,
				indexX,
				indexY,
				size.width,
				size.height,
				0,
				0,
				size.width,
				size.height,
			);
		},

    render:function(x, y)
		{

			//캐릭터 방향 기본값 설정
			if(!pattern) pattern=SOUTH_PATTERN;
			if (location.status==='HOLD') {
				this.initializeAnimationCounters();
				//this.bufferClearing();
				if($.isNumeric(location.direction) && location.direction === 0) pattern = SOUTH_PATTERN;
				if($.isNumeric(location.direction) && location.direction === 1) pattern = NORTH_PATTERN;
				if($.isNumeric(location.direction) && location.direction === 2) pattern = EAST_PATTERN;
				if($.isNumeric(location.direction) && location.direction === 3) pattern = WEST_PATTERN;
				var res = indexToXY(pattern[1], closet.parts.tiles.columns);
				this.bufferingWholeParts(res[0], res[1]);
			}
			else if(location.status === 'MOVE') {
				if($.isNumeric(location.direction) && location.direction === 0) pattern = SOUTH_PATTERN;
				if($.isNumeric(location.direction) && location.direction === 1) pattern = NORTH_PATTERN;
				if($.isNumeric(location.direction) && location.direction === 2) pattern = EAST_PATTERN;
				if($.isNumeric(location.direction) && location.direction === 3) pattern = WEST_PATTERN;
				this.animationCounting();
				var res = indexToXY(this.animationCounter['animationCurrentFrame'], closet.parts.tiles.columns);
				this.bufferingWholeParts(res[0], res[1]);
				//this.resetAnimationCounter();
			}
			else if(location.status === 'INTERACT') {
				pattern = INTERACTION_PATTERN;
				interactionX = x;
				interactionY = y;
				if($.isNumeric(location.direction) && location.direction === 0) interactionY+=48;
				if($.isNumeric(location.direction) && location.direction === 1) interactionY-=48;
				if($.isNumeric(location.direction) && location.direction === 2) interactionX+=48;
				if($.isNumeric(location.direction) && location.direction === 3) interactionX-=48;
				this.animationCounting();
				var res = indexToX2(this.animationCounter['animationCurrentFrame'], closet.effects.interaction.columns);
				this.bufferingInteraction(res[0], res[1], interactionX, interactionY);
				this.contextForInteraction.drawImage(
					this.bufferForInteraction.canvas,
					0,
					0,
					closet.effects.interaction.width,
					closet.effects.interaction.height,
					interactionX-(closet.effects.interaction.width*3)/2,
					interactionY-(closet.effects.interaction.height*3)/2,
					closet.effects.interaction.width*3,
					closet.effects.interaction.height*3,
				);
			}
			//14-18(4) -> 62-66(4) -> 110-114(4) -> 158-162(4)	/48
			//-19-8(27) -> 30-57(27) -> 77-104(27) -> 125-153(27)	/21
			//-2-9(11) -> 46-57(11) -> 94-105(11) -> 142-153(11)  /48
			//58?
			this.context.beginPath();
			this.context.drawImage(
				this.buffer.canvas,
				0,
				0,
				closet.parts.width,
				closet.parts.height,
				x-(closet.parts.width*3)/2,
				y-(closet.parts.height*3)/2,
				closet.parts.width*3,
				closet.parts.height*3,
			);
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

/* Field Renderer */
FieldRenderer = function(param) {
  /* 화면 그래픽을 전담할 디스플레이 객체와
  표시할 맵과 오브젝트를 구현하는 필드 객체 */
  var location, display, field;
  /* 필드 객체 정의 */
  field = {
    /* 필드에 그려질 타일의 총 행 갯수 */
    columns: 0,
    /* 필드의 총 가로, 높이 */
    height: 0,
    width: 0,

    /* 필드를 구성할 기본 베이스 (테두리, 바닥재 등) */
    ground: {
      pattern: [],
      /* The tile_sheet object holds the tile sheet graphic as well as its dimensions. */
      tiles: {
        imgs: [],
        columns: 0,
        height: 0,
        width: 0,
      },
    },

    /* 필드를 구성할 오브젝트 (건물, 나무 등) */
    deco: {
      pattern: [],
      tiles: {
        imgs: [],
        columns: 0,
        height: 0,
        width: 0,
      },
    },
  };

  var bufferingImgs = function(field) {
    if(field.ground.tiles.imgs.length !== 0) {
			for(var index=0; index < field.ground.tiles.imgs.length-1; index++) {
				field.ground.tiles.imgs[index] = new Spritesheet(field.ground.tiles.imgs[index]);
			}
		}
    if(field.deco.tiles.imgs.length !== 0) {
			for(var index=0; index < field.deco.tiles.imgs.length-1; index++) {
				field.deco.tiles.imgs[index] = new Spritesheet(field.deco.tiles.imgs[index]);
			}
		}
  }
  /* 파라미터를 기준으로 하는 필드 객체 생성자 */
  if(param) {
		if(param.location) location = param.location;
		if(param.field) {
      field = param.field;
      bufferingImgs(param.field);
    }
  };

  /* 디스플레이 객체 정의 */
  display = {
    /* 클라이언트 디스플레이 규격 설정 */
    WIDTH: document.documentElement.clientWidth,
    HEIGHT: document.documentElement.clientHeight,
    /* 그려질 필드 객체의 화면 배율 변수 */

    /* 필드 객체가 클라이언트 화면에 표시되기 전에 먼저 구현시킬 가상의 버퍼 객체 */
    buffer:document.createElement("canvas").getContext("2d"),
    /* 가상의 버퍼 캔버스 객체에 구현된 이미지를 클라이언트 화면에 표시할 컨텍스트 객체 */
    context:document.querySelector("canvas").getContext("2d"),

    updateField: function(param) {
      if(param) { field = param.map.field;}
      bufferingImgs(field);
    },

    bufferClearing: function() {
			this.buffer.clearRect(0,0,field.width.width,field.width.height);
		},

		bufferingPart: function(target, columns) {

      var raw, map_selector, tile_selector;
      var source_x, source_y;
      var destination_x, destination_y;

			for (let indexX=target.pattern.length-1; indexX>-1; --indexX) {
        for (let indexY=target.pattern[indexX].length-1; indexY>-1; --indexY) {
          if(target.pattern[indexX][indexY].constructor === String) {
            if(target.pattern[indexX][indexY] === '') { continue; }
            raw = target.pattern[indexX][indexY].split('-');
          }
          else if(target.pattern[indexX][indexY].constructor === Object) {
            raw = target.pattern[indexX][indexY].deco_number.split('-');
          }

          map_selector = raw[0];
          tile_selector = raw[1];

          source_x = (tile_selector % target.tiles.columns) * target.tiles.width;
          source_y = Math.floor(tile_selector / target.tiles.columns) * target.tiles.height;

          destination_x = (indexX % (target.pattern.length)) * target.tiles.width;
          destination_y = (indexY % (target.pattern[indexX].length)) * target.tiles.height;

          this.buffer.drawImage(
            target.tiles.imgs[map_selector],
            source_x,
            source_y,
            target.tiles.width,
            target.tiles.height,
            destination_y,
            destination_x,
            target.tiles.width,
            target.tiles.height
          );
        }
      }
		},

    bufferingWholeField: function(field) {

			this.buffer.canvas.width  = field.width;
			this.buffer.canvas.height =	field.height;
      display.buffer.imageSmoothingEnabled = display.context.imageSmoothingEnabled = false;

			if(field.ground.pattern.length !== 0) { this.bufferingPart(field.ground, field.columns); };
      if(field.deco.pattern.length !== 0) { this.bufferingPart(field.deco, field.columns); };

		},

    render:function() {

      //console.log(field.deco.pattern[19][15]);

      if(field.ground.pattern.length === 0) { return; }
      else {
        this.bufferClearing();
        this.bufferingWholeField(field);

        this.context.drawImage(
					this.buffer.canvas,
					0,
					0,
					field.width/3,
					field.height/3,
					((WIDTH-field.width)/2 - location.x),
					((HEIGHT-field.height)/2 - location.y),
					field.width,
					field.height);
      };

      this.context.strokeStyle = "#0033FF";    // 선에 색상 지정하기
      this.context.beginPath();
      this.context.moveTo(0, HEIGHT/2)
      this.context.lineTo(WIDTH, HEIGHT/2);
      this.context.moveTo(WIDTH/2, 0);
      this.context.lineTo(WIDTH/2, HEIGHT);
      this.context.stroke();
      this.context.closePath();
    },

    resize:function(event) {

      display.context.canvas.width = document.documentElement.clientWidth;
      display.context.canvas.height = document.documentElement.clientHeight;
      display.buffer.imageSmoothingEnabled = display.context.imageSmoothingEnabled = false;
      display.render();
    },

  };

  return display;
};
/* /Field Renderer */

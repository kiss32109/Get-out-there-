var mapRenderer = function(param) {

  /* 화면 그래픽을 전담할 디스플레이 객체와
  표시할 맵과 오브젝트를 구현하는 필드 객체*/
  var display, field;

  /* 필드 객체 정의 */
  field = {
    /* 필드에 그려질 타일의 총 행 갯수 */
    columns: 0,
    /* 필드의 총 가로, 높이 */
    height: 0,
    width: 0,

    /* 필드를 구성할 기본 베이스 (테두리, 바닥재 등) */
    building: {
      map: [],
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
      map: [],
      tiles: {
        imgs: [],
        columns: 0,
        height: 0,
        width: 0,
      },
    },
  };

  /* 파라미터를 기준으로 하는 필드 객체 생성자 */
  if(param) {
    if(param.width) field.width = param.width;
    if(param.height) field.height = param.height;
    if(param.columns) field.columns = param.columns;
    if(param.building){
      if(param.building.map) field.building.map = param.building.map;
      if(param.building.tiles) {
        field.building.tiles.columns = param.building.tiles.columns;
        field.building.tiles.height = param.building.tiles.height;
        field.building.tiles.width = param.building.tiles.width;

        /* 다중 스프라이트 시트 적용을 위한 개별 이미지 객체 생성 */
        for(var index=0; index<param.building.tiles.imgs.length-1; index++) {
          var tmp_img = new Image();
          tmp_img.src = '../../images/game/maps/' + param.building.tiles.imgs[index];
          field.building.tiles.imgs[index] = tmp_img;
        }
      }
    }
    if(param.deco){
      if(param.deco.map) field.deco.map = param.deco.map;
      if(param.deco.tiles) {
        field.deco.tiles.columns = param.deco.tiles.columns;
        field.deco.tiles.height = param.deco.tiles.height;
        field.deco.tiles.width = param.deco.tiles.width;

        /* 다중 스프라이트 시트 적용을 위한 개별 이미지 객체 생성 */
        for(var index=0; index<param.deco.tiles.imgs.length-1; index++) {
          var tmp_img = new Image();
          tmp_img.src = '../../images/game/maps/' + param.deco.tiles.imgs[index];
          field.deco.tiles.imgs[index] = tmp_img;
        }
      }
    }
  }

  /* 디스플레이 객체 정의 */
  display = {

    /* 클라이언트 디스플레이 규격 설정 */
    WIDTH: document.documentElement.clientWidth,
    HEIGHT: document.documentElement.clientHeight,
    /* 그려질 필드 객체의 화면 배율 변수 */
    MULTIPLIER: 2,

    /* 필드 객체가 클라이언트 화면에 표시되기 전에 먼저 구현시킬 가상의 버퍼 객체 */
    buffer:document.createElement("canvas").getContext("2d"),
    /* 가상의 버퍼 캔버스 객체에 구현된 이미지를 클라이언트 화면에 표시할 컨텍스트 객체 */
    context:document.querySelector("canvas").getContext("2d"),

    /* 이미지 가로, 세로 비율 조정 변수 */
    height_width_ratio:undefined,

    /* 필드 객체가 화면 중앙에 올 수있도록
    X, Y 좌표를 찾아줄 함수 */
    center: function() {
      var x, y;
      //화면크기에서 반을 나눈값 - (개별 타일 높이 X 화면 배율) X (세로 칼럼 수)
      x = (this.WIDTH/2) - ((field.building.tiles.width * this.MULTIPLIER) * field['columns']) / 2;
      y = (this.HEIGHT/2) - ((field.building.tiles.height * this.MULTIPLIER) * (field['building']['map'].length / field['columns'])) / 2;
      return {x, y}
    },


    /* This function draws the tile graphics from the tile_sheet.image to the buffer
    one by one according to the world.map. It then draws the buffer to the display
    canvas and takes care of scaling the buffer image up to the display canvas size. */
    render:function() {

      if(field.building.map.length === 0) {
        return;
      }
      else {
        /* Here we loop through the tile map. */
        for (let index = field.building.map.length - 1; index > -1; -- index) {

          if(field.building.map[index] === '') {
              continue;
          }
          /* We get the value of each tile in the map which corresponds to the tile
          graphic index in the tile_sheet.image. */
          var temporary = field.building.map[index].split('-');
          var pointer = temporary[0];
          var value = temporary[1];

          /* This is the x and y location at which to cut the tile image out of the
          tile_sheet.image. */
          var source_x = (value % field.building.tiles.columns) * field.building.tiles.width;
          /* Math.floor 함수는 소수점 이하의 수를 버림한다. */
          var source_y = Math.floor(value / field.building.tiles.columns) * field.building.tiles.height;

          /* This is the x and y location at which to draw the tile image we are cutting
          from the tile_sheet.image to the buffer canvas. */

          var destination_x = (index % field.columns) * field.building.tiles.width;
          var destination_y = Math.floor(index / field.columns) * field.building.tiles.height;

          /* Draw the tile image to the buffer. The width and height of the tile is taken from the tile_sheet object. */
          this.buffer.drawImage(field.building.tiles.imgs[pointer], source_x, source_y, field.building.tiles.width, field.building.tiles.height, destination_x, destination_y, field.building.tiles.width, field.building.tiles.height);

        }

        if(field.deco.map.length !== 0) {
          /* Here we loop through the tile map. */
          for (let index = field.deco.map.length - 1; index > -1; -- index) {

            if(field.deco.map[index] === '') {
                continue;
            }
            /* We get the value of each tile in the map which corresponds to the tile
            graphic index in the tile_sheet.image. */
            var temporary = field.deco.map[index].split('-');
            var pointer = temporary[0];
            var value = temporary[1];

            /* This is the x and y location at which to cut the tile image out of the
            tile_sheet.image. */
            var source_x = (value % field.deco.tiles.columns) * field.deco.tiles.width;
            /* Math.floor 함수는 소수점 이하의 수를 버림한다. */
            var source_y = Math.floor(value / field.deco.tiles.columns) * field.deco.tiles.height;

            /* This is the x and y location at which to draw the tile image we are cutting
            from the tile_sheet.image to the buffer canvas. */
            var destination_x = (index % field.columns) * field.deco.tiles.width;
            var destination_y = Math.floor(index / field.columns) * field.deco.tiles.height;

            /* Draw the tile image to the buffer. The width and height of the tile is taken from the tile_sheet object. */
            this.buffer.drawImage(field.deco.tiles.imgs[pointer], source_x, source_y, field.deco.tiles.width, field.deco.tiles.height, destination_x, destination_y, field.deco.tiles.width, field.deco.tiles.height);

          }
        }

        /* */
        this.context.linestyle = 'red';
        this.context.beginPath();
    		this.context.moveTo(this.WIDTH/2, 0);
    		this.context.lineTo(this.WIDTH/2, this.HEIGHT);
    		this.context.moveTo(0, this.HEIGHT/2);
    		this.context.lineTo(this.WIDTH, this.HEIGHT/2);
    		this.context.closePath();
    		this.context.strokeStyle= 'white'
    		this.context.stroke();

        /* Now we draw the finalized buffer to the display canvas. You don't need to
        use a buffer; you could draw your tiles directly to the display canvas. If
        you are going to scale your display canvas at all, however, I recommend this
        method, because it eliminates antialiasing problems that arize due to scaling
        individual tiles. It is somewhat slower, however. */
        this.context.drawImage(this.buffer.canvas, 0, 0, field.width, field.height, this.center().x, this.center().y, this.context.canvas.width/this.MULTIPLIER, this.context.canvas.height);
      }
    },

    /* Resizes the display canvas when the screen is resized. */
    resize:function(event) {

      display.context.canvas.width = document.documentElement.clientWidth;
      display.context.canvas.height = document.documentElement.clientHeight;
      display.buffer.imageSmoothingEnabled = display.context.imageSmoothingEnabled = false;
      display.render();


    }
  };

  //// INITIALIZE ////

  /* Before we can draw anything we have to load the tile_sheet image. */
  field.building.tiles.imgs[field.building.tiles.imgs.length-1].addEventListener("load", function(event) {
    display.buffer.canvas.height = field.height;
    display.buffer.canvas.width  = field.width;

    display.resize();

  });

  return display;
};

$(document).ready(function() {

  var field = {

    columns:30,
    height:480,
    width:480,

    building: {

        map: ['0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-0','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              '0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15','0-1','4-15',
              ],
      tiles: {
          imgs: ['ground_grounds_1.png',
                'ground_grounds_2.png',
                'ground_paths_cobble_1.png',
                'ground_paths_grass_1.png',
                'ground_water.png',
                'ground_cliffs.png'],
          columns: 16,
          height: 16,
          width: 16,
      },
    },

    deco: {
      map: [],
      tiles: {
          imgs: ['ground_grounds_1.png',
                'ground_grounds_2.png',
                'ground_paths_cobble_1.png',
                'ground_paths_grass_1.png',
                'ground_water.png',
                'ground_cliffs.png'],
          columns: 16,
          height: 16,
          width: 16,
            },
    },
  }

  /* Start loading the image. */
  var display = new mapRenderer(field);

  display.render();
  window.addEventListener("resize", display.resize);
})

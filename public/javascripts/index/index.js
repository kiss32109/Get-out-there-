/* 인덱스 페이지 전환 함수 */
var sliding;

function pageSlide() {
  const PAGE = [
    "HOME",
    "INFORMATION",
    "EVENT",
  ];
  const body = $(document.body);
  let count = 1;
  sliding = setInterval(function() {
    body.css({
      "background-image":"url(../../images/index/"+ PAGE[count] + ".jpg)",
      "background-repeat" : "no-repeat",
      "background-position": "center",
      "background-attachment": "fixed"
    });
    // 페이지 슬라이딩이 적용될 태그의 기존 내용을 초기화시킨다.
    $('nav[class*="navbar"]').find($('div[id*=page-tabs]')).find($('a[class*=active]'))
      .removeClass('active');
    // 적용시킬 페이지를 불러오고, 페이지 탭을 활성화 시킨다.
    $('section[id*="pages"]').html('').load("/pages/"+ PAGE[count] +".ejs").trigger("create");
    $('nav[class*="navbar"]').find($('div[id*=page-tabs]')).find($('a[id~=' + PAGE[count] + ']')).addClass('active');
    // 페이지별 게임 시작하기 버튼의 색상이 다르므로, ID값을 변경해준다.
    $('div[id*=game-control-box]').children('button').attr('id', PAGE[count]);
    // 페이지별 로그인 및 회원가입 버튼의 색상이 다르므로, ID값을 변경해준다.
    $('div[id*=game-detail]').find('button').attr('id', PAGE[count]);

    // 슬라이드 전환을 위한 카운트 변수 설정
    switch (count) {
      case 0:
      case 1: count++; break;
      case 2: count=0; break;
    }
  }, 10000);
}

/* 페이지 탭 수동 전환 설정 함수 */
function pageTabs(id) {
  clearInterval(sliding);
  var url = "url(../../images/index/"+ id + ".jpg)";
  const body = $(document.body);
  body.css({
    "background-image": url,
    "background-repeat" : "no-repeat",
    "background-position": "center",
    "background-attachment": "fixed",
  });
  // 페이지 슬라이딩이 적용될 태그의 기존 내용을 초기화하고, 적용시킬 페이지를 불러온다.
  $('section[id*="pages"]').html('').load("/pages/" + id + ".ejs").trigger("create");
  $('nav[class*="navbar"]').find($('div[id*=page-tabs]')).find($('a[class*=active]'))
    .removeClass('active');
  $('nav[class*="navbar"]').find($('div[id*=page-tabs]')).find($('a[id*=' + id + ']')).addClass('active');
    // 페이지별 게임 시작하기 버튼의 색상이 다르므로, ID값을 변경해준다.
  $('div[id*=game-control-box]').children('button').attr('id', id);
  // 페이지별 로그인 및 회원가입 버튼의 색상이 다르므로, ID값을 변경해준다.
  $('div[id*=game-detail]').find('button').attr('id', id);
}
function show_login() {
  /* 회원가입창이 보여짐 상태 중이라면
     토글 후 로그인창 토글
  */

  /* 해수가 건든 곳 */
  if($('button[id*=HOME]').attr('name')){
    location.href="/game";
  }
  /* 로그인 성공했을 때, button 태그의 name 에 닉네임을 넣어주어
     if문으로 게임시작(/game) 으로 갈 수 있게 해줌 */

  else if($('form[class*=show]').attr('id')==='registration') {
    before_alert();
    show_login();
  }
  /* 로그인 및 회원가입창 토글
     이미 보여짐 상태라면 숨김
  */
  else if($('form[class*=show]').length === 0) {
    $('form[id*=login]').collapse('show');
  }
  else {
    $('form[id*=login]').collapse('hide');
  }
}

/* 회원가입 폼으로 전환 함수 */
function show_registration() {

  // 전환 전 하단 네비게이션 정리
  before_alert();

  $('form[id*=registration]').collapse('show');
}

/* 하단 네비게이션 바 작업 전 초기화 설정 */
function before_alert() {

	// 경고창이 띄워져 있는 경우
	if(	$("[id*=warnning][class*=show]").length>0){
		$("[id*=warnning][class*=show]").collapse('hide');
	}
  // 로그인 및 회원가입 폼이 띄워져 있는 경우
  else if($('form[class*=show]').length>0) {
    $('form[class*=show]').collapse('hide');
  }
  else {
		return;
	}
}

/* 해수 - 로그아웃 기능 */
function logout(){
  location.href="/login/logout";
}


/* 인덱스 페이지 DOM 생성시 호출 함수 */
$(document).ready(function() {
  pageSlide();

  $('button[name*=join_button]').click(function(){
    if($('input[id*=validate]').attr('name')){
      alert('닉네임이나 이메일이 중복되었습니다');
    }
  })

  $('div[id*=game-control-box]').children('button').on({
    'mouseenter': function() {
      $('div[id*=game-control-box]').children('button').css({
        'font-size': '55px',
      });
    },
    'mouseleave': function() {
      $('div[id*=game-control-box]').children('button').css({
        'font-size': '50px',
      });
    },
  });
})

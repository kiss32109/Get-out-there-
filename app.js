var bodyParser = require('body-parser');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var gameRouter = require('./routes/game/game');

var app = express();

/* 소켓 관련 설정
  app.js 내부에서 socket.io를 사용할 때,
  io = require('socket.io')();
  를 사용하면, bin/www에서 서버와 연결하기 어렵다.
*/
app.io = require('socket.io')();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/*
  노드에서는 파일 사이에 모듈 관계가 있는 경우가 많아 현재 파일의 경로나 파일명을
  알아야 하는 경우가 있다. 노드는 __filename, __dirname이라는 키워드로 경로에
  대한 정보를 제공한다.
*/

/*
  path 내장 모듈 복습
  path 모듈은 폴더와 파일의 경로를 쉽게 조작하도록 도와주는 모듈이다.

  cosnt string = __filename // __dirname과의 차이는 파일의 이름까지 표시한다는 것이다.

  console.log(path.sep);  // seperator의 약자로 경로의 구분자 표시
  console.log(path.delimiter);  // 환경 변수의 구분자
  console.log(path.dirname(__filename));  // 파일이 위치한 폴더 경로를 보여준다.
                                          // __dirname과 동일한 역할?
  console.log(path.extname(__filename));  // extension의 약자 파일의 확장자 표시
  console.log(path.basename(__filename)); // 파일의 이름(확장자 포함) 표시
  console.log(path.basename(__filename, path.extname(__filename))); // 파일의 이름만 표시하고 싶다면
                                                                    // 두 번째 인자로 파일의 확장자를 넣어주면 된다.
  console.log(path.parse(__filename));  // 파일 경로를 root, dir, base, ext, name으로 분리한다.
  console.log(path.format({
    dir: 'C:\\users\\zerocho',
    name: 'path',
    ext: 'js',
  }));  // path.parse()한 객체를 파일 경로로 합친다.
  console.log(path.normalize());  // /나 \를 실수로 여러번 사용했거나 혼용했을 때 정상적인 경로로 변환한다.
  console.log(path.relative()); // 경로를 두 개 넣으면 첫 번째 경로에서 두 번째 경로로 가는 방법을 알려준다.
  console.log(path.join(__dirname, '..', '..', '/users', '.', '/zerocho')); // 여러 인자를 넣으면 하나의 경로로 합쳐준다.
  console.log(path.resolve(__dirname, '..', 'users', '.', '/zerocho')); // join과 비슷하지만 /를 만나면 절대경로로 인식해서 앞의 경로를 무시한다.
*/

/*
  morgan
  요청에 대한 정보를 콘솔에 기록해 준다.
  함수의 인자로 dev 대신 short, common, combined 등을 줄 수 있다.
  인자에 따라 콘솔에 나오는 로그가 달라진다.
*/
app.use(logger('dev'));
// app.use(logger('short'));
// app.use(logger('common'));
// app.use(logger('combined'));

/*
  static
  static 미들웨어는 정적인 파일들을 제공한다. 함수의 인자로 정적 파일들이 담겨 있는
  폴더를 지정하면 된다.

  예를들어 public/stylesheets/style.css는 http://localhost:3000/stylesheets/style.css로
  접근할 수 있다. 실제 서버의 폴더 경로에는 public이 들어있지만, 요청 주소에는 public이 들어있지
  않다는 점을 주목하자.

  서버의 폴더 경로와 요청 경로가 다르므로 외부인이 서버의 구조를 쉽게 파악할 수 없다는 장점이 있는데,
  이는 보안에 큰 도움이 된다.

  또한, 정적 파일들을 알아서 제공해주므로 fs.readFile로 파일을 직접 읽어서 전송할 필요가 없다.

  app.use('/img', express.static(path.join(__dirname, 'public')));
  위와같이 정적 파일을 제공할 주소를 지정할 수도 있다. public 폴더 안에 abc.png가 있다고 가정하면,
  /img 경로를 붙인 http://localhost:3000/img/abc.png주소로 접근할 수 있다.

  static 미들웨어는 요청에 부합하는 정적 파일을 발견한 경우 응답으로 해당 파일을 전송한다.
  이 경우, 응답을 보냈으므로 다음에 나오는 라우터가 실행되지않는다. 만약 파일을 찾지 못했다면 요청을 라우터로 넘긴다.

  따라서, 서버가 쓸데없는 미들웨어 작업을 하는 것을 막기 위해 최대한 위쪽에 배치하는 것이 좋다.
*/
app.use(express.static(path.join(__dirname, 'public')));
app.use('/client',express.static(__dirname + '/client'));
app.use('/pages', express.static(path.join(__dirname, 'views/index/pages')));

/*
  body-parser
  요청의 본문을 해석해주는 미들웨어로 보통 폼이나, AJAX 요청의 데이터를 처리한다.
*/

app.use(bodyParser.json());
// app.use(express.json());

/* 익스프레스 4.16.0 버전부터 body-parser의 일부 기능이 익스프레스에 내장 되었다.
  단, body-parser가 필요한 경우가 있는데, JSON과 URL-encoded 형식의 본문 외에도
  Raw, Text 형식의 본문도 추가로 해석할 수 있기 때문이다.
 */

/*
  { extended: false } 옵션이 false면 노드의 querystring 모듈을 사용하여 쿼리 스트링을
  해석하고, true면 qs 모듈을 사용하여 쿼리스트링을 해석한다.
  qs 모듈은 내장 모듈이 아니라 npm 패키지이며, querystring 모듈의 기능을 조금 더 확장한 모듈이다.
*/

/*
  querystring 내장 모듈 복습
  WHATWG 방식의 url 대신 기존 노드의 url을 사용할 때 search 부분을 사용하기 쉽게 객체로 만드는 모듈

  const url = require('url');
  const querystring = require('querystring');

  const parseUrl = url.parse('http://www.gilbut.co.kr/?page=3%limit=10&category=nodejs&category=javascript');
  const query = querystring.parse(parseUrl);
  console.log(query); // url의 query 부분을 자바스크립트 객체로 분해해준다.
  console.log(querystring.stringify(query));  // 분해된 query 객체를 문자열로 다시 조립해준다.
*/
app.use(express.urlencoded({ extended: false }));
/*
  Raw는 본문이 버퍼 데이터일 때, Text는 본문이 텍스트 데이터일 때 해석하는 미들웨어 이다.
*/
app.use(bodyParser.raw());
app.use(bodyParser.text());

/*
  cookie-parser
  요청에 동봉된 쿠키를 해석해 준며, 이렇게 해석된 쿠키들은 request.cookies 객체에 들어간다.
  app.use(cookieParser('secret code'));
  위와깉이, 첫 번째 인자로 문자열을 넣어줄 수 있는데, 이렇게 되면 쿠키들은 제공한 문자열로 서명된
  쿠키가 되고, 서명된 쿠키는 클라이언트에서 수정했을 때 에러가 발생하므로 클라이언트에서 쿠키로 위험한
  행동을 하는 것을 방지할 수 있다.
*/
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/game', gameRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error/error');
});

/* 게임 관련 로직 */
require('./routes/game/libs/field');
require('./routes/game/libs/closet');
require('./routes/game/libs/weapon');
require('./routes/game/libs/entity');
require('./routes/game/libs/player');
require('./routes/game/libs/bullet');
require('./routes/game/libs/inventory');

/* app.js에 소켓관련 코드가 섞이지 않게 모듈을 따로 분리해서 작성한다. */
require('./routes/game/libs/socketConnection')(app.io);

/* /게임 관련 로직 */

module.exports = app;

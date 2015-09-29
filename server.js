// server.js
var express = require('express');
var path = require('path');
var config = require('./config');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt'); // NOTE: 필요없는 묘듈? 테스트요망
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var mongoose = require('mongoose');
// 모델 임포트
var models = require('./models/models');
// 라우트 임포트
var api = require('./routes/api');
var authenticate = require('./routes/authenticate')(passport);

var app = express();

// 설정============================================

// body parser를 이용해서 POST 요청으로부터 정보를 가져온다.
// 모든 요청을 콘솔에 표시한다.
app.use(morgan('dev'));
app.use(session({
  secret: 'tester yea'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
// 서버 공용 에셋 폴더를 설정한다.
app.use(express.static(__dirname + '/public'));
app.use(passport.initialize());
app.use(passport.session());

// 루트 패스에 라우터를 등록한다. 사용예 > localhost:5000/api/posts
app.use('/api', api);
app.use('/auth', authenticate);

// Passport 초기화
var initPassport = require('./passport');
initPassport(passport);

// mongodb 데이터베이스 접속
mongoose.connect(config.database);

// 메인 캐치콜 라우트 =============
// API 라우트 이후에 등록해야된다.
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/views/index.html'));
});

// 서버 시작
// ================================
app.listen(config.port);
console.log('Start Server http://localhost:' + config.port);

module.exports = app;

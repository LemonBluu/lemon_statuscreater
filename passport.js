var mongoose = require('mongoose');
var User = mongoose.model('User');
var LocalStrategy = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

module.exports = function (passport) {
	// Passport는 로그인 세션을 지원하기 위해 시리얼라이즈와 디시리얼라이즈가 필요하다
	passport.serializeUser(function (user, done) {
		console.log('시리얼라이징 유저', user.username);
		done(null, user._id);
	});

	// 시리얼라이즈 유저로부터 제공받은 고유 id를 디시리얼라이즈 유저가 불러온다.
	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			console.log('deserializing user:', user.username);
			done(err, user);
		});
	});

	passport.use('login', new LocalStrategy({
			passReqToCallback: true
		},
		function (req, username, password, done) {
			User.findOne({
					'username': username
				},
				function (err, user) {
					// 아무 에러나 발생하면, done 메소드를 이용해 리턴한다.
					if(err)
						return done(err);
					// 유저 이름이 없으면 로그와 에러메시지 리턴
					if(!user) {
						console.log('유저가 없습니다');
						return done(null, false);
					}

					if(!isValidPassword(user, password)) {
						console.log('패스워드가 맞지 않습니다.');
						return done(null, false);
					}
					// 둘다 맞으면 유저이름을 done 메소드를 통해 내보낸다
					return done(null, user);
				}
			);
		}
	));

	passport.use('signup', new LocalStrategy({
			passReqToCallback: true
		},

		function (req, username, password, done) {

			findOrCreateUser = function () {
				User.findOne({
						'username': username
					},
					function (err, user) {
						if(err) {
							console.log('가입이 불가능합니다' + err);
							return done(err);
						}
						if(user) {
							console.log('유저이름이 이미 있습니다');
							return done(null, false);
						} else {
							var newUser = new User();

							newUser.username = username;
							newUser.password = createHash(password);

							newUser.save(function (err) {
								if(err) {
									console.log('유저 등록 오류: ' + err);
									throw err;
								}
								console.log(newUser.username + ' 등록 완료');
								return done(null, newUser);
							});
						}
					});
			};
			// 메소드 실행에 딜레이를 준다
			// 이벤트 루프를 다음 Tick으로
			process.nextTick(findOrCreateUser);
		}));

	var isValidPassword = function (user, password) {
		return bCrypt.compareSync(password, user.password);
	};
	// Generates hash using bCrypt
	var createHash = function (password) {
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};

}; // function(passport)

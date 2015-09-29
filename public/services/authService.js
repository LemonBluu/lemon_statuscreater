angular.module('authService', [])

.factory('Auth', function ($http, $q, AuthToken)
{

	var authFactory = {};

	// 로그인 시
	authFactory.login = function (username, password)
	{

		// username, password 를 POST 한다
		return $http.post('/api/authenticate',
			{
				username: username,
				password: password
			})
			.success(function (data)
			{
				AuthToken.setToken(data.token);
				return data;
			});
	};

	// 유저가 나갈 시
	authFactory.logout = function ()
	{
		// 토큰 비우기
		AuthToken.setToken();
	};

	// 이미 로그인 해 있는 경우, 토큰을 가져와서 체크
	authFactory.isLoggedIn = function ()
	{
		if(AuthToken.getToken())
			return true;
		else
			return false;
	};

	// api/me 에서 유저를 가져 옴
	authFactory.getUser = function ()
	{
		if(AuthToken.getToken())
			return $http.get('/api/me',
			{
				cache: true
			});
		else
			return $q.reject(
			{
				message: '아직 토큰을 가지고 있지 않습니다.'
			});
	};

	return authFactory;

})

// ===============================================
// $windows 를 통해서 클라이트쪽 저장소에 토큰을 저장한다
// ===============================================
.factory('AuthToken', function ($window)
{

	var authTokenFactory = {};

	// 로컬 저장소에서 토큰을 가져온다.
	authTokenFactory.getToken = function ()
	{
		return $window.localStorage.getItem('token');
	};

	// 토큰을 설정하거나, 비우기 위한 함수
	// 토큰이 패스되면, 토큰을 설정
	// 토큰이 없으면, 로컬 저장소에서 삭제
	authTokenFactory.setToken = function (token)
	{
		if(token)
			$window.localStorage.setItem('token', token);
		else
			$window.localStorage.removeItem('token');
	};

	return authTokenFactory;

})

// ===============================================
// 요청 내의 토큰을 통합해서 어플리케이션에 설정한다
// ===============================================
.factory('AuthInterceptor', function ($q, $location, AuthToken)
{

	var interceptorFactory = {};

	// 모든 HTTP 요청에 대해 반응한다.
	interceptorFactory.request = function (config)
	{

		// 토큰을 가져온다. (AuthToken Factory 관련)
		var token = AuthToken.getToken();

		// 토큰이 할당되면, x-acces-token 헤더에 추가한다
		if(token)
			config.headers['x-acces-token'] = token;

		return config;
	};

	// 리스폰스 에러가 나면
	interceptorFactory.responseError = function (response)
	{

		// 리폰스 포비든 403 에러 리턴
		if(response.status == 403)
		{
			AuthToken.setToken();
			// login 페이지로 강제로 보낸다
			$location.path('/login');
		}

		// 프로미스에 의한 서버 에러를 리턴
		return $q.reject(response);
	};

	return interceptorFactory;

});

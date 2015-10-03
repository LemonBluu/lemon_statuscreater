// appRouter.js
angular.module('viewRouter', [])

.config(function($routeProvider) {
  $routeProvider
    .when('/list', {
      templateUrl: 'views/pages/list.html',
      controller: 'listController'
    })

    .when('/login', {
      templateUrl: 'views/pages/login.html',
      controller: 'authController'
    })
    .when('/register', {
      templateUrl: 'views/pages/register.html',
      controller: 'authController'
    })
    .when('/addPost', {
      templateUrl: 'views/pages/post.html',
      controller: 'postController'
    })
    .otherwise({
      redirectTo: '/list'
    });
});

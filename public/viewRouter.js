// appRouter.js
angular.module('viewRouter', [])

.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'views/pages/buildings.html',
      controller: 'buildingListController'
    })
    
    .when('/login', {
      templateUrl: 'views/pages/login.html',
      controller: 'authController'
    })
    .when('/register', {
      templateUrl: 'views/pages/register.html',
      controller: 'authController'
    })
    .when('/addBuilding', {
      templateUrl: 'views/pages/addBuilding.html',
      controller: 'buildingAddController'
    })
    .otherwise({
      redirectTo: '/'
    });
});

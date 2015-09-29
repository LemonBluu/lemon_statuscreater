angular.module('authCtrl', [])

.controller('authController', function($scope, $http, $rootScope, $location) {
  $scope.user = {};
  $scope.error_message = '';

  $scope.login = function() {
    $http.post('/auth/login', $scope.user).
    success(function(data) {
      if (data.state == 'success') {
        $rootScope.authenticated = true;
        $rootScope.current_user = data.user.username;
        $location.path('/');
      } else {
        $scope.error_message = data.message;
      }
    });
  };

  $scope.register = function() {
    $http.post('/auth/signup', $scope.user)
      .success(function(data) {
        if (data.state == 'success') {
          $rootScope.authenticated = true;
          $rootScope.current_user =
            data.user.username;
          $location.path('/');
        } else {
          $scope.error.message = data.message;
        }
      });
  };
  //
  // $scope.logout = function() {
  //   $http.get('/auth/signout');
  //   $rootScope.authenticated = false;
  //   $rootScope.current_user = 'Guest';
  //   console.log('log');
  // };

});

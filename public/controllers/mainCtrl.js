angular.module('mainCtrl', [])
  // TODO : 로그인시 function 사용가능 체크
  // TODO : 멀티플 필터
  // TODO : 게시물 수정기능
  // TODO : 가상서버 등록

.run(function($http, $rootScope, $location) {
  $rootScope.authenticated = false;
  $rootScope.current_user = 'Guest';

  $rootScope.logout = function() {
    $http.get('/auth/signout');
    $rootScope.authenticated = false;
    $rootScope.current_user = 'Guest';
    console.log('log');
  };
})

.controller('mainController', function($scope, $http, $rootScope, postService) {

  $scope.categoryName = '전체';
  $scope.search = function(value) {
    $rootScope.enteredValue = value;
  };
  // DB 갯수 체크
  $scope.dbCounter = $rootScope.dbCount;

  // 카테고리 필터
  $scope.setCategoryFilter = function(res) {
    $scope.categoryFilter = res;
  };
  // 거래 종류 필터
  $scope.setDealFilter = function(res) {
    $scope.dealFilter = res;
  };
  // 필터 전체 해제
  $scope.clearFilter = function() {
    console.log('test');
    $scope.categoryFilter = '';
    $scope.dealFilter = '';
    $rootScope.enteredValue = '';
  };
})

// buildings.html 빌딩 리스트  ==============================
.controller('buildingListController', function($scope, $rootScope, $http, $location, postService) {
    // 로그인 체크
    if ($rootScope.authenticated === false) {
      $location.path('/login');
    } else {
      // DB에서 리스트 모두 불러오기
      $scope.buildings = postService.query();
      $scope.search = 'test';
      // DB에서 삭제하기
      $scope.deleteBuilding = function(data) {
        data.$delete(function() {
          $location.path('/buildings');
        });
        postService.query().$promise.then(function(data) {
          //매물 번호 세팅
          $rootScope.dbCount = data.length;
        });
      };
    } // if($rootScope.authenticated === false)
  }) // .controller

// addBuilding.html 매물 추가 ==============================
.controller('buildingAddController', function($scope, $rootScope, $http, $location, postService) {
  // 로그인 체크
  if ($rootScope.authenticated === false) {
    $location.path('/login');
  } else {
    // 새로운 게시물 준비
    $scope.building = new postService();
    // 드롭다운 클릭시
    $scope.building.category = "분류";

    $scope.selectCategory = function(selected) {
      $scope.building.category = selected;
    };

    // 기입버튼 클릭
    $scope.post = function() {
      postService.query().$promise.then(function(data) {
        //매물 번호 세팅
        $scope.building.postNum = data.length + 1;
        $scope.building.postedBy = $rootScope.current_user;
        postService.save($scope.building);
        $rootScope.dbCount = $scope.building.postNum - 1;
        $location.path('/buildings');
      });
    };

    $scope.testPost = function() {
      $scope.building.category = '상가',
        $scope.building.title = '좋은빌',
        $scope.building.address = '반포동',
        $scope.building.roomNum = '101호',
        $scope.building.bedRooms = '2',
        $scope.building.bathRooms = '1',
        $scope.building.size = '25',
        $scope.building.priceSale = '10',
        $scope.building.priceRent = '5',
        $scope.building.phoneNum01 = '010-333-3333',
        $scope.building.endDate = '2015-05-05'
      $location.path('/buildings');
    };
  }
}); // buildingAddController

// $http.get('/json/category.json')
//   .success(
//     function(res) {
//       $scope.categoryList = res.categoryList;
//       $scope.dealList = res.dealList;
//     }
//   );

// 분류 클릭시 항목들
// $scope.items = [
//   '주택',
//   '상가',
//   '사무실'
// ];

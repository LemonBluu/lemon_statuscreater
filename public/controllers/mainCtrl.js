angular.module('mainCtrl', [])

// 기본 인증 세팅
.run(function($http, $rootScope, $location) {
  $rootScope.authenticated = true;
  $rootScope.current_user = 'Guest';

  // 로그아웃시 인증해제
  $rootScope.logout = function() {
    $http.get('/auth/signout');
    $rootScope.authenticated = false;
    $rootScope.current_user = 'Guest';
    console.log('log');
  };
})

// index.html ==============================
.controller('mainController', function($scope, $http, $rootScope, postService) {

  // json 불러오기
  $http.get('/json/setting.json')
    .success(
      function(res) {
        $scope.baseStatus = res.baseStatus;
        $scope.levelAll = res.level;
        $scope.categoryAll = res.category;
        $scope.rareAll = res.rare;
        $scope.typeAll = res.type;
      }
    );

  $rootScope.selectedLevel = 1;
  $rootScope.selectedCategory = '';
  $rootScope.selectedRare = '';
  $rootScope.selectedType = '';
  $rootScope.rareBonus = 0;

  // 이름으로 검색
  $scope.search = function(value) {
    $rootScope.enteredValue = value;
  };
  // 레벨 필터
  $scope.setLevel = function(res) {
    $rootScope.selectedLevel = res;
    $scope.randomStatus();
  };
  // 희귀도 필터
  $scope.setRare = function(res) {
    $rootScope.selectedRare = $scope.rareAll[res].name;
    $rootScope.rareBonus = $scope.rareAll[res].bonus;
    $scope.randomStatus();
  };
  // 직업 분류 필터
  $scope.setCategory = function(res) {
    $rootScope.selectedCategory = res;
  };
  // 타입 필터
  $scope.setType = function(res) {
    $rootScope.selectedType = res;
  };
  // 필터 전체 해제
  $scope.clearFilter = function() {
    $rootScope.selectedCategory = '';
    $rootScope.selectedLevel = 1;
    $rootScope.selectedRare = '';
    $rootScope.selectedType = '';
    $rootScope.rareBonus = 0;
    $rootScope.enteredValue = '';
    console.log('필터 모두 해제됨');
  };
  $scope.randomStatus = function() {
    // 공격력과 체력 랜덤 배분
    $rootScope.addAll = $scope.baseStatus + $rootScope.selectedLevel + $rootScope.rareBonus;
    $rootScope.attack = Math.floor(Math.random() * ($scope.addAll - 1)) + 1;
    $rootScope.hitpoint = $scope.addAll - $scope.attack;
  };

  // 유닛 생성
  $scope.create = function() {
    // 항목이 선택되지 않았을 때 랜덤 항목 선택
    if ($rootScope.selectedCategory === '') {
      var i = Math.floor(Math.random() * $scope.categoryAll.length);
      $rootScope.selectedCategory = $scope.categoryAll[i];
    }
    if ($rootScope.selectedType === '') {
      var j = Math.floor(Math.random() * $scope.typeAll.length);
      $rootScope.selectedType = $scope.typeAll[j];
    }
    if ($rootScope.selectedRare === '') {
      var k = Math.floor(Math.random() * $scope.rareAll.length);
      $rootScope.selectedRare = $scope.rareAll[k].name;
      $rootScope.rareBonus = $scope.rareAll[k].bonus;
    }
    $scope.randomStatus();
  };
})

// list.html 빌딩 리스트  ==============================
.controller('listController', function($scope, $rootScope, $http, $location, postService) {
    // 로그인 체크
    if ($rootScope.authenticated === false) {
      $location.path('/login');
    } else {
      // DB에서 리스트 모두 불러오기
      $scope.posts = postService.query();

      // DB에서 삭제하기
      $scope.deleteBuilding = function(data) {
        data.$delete(function() {
          $location.path('/post');
        });
        postService.query().$promise.then(function(data) {
          //매물 번호 세팅
          $rootScope.dbCount = data.length;
        });
      };
    } // if($rootScope.authenticated === false)
  }) // .controller

// post.html게시물 추가 ==============================
.controller('postController', function($scope, $rootScope, $http, $location, postService) {
  // 로그인 체크
  if ($rootScope.authenticated === false) {
    $location.path('/login');
  } else {
    // 새로운 게시물 준비
    $scope.post = new postService();

    // 기입버튼 클릭
    $scope.addPost = function() {
      postService.query().$promise.then(function(data) {
        // 스탯 세팅
        $scope.post.level = $rootScope.selectedLevel;
        $scope.post.category = $rootScope.selectedCategory;
        $scope.post.rare = $rootScope.selectedRare;
        $scope.post.type = $rootScope.selectedType;
        $scope.post.attack = $rootScope.attack;
        $scope.post.hitpoint = $rootScope.hitpoint;
        //게시물 번호 세팅
        $scope.post.postNum = data.length + 1;
        // 작성자 세팅
        $scope.post.postedBy = $rootScope.current_user;
        postService.save($scope.post);
        $location.path('/list');
        console.log("excute");
      });
    };
  }
}); // buildingAddController

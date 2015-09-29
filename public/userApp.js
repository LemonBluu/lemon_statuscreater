// userApp.js 모듈들을 불러온다
angular.module('userApp', [
  'ngRoute', // Angulrjs 라우터
  'ngResource', // Angularjs 리소스
  'ui.bootstrap', // 부트스트랩 스크립트
  'userService', // 기본 서비스
  'mainCtrl', // 메인 컨트롤러
  'authCtrl', // 인증 컨트롤러
  'viewRouter' // 페이지 변경 라우터
]);

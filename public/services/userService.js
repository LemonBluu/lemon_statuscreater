angular.module('userService', [])

.factory('postService', function($resource) {
    return $resource('/api/posts/:id', {
      id: '@_id'
    }, {
      update: {
        method: 'put'
      }
    });
  })
  //
  // .factory('dblengthService', function(postService) {
  //   return postService.query.length;
  // });

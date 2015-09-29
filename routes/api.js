var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
// var User = mongoose.model('User');
// TODO: 유저 모델 추가

router.route('/posts')

.post(function(req, res) {
  var post = new Post(req.body);
  // TODO:로그인 사용자와 연결
  // post.created_by = req.body.created_by;
  post.save(function(err, post) {
    if (err) {
      return res.send(500, err);
    }
    return res.json(post);
  });
})

.get(function(req, res) {
  Post.find(function(err, posts) {
    if (err) {
      return res.send(500, err);
    }
    return res.send(posts);
  });
});

router.route('/posts/:id')
  .get(function(req, res) {
    Post.findById(req.params.id, function(err, post) {
      if (err)
        res.send(err);
      res.json(post);
    });
  })

.put(function(req, res) {
  Post.findById(req.params.id, function(err, post) {
    if (err)
      res.send(err);

    post.save(function(err, post) {
      if (err)
        res.send(err);

      res.json(post);
    });
  });
})

.delete(function(req, res) {
  Post.remove({
    _id: req.params.id
  }, function(err) {
    if (err)
      res.send(err);
    res.json("deleted complete");
  });
});

// 외부에서 라우터 모듈을 불러올 수 있다
module.exports = router;

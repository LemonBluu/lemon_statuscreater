var mongoose = require('mongoose');

// 게시물 모델 설정
var postSchema = new mongoose.Schema({
  name: String,
  level: Number,
  category: String,
  rare: String,
  type: String,
  ability: String,
  attack: Number,
  hitpoint: Number,
  comment: String,
  postNum: Number,
  postedBy: String,
  postedAt: {
    type: Date,
    default: Date.now
  }
});

// 유저 모델 설정
var userSchema = new mongoose.Schema({
  username: String,
  password: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Post', postSchema);
mongoose.model('User', userSchema);

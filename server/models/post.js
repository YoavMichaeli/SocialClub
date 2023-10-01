const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'  
    },
    username: {
      type: String,
      required: true
    },
    avatarUrl: {
      type: String,
      default: 'https://example.com/images/default-avatar.jpg'
    }
  },
  content: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'  
  }]
});

const Post = mongoose.model('Post', postSchema);
module.exports = Post;

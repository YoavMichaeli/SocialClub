const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Post'
  },
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
  }
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;

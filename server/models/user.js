const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  avatarUrl: {
    type: String,
    default: 'https://example.com/images/default-avatar.jpg'
  },
  bio: {
    type: String,
    default: ''
  },
  dateJoined: {
    type: Date,
    default: Date.now
  },
  birthDate: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    default: ''
  },
  followersCount: {
    type: Number,
    default: 0
  },
  followingCount: {
    type: Number,
    default: 0
  },
  settings: {
    privateAccount: {
      type: Boolean,
      default: false
    }
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;

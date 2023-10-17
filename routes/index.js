var express = require("express");
var router = express.Router();
var userController = require("../models/dal/user");
var groupHandler = require("../models/dal/group");
var ta = require("time-ago");
var array_tools = require("array-tools");
const NewsAPI = require("newsapi");
const newsapi = new NewsAPI("a4c4e845fea64f9e9c72541aa354a29e").v2;
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
/* GET home page. */

router.get("/", function(req, res, next) {
  if (req.session._id && req.session.user) {

    userController.findOne({ username: req.session.user }, (error, req_user) => {
          if (error) {
            console.log(error);
          }
          var posts = [];
          for(var z=0;z<req_user.following.length;z++) {
            userController.findById(req_user.following[z].toString(), (e,followedUser) => {
              if(e) {
                console.log(e);
              }
              for (var j = 0; j < followedUser.posts.length; j++) {
                followedUser.posts[j].timeago = ta.ago(followedUser.posts[j].createdAt);             
              }
               posts.push(...followedUser.posts);
            })
          }


          for(var z=0;z<req_user.groups.length;z++) {
            groupHandler.findById(req_user.groups[z], (e,followedGroup) => {
              if(e) {
                console.log(e);
              }
              for (var j = 0; j < followedGroup.posts.length; j++) {
                followedGroup.posts[j].timeago = ta.ago(followedGroup.posts[j].createdAt);             
              }
               posts.push(...followedGroup.posts);
            })
          }

          for (var i = 0; i < req_user.posts.length; i++) {
            req_user.posts[i].timeago = ta.ago(req_user.posts[i].createdAt);             
          }

          posts.push(...req_user.posts)
        
          userController.getAll((err, users) => {

            // for (var i = 0; i < users.length; i++) {
            //   for (var j = 0; j < users[i].posts.length; j++) {
            //     users[i].posts[j].timeago = ta.ago(users[i].posts[j].createdAt);
            //     posts.push({ user: users[i], post: users[i].posts[j] });
            //   }
            // }
        var lastSeen = ta.ago(req_user.lastLogin);
        //console.log(posts)
        return res.render("index", {
          user: req_user,
          title: req.app.conf.name,
          lastSeen: lastSeen,
          people: users,
          posts: posts,
          isUserAdmin: req_user.groupsAdmin
        });
      });
    });
  } else {
    res.render("auth/login", {
      title: req.app.conf.name,
      error: false
    });
  }
});

module.exports = router;

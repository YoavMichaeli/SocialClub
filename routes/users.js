var express = require("express");
var router = express.Router();
var path = require("path");
var db = require("../models/dal/user");
var group = require("../models/dal/group");
var textParser = require("../utils/text-parser");
var formParser = require("../utils/form-parser");
var Room = require("../models/room");

router.get("/", async function(req, res, next) {
  var chatsfriendsUsers = [];
  await db.getAll(async (err, users) => {
    await group.getAll((err, groups) => {
      db.findById(req.session._id, (err, user) => {
        Room.find({}).exec(async (err, chatRooms) => {
          const chatsfriendsUsersPromises = chatRooms.map( async chatRoom => {
            let currentUserId = null;
              if (chatRoom.users[0].toString() == req.session._id){
                currentUserId = chatRoom.users[1].toString();
              }
              if (chatRoom.users[1].toString() == req.session._id){
                currentUserId = chatRoom.users[0].toString();
              }
              if (currentUserId) {
                const chatsfriendsUser = db.asyncFindById(currentUserId);
                return chatsfriendsUser;
              }

          });
        chatsfriendsUsers = await Promise.all(chatsfriendsUsersPromises);
        let finalChatsFriendsUsers = chatsfriendsUsers.filter(chatfriendUser => chatfriendUser !== undefined);
        res.render("entities/list", {
          userGroupsAdmin: user.groupsAdmin,
          title: req.app.conf.name,
          users: users,
          groups: groups,
          chatsfriendsUsers: finalChatsFriendsUsers
        });
      });
      });
    });
  });
});

router.get("/:username", function(req, res, next) {
  db.findOne({ username: req.params.username }, (err, user) => {
    db.findById(req.session._id, (err, currentUser) => {
      if (!user) return res.status(404).send("No user found");
      user.bio = textParser(user.bio);
      res.render("entities/profiles/user", {
        title: req.app.conf.name,
        user: user,
        currentUser: currentUser,
        userId: req.session._id      
    });
    });
  });
});
module.exports = router;

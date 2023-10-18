var express = require("express");
var router = express.Router();
var db = require("../../../models/dal/user");
var groupHandler = require("../../../models/dal/group");
var User = require("../../../models/user");
var Group = require("../../../models/group");
var formidable = require("formidable");
var fs = require("file-system");
const {cloudinary, isSetup} = require('../../../config/cloudinary.js');
var Room = require("../../../models/room");

router.post("/v1/comment", function(req, res, next) {
  if (req.body.category == "My Feed"){
  db.comment(
    { username: req.body.author },
    { by: req.session.user, text: req.body.text },
    req.body._id,
    (err, result) => {
      if (result) {
        res.send(true);
      } else {
        res.send(false);
      }
    }
  );
  }else{
    groupHandler.comment(
      { name: req.body.category },
      { by: req.session.user, text: req.body.text },
      req.body._id,
      (err, result) => {
        if (result) {
          res.send(true);
        } else {
          res.send(false);
        }
      }
    )
  }
});

router.post("/v1/like", function(req, res, next) {
  //console.log(req.body);
  if(req.body.category == "My Feed"){
    db.like(
      { username: req.body.author },
      { by: req.session.user },
      req.body._id,
      (err, result) => {
        if (result) {
          res.send({ event: true, msg: "Liked!" });
        } else {
          res.send({ event: false, msg: "Already liked." });
        }
      }
    );
  }else{
    groupHandler.like(
      { name: req.body.category },
      { by: req.session.user },
      req.body._id,
      (err, result) => {
        if (result) {
          res.send({ event: true, msg: "Liked!" });
        } else {
          res.send({ event: false, msg: "Already liked." });
        }
      }
    )
  }

});

router.post("/v1/followGroup", function(req, res, next) {
  groupHandler.findOne(req.body, (err, groupToFollow) => {
      groupToFollow.followers.push(req.session._id);
      groupToFollow.friendsNumber += 1;

      groupToFollow = Group(groupToFollow);
      groupToFollow.save();

      db.findById(req.session._id, (err, user) => {
        user.groups.push(groupToFollow._id.toString());
        user = User(user);
        user.save()
        res.status(200).send("done");

      });
  });
});

router.post("/v1/followUser", function(req, res, next) {
  db.findOne(req.body, (err, userToFollow) => {
    var disabled = false;
    for (var i = 0; i < userToFollow.followers.length; i++) {
      if (userToFollow.followers[i] == req.session._id) {
        console.log(i);
        return (disabled = true);
      }
    }
    if (disabled) {
      res.status(200).send("disabled");
    } else {
      db.findById(req.session._id, (err, currentUser) => {
        if (err) {
          console.log("Unexpected error occured, please see details: " + err);
        }
        currentUser.following.push(userToFollow._id);
        currentUser = User(currentUser);
        currentUser.save(err => {
          if (err) {
            console.log("Couldn't save currentUser to DB, please see details: " + err);
          }
        });
      })
      userToFollow.followers.push(req.session._id);
      userToFollow.notifications.push({
        msg: `${req.session.user} started following you.`,
        link: `/u/${req.session.user}`,
        time: new Date()
      });

      userToFollow = User(userToFollow);
      userToFollow.save(err => {
        res.status(200).send("done");
      });
    }
  });
});

router.post("/v1/user/:mode", function(req, res, next) {
  if (!req.session.user) return res.sendStatus(404);
  if (req.params.mode == "picture") {
    db.findOne({ _id: req.query.id }, (err, user) => {
      if (!user) return res.sendStatus(404);
      var image_types = ["png", "jpeg", "gif", "jpg"];
      var form = new formidable.IncomingForm();

      form.parse(req);

      form.on("fileBegin", function(name, file) {
        if (!image_types.includes(file.name.split(".")[1].toLowerCase())) {
          return res.status(404).send("Unsupported file type!");
        }
        if (
          fs.existsSync(
            __dirname.split("/routes")[0] +
              "/public/images/profile_pictures/" +
              user.username +
              "." +
              file.name.split(".")[1]
          )
        ) {
          fs.unlinkSync(
            __dirname.split("/routes")[0] +
              "/public/images/profile_pictures/" +
              user.username +
              "." +
              file.name.split(".")[1]
          );
        }
        file.path =
          __dirname.split("/routes")[0] +
          "/public/images/profile_pictures/" +
          user.username +
          "." +
          file.name.split(".")[1];
      });
			form.on('file', function (name, file){
				if(!image_types.includes(file.name.split('.')[1].toLowerCase())) {
					return;
				}
				if(file.name && isSetup) {
		      cloudinary.v2.uploader.upload(file.path,
		        function(error, result) {
		          console.log(result, error);
		          if (!error) {
								user['profile_pic'] = result.url;
								user.save((err, profile) => {
									delete req.session.user;
									req.session.user = profile.username;
									req.session._id = profile._id;
									res.status(200).send(result.url)
								})
							}
					});
					return;
				} else {
					user["profile_pic"] =
	          "/images/profile_pictures/" +
	          user.username +
	          "." +
	          file.name.split(".")[1];
	        user.save((err, profile) => {
	          delete req.session.user;
	          req.session.user = profile.username;
	          req.session._id = profile._id;
	          res
	            .status(200)
	            .send(
	              "/images/profile_pictures/" +
	                user.username +
	                "." +
	                file.name.split(".")[1]
	            );
	        });
				}
			});
			return;
		});
		return;
	} else {
		db.findOne({ _id: req.body._id }, (err, user) => {
	    if (err) return res.end(err);
	    if (!user) return res.sendStatus(404);

	    user[req.body.key] = req.body.value;
	    /*user.save(function(err) {
				if(err) console.error(err);
				return res.sendStatus(200);
			})*/
	    user.save((err, profile) => {
	      delete req.session.user;
	      req.session.user = profile.username;
	      req.session._id = profile._id;
	      res.status(200).send("done");
	    });
	  });
	}
});

router.get("/v1/search", function(req, res, next) {
  var regx = "^" + req.query.q + ".*";
  var chatAndTerms = [{
      users: {
        $elemMatch: {
          $eq: req.session._id
        }
      }
    }];
  if (req.query.q) {
    chatAndTerms.push({
      "chats.txt": {
        $regex: ".*" + req.query.q + ".*",
        $options: "i" // Case-insensitive search
      }
    });
  }
  var allEntities = [];
  User.find({
    $or: [
      { username: { $regex: regx } },
      { firstname: { $regex: regx } },
      { lastname: { $regex: regx } }
    ]
  }).exec((err, users) => {
    Group.find({ name: { $regex: regx } }).exec((err, groups) => {
      Room.find({
        $and: chatAndTerms
      })
      .exec( async (err, chats) => {
        if (err) {
          // Handle the error
          console.error(err);
          return;
        }
        let chatFriendUsers = [];
       const chatsPromises =  chats.map(async chat => {
        let chatfriendUser;
        if (chat.users[0].toString() == req.session._id){
          chatfriendUser = await db.asyncFindById(chat.users[1].toString());
        }else if (chat.users[1].toString() == req.session._id){
          chatfriendUser = await db.asyncFindById(chat.users[0].toString());
        }

        chatFriendUsers.push({"chatFriendUserId": chatfriendUser._id, "chatFriendUsername": chatfriendUser.username});
        });

        await Promise.all(chatsPromises);
       
        // Use matchingDocuments as needed
        allEntities.push(...chatFriendUsers)
        allEntities.push(...users);
        allEntities.push(...groups);
        return res.send(allEntities);
      });
      
  
    })

  });
});


router.get("/v1/advancedUserSearch", function(req, res, next) {
  var lastNameRegx = req.query.q.lastname? "^" + req.query.q.lastname + ".*": ".*";
  var countryRegex = req.query.q.country ? "^" + req.query.q.country + ".*": ".*";
  var yearOfBirthRegex = req.query.q.yearOfBirth ? "\\b" + req.query.q.yearOfBirth + "\\b": ".*";

  User.find({
    $and: [
      { lastname: { $regex: new RegExp(lastNameRegx, 'i') } },
      { country: { $regex: new RegExp(countryRegex, 'i') } },
      { dob: { $regex: new RegExp(yearOfBirthRegex) } }
    ]
  }).exec((err, users) => {

    return res.send(users);
  });
});

router.get("/v1/advancedGroupSearch", function(req, res, next) {
  var descriptionRegex = req.query.q.description? "^" + req.query.q.description + ".*": ".*";
  

  let andTermsList = [];
  andTermsList.push({ description: { $regex: new RegExp(descriptionRegex, 'i') } });
  if (req.query.q.friendsNumber != "") {andTermsList.push({ friendsNumber: req.query.q.friendsNumber })};
  if(req.query.q.creationMonth != "") {andTermsList.push({$expr: {$eq: [{ $month: "$created_time" }, parseInt(req.query.q.creationMonth)]}})};
  Group.find({
    $and: andTermsList
  }).exec((err, groups) => {

    return res.send(groups);
  });
});

router.get("/v1/notifications", function(req, res, next) {
  User.findOne({ _id: req.session._id }).exec((err, userData) => {
    res.send(new String(userData.notifications.length));
  });
});

router.post("/v1/notifications/markAsRead", function(req, res, next) {
  User.findOne({ _id: req.session._id }).exec((err, userData) => {
    userData.notifications = [];
    userData.save((err, response) => {
      res.redirect("/me/activity");
    });
  });
});

module.exports = router;

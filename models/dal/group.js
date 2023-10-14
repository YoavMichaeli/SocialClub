// utils/handlers/user.js
var mongoose = require("mongoose");
var Group = require("../group");
const a = require("array-tools");
const _ = require("lodash/_arrayIncludes");

mongoose.connect(require("../../config/app").db.connectionUri, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

function checkSpace(name) {
  var charSplit = name.split("");
  //console.log(charSplit)
  return _(charSplit, " ");
}

function createNew(obj, cb) {
  if (checkSpace(obj.name)) {
    return cb(null, false);
  } else {
    Group.findOne({ name: obj.name }).exec((err, group) => {
      if (group) {
        return cb(null, false);
      } else {
        var newGroup = new Group({
          name: obj.name,
          description: obj.description,
          profile_pic: "/images/logo/logo.png",
          posts: [],
          followers: [],
          friendsNumber: 1,
          created_time: new Date()
        });
        newGroup.save((err, res) => {
          return cb(err, res);
        });
      }
    });
  }
}

function edit(obj, cb) {
  if (checkSpace(obj.name)) {
    return cb(null, false);
  } else {
    Group.findOne({ name: obj.oldGroupName }).exec((err, group) => {
      if (group) {
        if (obj.name) {
          group.name = obj.name;
        }
        if (obj.description) {
          group.description = obj.description;
        }
        group.save((err, res) => {
          return cb(err, res);
        });
        
      } else {
        return cb(null, false);
      }
    });
  }
}

/*****
usage:
	var opt = {
		username:'my_name',
		password:'P@sSW0rD'
	}
	checkUser(opt, (error, result) => {
		if (!result) return false;
		// Do something after log in...
	})
*****/

function findOne(obj, cb) {
  Group.findOne(obj).exec((err, group) => {
    if (err) return cb(err, false);
    if (group) {
      return cb(err, group);
    } else {
      return cb(null, false);
    }
  });
}


function findById(id, cb) {
  Group.findById(id).exec((err, group) => {
    if (err) return cb(err, false);
    if (group) {
      return cb(err, group);
    } else {
      return cb(null, false);
    }
  });
}

function asyncFindById(id) {
  return new Promise((resolve, reject) => {
    Group.findById(id).exec((err, group) => {
      if (err) {
        reject(err);
      } else {
        resolve(group)  
      }
    });
  });
  
}

function search(opt, cb) {
  Group.find({ name: { $gt: opt } }).exec((err, results) => {
    if (err) return cb(err, false);
    if (results) {
      return cb(err, results);
    } else {
      return cb(null, false);
    }
  });
}

/*****
usage:
   getAll((error, result) => {
        if (!result) return false;
        // Do something after...
    })
*****/

function getAll(cb) {
  Group.find({}).exec((err, groups) => {
    if (err) return cb(err, false);
    if (groups) {
      return cb(null, groups);
    } else {
      return cb(null, false);
    }
  });
}

function deleteOne(opt, cb) {
  //if(typeof opt !== Object) cb("Must be a javascript object.");
  Group.deleteOne(opt).exec((err, res) => {
    if (err) return cb(err, null);
    else if (res.n == 0) {
      return cb(null, true);
    }
  });
}
function comment(group, comment, _id, cb) {
  Group.findOne(group).exec((err, obj) => {
    if (!obj) return cb("Does not exist.", null);
    console.log(obj);
    for (var i = 0; i < obj.posts.length; i++) {
      if (obj.posts[i]._id == _id) {
        obj.posts[i].comments.push(comment);
        obj = new Group(obj);
        obj.save((err, res) => {
          return cb(err, res);
        });
      }
    }
  });
}

function like(group, like, _id, cb) {
  Group.findOne(group).exec((err, obj) => {
    if (!obj) return cb("Does not exist.", null);
    for (var i = 0; i < obj.posts.length; i++) {
      if (obj.posts[i]._id == _id) {
        obj.posts[i].likes.push(like.by);
        obj = new Group(obj);
        obj.save(err => {
          cb(err, true);
        });
      }
    }
  });
}

// Expose all the api...
module.exports = {
  createNew: createNew,
  edit: edit,
  findOne: findOne,
  deleteOne: deleteOne,
  findById: findById,
  asyncFindById: asyncFindById,
  getAll: getAll,
  comment: comment,
  like: like,
  search: search
};

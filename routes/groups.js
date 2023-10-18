var express = require("express");
var router = express.Router();
var {createNewGroup, editGroup, deleteGroup} = require("../controllers/groups");
var groupHandler = require("../models/dal/group");
var userHandler = require("../models/dal/user");
var formParser = require("../utils/form-parser");

router.get("/", function(req, res, next) {
    groupHandler.getAll(async (err, groups) => {
        const user = await userHandler.asyncFindById(req.session._id);
        if (err) {
            console.log(err);
        }
        res.render("me/groups", {
          title: req.app.conf.name,
          groups: groups,
          userGroupsAdmin: user.groupsAdmin
        });
      });
  });


  router.get("/new", function(req, res, next) {
        res.render("addGroup", {
          title: req.app.conf.name
        });
  });


router.get("/edit", function(req, res, next) {
    res.render("editGroup", {
      title: req.app.conf.name,
      oldGroupName: req.query.groupName
    });
});


router.delete("/:groupId", async function(req, res, next) {
    const groupIdToDelete = req.params.groupId;
    
    deleteGroup({_id: groupIdToDelete});

    const user = await userHandler.asyncFindById(req.session._id);
    await userHandler.getAll((err, users) => {


    for (let i =0 ; i< users.length; i++) {
        if (users[i].groups.includes(groupIdToDelete)) {
            newUserGroups = users[i].groups.filter(groupId => groupId !== groupIdToDelete);
            users[i].groups = newUserGroups;
            
        }
        if (users[i].groupsAdmin.includes(groupIdToDelete)) {
            newUserAdminGroups = users[i].groupsAdmin.filter(groupId => groupId !== groupIdToDelete);
            users[i].groupsAdmin = newUserAdminGroups;
            
        }

        users[i].save();
    }
});
 res.status(200).send("done");
});

router.get("/:groupname", function(req, res, next) {
    groupHandler.findOne({ name: req.params.groupname }, (err, group) => {
        userHandler.findById(req.session._id, (err, currentUser) => {
        if (!group) return res.status(404).send("No group found");
        res.render("entities/profiles/group", {
          title: req.app.conf.name,
          group: group,
          currentUser: currentUser,
          userId: req.session._id      
      });
      });
    });
  });
  
  
router.post("/new", formParser, function(req, res, next) {
    console.log(req.session);
    let result = createNewGroup(req.body, req.session.user); 
      if (result === null) {
        res.render("addGroup", {
          title: req.app.conf.name,
          error: "Bad group details."
        });
    }
    res.redirect("/groups")
  });


  router.post("/edit", formParser, function(req, res, next) {
    console.log(req.session);
    let result = editGroup(req.body); 
      if (result === null) {
        res.render("editGroup", {
          title: req.app.conf.name,
          error: "Bad group details."
        });
    }
    res.redirect("/groups")
  });


  module.exports = router;
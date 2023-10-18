const express = require("express")
const router = express.Router();
const groupHandler = require('../models/dal/group')
const userHandler = require('../models/dal/user')
const User = require('../models/user');


router.get('/groupsFriendsNumber', async (req,res)=>{
    const user =  await userHandler.asyncFindById(req.session._id);
    const groupPromises = user.groupsAdmin.map(async (groupId) => {
        const group = await groupHandler.asyncFindById(groupId);
        return group;
      });
    const groups = await Promise.all(groupPromises);
    res.json(groups);
});



router.get('/usersCountries', async (req,res)=>{

  let aggregateUsers = await User.aggregate([
    {
      $group: {
        _id : '$country',
        usersfromCountry: { $sum: 1 }
      }
    }
  ]).exec()


  res.json({aggregateUsers})

})


router.get('/', async (req,res)=>{

  res.render("../views/graph.ejs", {
    title: req.app.conf.name
  })
})




module.exports = router;
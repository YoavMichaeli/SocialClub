var express = require("express");
var router = express.Router();
var db = require("../models/dal/user");
var formParser = require("../utils/form-parser");

const { TwitterApi } = require('twitter-api-v2');
const T = new TwitterApi({
  appKey: process.env.CONSUMER_KEY,
  appSecret: process.env.CONSUMER_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.ACCESS_TOKEN_SECRET
});

/* GET signup page. */
router.get("/new", function(req, res, next) {
  res.render("auth/signup", {
    title: req.app.conf.name,
    error: false
  });
});

/* GET login page. */
router.get("/getin", function(req, res, next) {
  res.render("auth/login", {
    title: req.app.conf.name,
    error: false
  });
});

router.post("/new", formParser, function(req, res, next) {
  db.createNew(req.body, (error, result) => {
    if (!result) {
      res.render("auth/signup", {
        title: req.app.conf.name,
        error: "Bad user details."
      });
    } else {
      req.session._id = result._id;
      req.session.user = result.username;
      const tweetMessage = `${req.session.user} just signed up for SocialClub!`;
      T.v2.tweet(tweetMessage)
      .then(data => {
        console.log('Successfully tweeted:', data);
      })
      .catch(err => {
        console.error('Error tweeting:', err);
      });
      res.redirect(req.query.redirect_uri || "/");
    }
  });
});

router.post("/getin", formParser, function(req, res, next) {
  db.checkUser(req.body, (error, result) => {
    if (!result) {
      res.render("auth/login", {
        title: req.app.conf.name,
        error: "Bad username or password."
      });
    } else {
      req.session._id = result._id;
      req.session.user = result.username;
      result.lastLogin = new Date();
      result.save(() => {
        res.redirect(req.query.redirect_uri || "/");
      });
    }
  });
});

router.get("/out", function(req, res, next) {
  req.session.destroy(() => {
    res.redirect("/?action=logout");
  });
});

module.exports = router;
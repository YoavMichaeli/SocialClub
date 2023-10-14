
// load the things we need
var mongoose = require('mongoose');
// define the schema for our group model
var groupSchema = mongoose.Schema({
    name: String,
    description: String,
    created_time: Date,
    followers: [String],
    posts: Array, 
    friendsNumber: Number,
    profile_pic:String, 
});


module.exports = mongoose.model('Group', groupSchema);

// create the model for users and expose it to our app

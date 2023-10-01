// In this part of the code we route to the pages of the app

const express = require('express');
const path = require('path'); // Import the path module

const router = express.Router();
const Post = require('../models/post')

const app = express();

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended : true}))

app.use(express.static('public'));

router.get('', (req, res) => {
    // Use path.join to specify the correct file path
    res.sendFile(path.join(__dirname, '../../views/layouts/home.html'));
});


function insertPostData () {
    Post.create({
        author: {
            userId: "60e2a4a5a23c5c26a72d7606",
            username: "yaegli",
            avatarURL: "https://example.com/images/avatar2.jpg"
        },
        email: "yaegli@example.com",
        fullName: "Yael Levi",
        passwordHash: "bcrypthashvaluehere789101",
        content: "Hi There!",
        birthDate: "1989-04-05T00:00:00Z"
    }).then(post => {
        console.log('Post successfully created:', post);
    })
    .catch(err => {
        console.error('Error creating post:', err);
    });
}
insertPostData();

router.get('/about', (req, res) => {
    // Use path.join to specify the correct file path
    res.sendFile(path.join(__dirname, '../../views/layouts/index.html'));
});

// router.get('/home', (req, res) => {
//     // Use path.join to specify the correct file path
//     res.sendFile(path.join(__dirname, '../../views/layouts/home.html'));
// });


module.exports = router;

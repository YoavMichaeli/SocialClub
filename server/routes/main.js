// In this part of the code we route to the pages of the app

const express = require('express');
const path = require('path'); // Import the path module

const router = express.Router();
const app = express();

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended : true}))

app.use(express.static('public'));

router.get('', (req, res) => {
    // Use path.join to specify the correct file path
    res.sendFile(path.join(__dirname, '../../views/layouts/home.html'));
});


router.get('/about', (req, res) => {
    // Use path.join to specify the correct file path
    res.sendFile(path.join(__dirname, '../../views/layouts/index.html'));
});

// router.get('/home', (req, res) => {
//     // Use path.join to specify the correct file path
//     res.sendFile(path.join(__dirname, '../../views/layouts/home.html'));
// });

module.exports = router;

const express = require('express');
const path = require('path'); // Import the path module

const router = express.Router();
const app = express();

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended : true}))

app.use(express.static('public'));
app.use(express.static('../views'));

// Routes to the right page
router.get('', (req, res) => {
    // Use path.join to specify the correct file path
    res.sendFile(path.join(__dirname, '../../views/layouts/main.html'));
});


router.get('/about', (req, res) => {
    // Use path.join to specify the correct file path
    res.sendFile(path.join(__dirname, '../../views/index.html'));
});


module.exports = router;

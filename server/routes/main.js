const express = require('express');
const path = require('path'); // Import the path module

const router = express.Router();

// Routes to the right page
router.get('', (req, res) => {
    // Use path.join to specify the correct file path
    res.sendFile(path.join(__dirname, '../../views/layouts/main.html'));
});

module.exports = router;

const express = require('express');
const router = express.Router();

// Example
router.get('/', (req, res) => {
    res.send('Users list');
});

module.exports = router;

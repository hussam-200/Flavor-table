const express = require('express');
const path = require('path');
const router = express.Router();

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.get("/search", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/search.html'));
});

module.exports = router;
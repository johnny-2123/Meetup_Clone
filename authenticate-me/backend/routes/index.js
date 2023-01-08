const express = require('express');
const router = express.Router();

router.get('/hello/world', function (req, res) {
    res.cookie('XSRF', req.csrfToken());
    res.send('hello world');
});

module.exports = router;

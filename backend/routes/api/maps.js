const express = require('express');
const { googleMapsAPIKey } = require('../../config');

const router = express.Router()

router.post('/key', (req, res) => {
    res.json({ googleMapsAPIKey });
})

module.exports = router

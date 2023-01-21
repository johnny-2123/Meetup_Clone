const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
const { Event } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();

router.get(
    '/',
    async (req, res) => {
        const events = await Event.findAll();
        res.status(200).json(events);

    }
);


module.exports = router;

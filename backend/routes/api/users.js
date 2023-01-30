const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const groupmember = require('../../db/models/groupmember.js');

const validateSignup = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Please provide a valid email.'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage('Please provide a username with at least 4 characters.'),
    check('username')
        .not()
        .isEmail()
        .withMessage('Username cannot be an email.'),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be 6 characters or more.'),
    check('firstName')
        .exists({ checkFalsy: true })
        .isLength({ min: 1 })
        .withMessage('Please provide a username with at least 1 characters.'),
    check('lastName')
        .exists({ checkFalsy: true })
        .isLength({ min: 1 })
        .withMessage('Please provide a username with at least 1 characters.'),
    handleValidationErrors
];
const router = express.Router();

router.post(
    '/',
    validateSignup,
    async (req, res) => {
        const { email, firstName, lastName, password, username } = req.body;
        let existingUser;

        existingUser = await User.findOne({
            where: { email: email }
        });

        if (existingUser) {
            return res.status(400).json({
                "message": "User already exists",
                "statusCode": 403,
                "errors": [
                    "User with that email already exists"
                ]
            })
        }

        existingUser = await User.findOne({
            where: { username: username }
        });

        if (existingUser) {
            return res.status(400).json({
                "message": "User already exists",
                "statusCode": 403,
                "errors": [
                    "User with that username already exists"
                ]
            })
        };

        if (!email) {
            return res.status(400).json({
                "message": "Validation error",
                "statusCode": 400,
                "errors": [
                    "Invalid email"
                ]
            })
        };

        if (!firstName) {
            return res.status(400).json({
                "message": "Validation error",
                "statusCode": 400,
                "errors": [
                    "First Name is required "
                ]
            })
        };

        if (!lastName) {
            return res.status(400).json({
                "message": "Validation error",
                "statusCode": 400,
                "errors": [
                    "Last Name is required "
                ]
            })
        };

        const user = await User.signup({
            email, firstName, lastName, username, password
        });

        await setTokenCookie(res, user);

        return res.json(user);
    }
)



module.exports = router;

const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
const { Event, Venue, Attendant, sequelize, Group, EventImage, GroupMember } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require("sequelize");

const validateSignup = [
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ min: 5 })
        .withMessage('Name must be at least 5 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    handleValidationErrors
];

const router = express.Router();

router.post(
    '/:id/events',
    requireAuth,
    async (req, res) => {
        const { name, type, description, price, capacity, startDate, endDate, venueId } = req.body;
        let groupId = req.params.id;
        let group = await Group.findByPk(groupId);
        let user = req.user;

        if (!group) {
            return res.status(404).json(
                {
                    "message": "Group couldn't be found",
                    "statusCode": 404
                });
        }

        let groupMember = await GroupMember.findOne({
            where: {
                userId: user.id,
                groupId: group.id
            }
        });

        if (groupMember) {
            if (group.organizerId !== user.id && groupMember.status !== 'co-host') {
                return res.status(403).json({
                    "message": "Forbidden",
                    "statusCode": 403
                });
            }
        } else {
            if (group.organizerId !== user.id) {
                return res.status(403).json({
                    "message": "Forbidden",
                    "statusCode": 403
                });
            }

        }

        const venue = await Venue.findByPk(venueId);
        if (!venue) {
            return res.status(400).json({
                "message": "Validation error",
                "statusCode": 400,
                "errors": [
                    "Venue does not exist"
                ]
            })
        }

        if (name.length < 5) {
            return res.status(400).json({
                "message": "Validation error",
                "statusCode": 400,
                "errors": [
                    "Name must be at least 5 characters"
                ]
            })
        }


        if (type !== 'Online' && type !== 'In Person') {
            return res.status(400).json({
                "message": "Validation error",
                "statusCode": 400,
                "errors": [
                    "Type must be Online or In person"
                ]
            })
        }
        if (typeof (capacity) !== 'number') {
            return res.status(400).json({
                "message": "Validation error",
                "statusCode": 400,
                "errors": [
                    "Capacity must be an integer"
                ]
            })
        }

        if (typeof (price) !== 'number') {
            return res.status(400).json({
                "message": "Validation error",
                "statusCode": 400,
                "errors": [
                    "Price is invalid"
                ]
            })
        }

        if (!description) {
            return res.status(400).json({
                "message": "Validation error",
                "statusCode": 400,
                "errors": [
                    "Description is required"
                ]
            })
        }

        let startD = new Date(startDate);
        let isAfterToday = (input) => {
            return new Date(input).valueOf() > new Date().valueOf();
        }

        let isFuture = isAfterToday(startD);

        if (isFuture === false) {
            return res.status(400).json({
                "message": "Validation error",
                "statusCode": 400,
                "errors": [
                    "Start date must be in the future"
                ]
            })
        }

        let endD = new Date(endDate);
        let isAfterStart = startD < endD;


        if (!isAfterStart) {
            return res.status(400).json({
                "message": "Validation error",
                "statusCode": 400,
                "errors": [
                    "End date is less than start date"
                ]
            })
        }
        let event = await Event.create({
            name,
            type,
            description,
            price,
            capacity,
            startDate,
            endDate,
            venueId,
            groupId: group.id
        });
        let eventReturned = await Event.findByPk(event.id, {
            attributes: ['id', 'groupId', 'venueId', 'name', 'type', 'capacity', 'price', 'description', 'startDate', 'endDate']
        });
        return res.json(eventReturned)
    }
)

router.get(
    '/:id/events',
    async (req, res) => {
        let groupId = req.params.id;

        let group = await Group.findByPk(groupId);
        if (!group) {
            return res.status(404).json({
                "message": "Group couldn't be found",
                "statusCode": 404
            })
        }

        let events = await Event.findAll({
            where: {
                groupId: groupId
            },
            include: [{ model: Venue, attributes: ['id', 'city', 'state'] }, { model: Attendant, attributes: [] }, { model: Group, attributes: ['id', 'name', 'city', 'state'] }],
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('Attendants.id')), 'numAttending'],
                'id', 'groupId', 'venueId', 'name', 'type', 'startDate', 'previewImage'
            ],
            group: ['Attendants.eventId'],
        });
        return res.status(200).json(events);
    }
)




module.exports = router;

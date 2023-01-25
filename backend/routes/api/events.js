const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
const { Event, Venue, Attendant, sequelize, Group, EventImage, GroupMember } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require("sequelize");

const router = express.Router();


router.put(
    '/:id',
    requireAuth,
    async (req, res) => {
        let user = req.user;
        const id = req.params.id;
        const { name, type, description, price, capacity, startDate, endDate, venueId } = req.body;
        let event = await Event.findByPk(id);
        let group = await event.getGroup();
        console.log(`group.id: ${group.organizerId}`);
        console.log(`user.id: ${user.id}`);
        //returning wrong group member
        let groupMember = await GroupMember.findOne({
            where: {
                userId: user.id,
                groupId: group.id
            }
        });
        console.log(`memberstatus: ${groupMember.status}`);
        console.log(groupMember);
        if (event.name === null) {
            return res.status(403).json('could not find event with that id');
        }
        console.log(event.name);
        if (group.organizerId !== user.id && groupMember.status !== 'co-host') {
            return res.status(403).json({
                "message": "Forbidden",
                "statusCode": 403
            });
        }


        if (venueId) {
            const venue = await Venue.findByPk(venueId);
            if (venue.name === null) {
                return res.status(404).json('Venue does not exist');
            };

            event.venueId = venueId;
        }
        if (name) {
            if (name.length < 5) {
                res.status(400).json('Name must be at least 5 characters');
            }
            event.name = name;
        };
        if (type) {
            if (type != 'Online' || 'In Person') {
                res.status(400).json('Type must be Online or In person');
            }
            event.type = type;
        }

        if (description) {
            event.description = description;
        };
        if (price) {
            if (typeof (price) !== 'integer') {
                res.status(400).json('Price is invalid');
            }
            event.price = price;
        };
        if (capacity) {
            if (typeof (capacity) !== 'integer') {
                res.status(400).json('Capacity must be integer');
            }
            event.capacity = capacity;
        };

        await event.save();

        return res.json(event)
    }
)

router.get(
    '/:id',
    async (req, res) => {
        const id = req.params.id;
        const event = await Event.findByPk(id, {
            include: [
                {
                    model: Attendant, attributes: []
                },
                {
                    model: Venue, attributes: ['id', 'address', 'city', 'state', 'lat', 'lng']
                },
                {
                    model: Group, attributes: ['id', 'private', 'name', 'city', 'state']
                }
            ],
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('Attendants.id')), 'numAttending'],
                'id', 'groupId', 'venueId', 'name', 'type', 'description', 'capacity', 'price', 'startDate', 'endDate'
            ]
        });
        if (event.id === null) {

            return res.status(404).json(
                "Event couldn't be found"
            )
        }
        const group = await event.getGroup();
        const venue = await event.getVenue();
        const eventImages = await event.getEventImages({
            attributes: ['id', 'url', 'preview']
        });
        const attendants = await event.getAttendants({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'numAttending'],

            ]
        })
        // console.log(attendants)
        res.status(200).json({
            'event': event,
            'eventImages': eventImages,
            'numAttending': attendants.numAttending,
        });


    }
)

router.get(
    '/',
    async (req, res) => {
        const where = {}
        let { page, size, name, type, startDate } = req.query;
        page = parseInt(page);
        size = parseInt(size);

        if (!page) page = 1;

        if (Number.isNaN(page)) {
            res.status(400);
            return res.json({
                errors: [
                    { message: 'page number must be a valid integer' }
                ]
            });
        }


        if (page < 0) {
            page = 1;
        }


        if (!size) size = 4;
        if (Number.isNaN(size)) {
            res.status(400);
            return res.json({
                errors: [
                    { message: 'size number must be a valid integer' }
                ]
            });
        }
        if (size < 0) {
            size = 10;
        }
        if (type && typeof (type) !== 'string') {
            res.status(400);
            return res.json({
                errors: [
                    { message: 'type must be a string' }
                ]
            });
        }
        if (name && typeof (name) !== 'string') {
            res.status(400);
            return res.json({
                errors: [
                    { message: 'name must be a string' }
                ]
            });
        }
        if (startDate) {
            startDate = JSON.parse(startDate);
        }
        console.log(typeof (startDate));
        if (startDate && typeof (startDate) !== 'string') {
            res.status(400);
            return res.json({
                errors: [
                    { message: 'startDate must be a string' }
                ]
            });
        }
        if (name) {
            where.name = name;
        }

        if (type) {
            where.type = type;
        }
        if (startDate) {
            where.startDate = startDate;
            console.log(`startDate: ${startDate}`)
        }

        const events = await Event.findAll({
            include: [{ model: Venue, attributes: ['id', 'city', 'state'] }, { model: Attendant, attributes: [] }, { model: Group, attributes: ['id', 'name', 'city', 'state'] }],
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('Attendants.id')), 'numAttending'],
                'id', 'groupId', 'venueId', 'name', 'type', 'startDate', 'previewImage'
            ],
            group: ['Attendants.eventId'],
            where,
            // not returning all events when no page or size are set as queries
            // limit: size,
            // offset: size * (page - 1),

        });

        res.status(200).json({
            'Events': events,
            // 'page': page,
            // 'size': size
        });

    }
);


module.exports = router;

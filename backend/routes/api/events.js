const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
const { Event, Venue, Attendant, sequelize, Group, EventImage, GroupMember, User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require("sequelize");
const { ResultWithContext } = require('express-validator/src/chain/context-runner-impl.js');

const router = express.Router();


router.put(
    '/:id/attendance',
    requireAuth,
    async (req, res) => {
        let user = req.user;
        let eventId = req.params.id;
        let event = await Event.findByPk(eventId);
        let { userId, status } = req.body;

        if (!event) {
            return res.status(403).json({
                "message": "Event couldn't be found",
                "statusCode": 404
            });
        }

        let group = await event.getGroup();

        let groupMember = await GroupMember.findOne({
            where: {
                userId: user.id,
                groupId: group.id
            }
        });

        let attendance = await Attendant.findOne({
            where: {
                userId: userId,
                eventId: event.id
            }
        });

        if (!attendance) {
            return res.status(404).json({
                "message": "Attendance between the user and the event does not exist",
                "statusCode": 404
            });
        }

        if (status === 'pending') {
            return res.status(400).json({
                "message": "Cannot change an attendance status to pending",
                "statusCode": 400
            });
        }
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

        attendance.status = status;

        await attendance.save();
        let resAttendance = await attendance.findByPk(attendance.id);
        res.status(200).json(resAttendance)

    }
)

router.delete(
    '/:id/attendance',
    requireAuth,
    async (req, res) => {
        let user = req.user;
        let eventId = req.params.id;
        let userId = req.body.memberId;
        let event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(403).json({
                "message": "Event couldn't be found",
                "statusCode": 404
            });
        }
        let attendance = await Attendant.findOne({
            where: { eventId: eventId, userId: userId }
        });

        if (!attendance) {
            return res.status(404).json({
                "message": "Attendance does not exist for this User",
                "statusCode": 404
            })
        }

        let group = await event.getGroup();

        if (group.organizerId !== user.id && userId !== user.id) {
            return res.status(403).json({
                "message": "Only the User or organizer may delete an Attendance",
                "statusCode": 403
            })
        }

        await attendance.destroy();

        return res.status(200).json({
            "message": "Successfully deleted attendance from event"
        })

    }
)

router.get(
    '/:id/attendees',
    async (req, res) => {
        const eventid = req.params.id;
        const event = await Event.findByPk(eventid);
        if (!event) {
            return res.status(403).json({
                "message": "Event couldn't be found",
                "statusCode": 404
            });
        }

        let user = req.user;
        let group = await event.getGroup();

        let groupMember = await GroupMember.findOne({
            where: {
                userId: user.id,
                groupId: group.id
            }
        });
        //think data is returned in incorrect format
        if (groupMember) {
            if (group.organizerId !== user.id && groupMember.status !== 'co-host') {
                const attendees = await event.getAttendants({
                    where: {
                        status: { [Op.not]: 'pending' }
                    },
                    include: [{ model: User, attributes: ['id', 'firstName', 'lastName'] }],
                    attributes: ['status'],
                })

                return res.status(200).json(attendees);
            } else {
                const attendees = await event.getAttendants({
                    include: [{ model: User, attributes: ['id', 'firstName', 'lastName'] }],
                    attributes: ['status'],
                });

                return res.status(200).json(attendees);

            }
        } else {
            if (group.organizerId !== user.id) {
                const attendees = await event.getAttendants({
                    where: {
                        status: { [Op.not]: 'pending' }
                    },
                    include: [{ model: User, attributes: ['id', 'firstName', 'lastName'] }],
                    attributes: ['status'],
                })

                return res.status(200).json(attendees);
            } else {
                const attendees = await event.getAttendants({
                    include: [{ model: User, attributes: ['id', 'firstName', 'lastName'] }],
                    attributes: ['status'],
                });

                return res.status(200).json(attendees);
            }

        }



    }
)

router.post(
    '/:id/images',
    requireAuth,
    async (req, res) => {
        let user = req.user;
        let eventId = req.params.id;
        const { url, preview } = req.body;
        let event = await Event.findByPk(eventId);

        if (!event) {
            return res.status(403).json({
                "message": "Event couldn't be found",
                "statusCode": 404
            });
        }

        let attendee = await Attendant.findOne({
            where: {
                userId: user.id,
                eventId: event.id
            }
        });

        if (!attendee) {
            return res.status(403).json({
                "message": "Forbidden",
                "statusCode": 403
            });
        };

        let newImage = await EventImage.create({
            url,
            preview,
            eventId: event.id
        });

        let image = await EventImage.findByPk(newImage.id, {
            attributes: ['id', 'url', 'preview']
        });

        return res.status(200).json(image);
    }
)

router.put(
    '/:id',
    requireAuth,
    async (req, res) => {
        let user = req.user;
        const id = req.params.id;
        const { name, type, description, price, capacity, startDate, endDate, venueId } = req.body;
        let event = await Event.findByPk(id);
        let group = await event.getGroup();

        //returning wrong group member
        let groupMember = await GroupMember.findOne({
            where: {
                userId: user.id,
                groupId: group.id
            }
        });

        if (event.name === null) {
            return res.status(403).json({
                "message": "Event couldn't be found",
                "statusCode": 404
            });
        }
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
            if (type !== 'Online' && type !== 'In Person') {
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
                {
                    "message": "Event couldn't be found",
                    "statusCode": 404
                }
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

        res.status(200).json({
            'event': event,
            'eventImages': eventImages,
            'numAttending': attendants.numAttending,
        });


    }
)


router.delete(
    '/:id',
    requireAuth,
    async (req, res) => {
        let user = req.user;
        let eventId = req.params.id;
        let event = await Event.findByPk(eventId);

        if (!event) {
            return res.status(403).json({
                "message": "Event couldn't be found",
                "statusCode": 404
            });
        }

        let group = await event.getGroup();

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

        await event.destroy();

        return res.status(200).json({
            "message": "Successfully deleted"
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

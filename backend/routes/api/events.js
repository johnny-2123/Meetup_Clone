const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
const { Event, Venue, Attendant, sequelize, Group, EventImage, GroupMember, User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require("sequelize");
const { ResultWithContext } = require('express-validator/src/chain/context-runner-impl.js');

const router = express.Router();



router.post(
    '/:id/attendance',
    requireAuth,
    async (req, res) => {
        let user = req.user;
        let eventId = req.params.id;
        let event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({
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

        if (!groupMember) {
            return res.status(403).json({
                "message": "Forbidden",
                "statusCode": 403
            });
        };

        let attendance = await Attendant.findOne({
            where: {
                eventId: eventId,
                userId: user.id
            }
        });

        if (attendance && attendance.status === 'pending') {
            return res.status(404).json({
                "message": "Attendance has already been requested",
                "statusCode": 400
            });
        }

        if (attendance && attendance.status !== 'pending') {
            return res.status(404).json({
                "message": "User is already an attendee of the event",
                "statusCode": 400
            });
        };

        let newAttendant = await Attendant.create({
            userId: user.id,
            eventId: eventId,
            status: "pending"
        });
        let resAttendant = await Attendant.findByPk(newAttendant.id);
        return res.status(200).json(resAttendant);
    }
)

router.put(
    '/:id/attendance',
    requireAuth,
    async (req, res) => {
        let user = req.user;
        let eventId = req.params.id;
        let event = await Event.findByPk(eventId);
        let { userId, status } = req.body;

        if (!event) {
            return res.status(404).json({
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
        let resAttendance = await Attendant.findByPk(attendance.id);

        return res.status(200).json(resAttendance)

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
        if (group) {
            if (group.organizerId !== user.id && userId !== user.id) {
                return res.status(403).json({
                    "message": "Only the User or organizer may delete an Attendance",
                    "statusCode": 403
                })
            }
        } else {
            if (userId !== user.id) {
                return res.status(403).json({
                    "message": "Only the User or organizer may delete an Attendance",
                    "statusCode": 403
                })
            }


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

        let errors = [];

        if (!event) {
            errors.push("Event couldn't be found")
            return res.status(404).json({
                "errors": errors
            })
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
        let attendees;
        if (groupMember) {
            if (group.organizerId !== user.id && groupMember.status !== 'co-host') {
                attendees = await event.getAttendants({
                    where: {
                        status: { [Op.not]: 'pending' }
                    },
                    include: [{ model: User, attributes: ['id', 'firstName', 'lastName'] }],
                    attributes: ['status'],
                })

            } else {
                attendees = await event.getAttendants({
                    include: [{ model: User, attributes: ['id', 'firstName', 'lastName'] }],
                    attributes: ['status'],
                });


            }
        } else {
            if (group.organizerId !== user.id) {
                attendees = await event.getAttendants({
                    where: {
                        status: { [Op.not]: 'pending' }
                    },
                    include: [{ model: User, attributes: ['id', 'firstName', 'lastName'] }],
                    attributes: ['status'],
                })

            } else {
                attendees = await event.getAttendants({
                    include: [{ model: User, attributes: ['id', 'firstName', 'lastName'] }],
                    attributes: ['status'],
                });
            }

        }

        let resAttendees = [];

        for (let attendee of attendees) {
            let toPush = {};
            toPush.id = attendee.User.id;
            toPush.firstName = attendee.User.firstName;
            toPush.lastName = attendee.User.lastName;
            let attendance = {};
            attendance.status = attendee.status;
            toPush.Attendance = attendance;
            resAttendees.push(toPush);
        }
        let response = {};
        response.Attendees = resAttendees;
        return res.status(200).json(response);
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
            return res.status(404).json({
                "message": "Event couldn't be found",
                "statusCode": 404
            });
        }
        let group = await Group.findByPk(event.groupId);

        let attendee = await Attendant.findOne({
            where: {
                userId: user.id,
                eventId: event.id
            }
        });

        if (!attendee && user.id !== group.organizerId) {
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

        let errors = [];


        if (!event) {
            errors.push("Group couldn't be found")

            return res.status(404).json({
                "errors": errors
            })
        }

        let group = await event.getGroup();


        let groupMember = await GroupMember.findOne({
            where: {
                userId: user.id,
                groupId: group.id
            }
        });

        if (group?.organizerId !== user.id && groupMember?.status !== 'co-host') {
            errors.push("Forbidden")
            return res.status(403).json({
                "errors": errors
            })
        }


        if (venueId) {
            const venue = await Venue.findByPk(venueId);
            if (venue.name === null) {
                errors.push("Venue does not exist")
            };

            event.venueId = venueId;
        }
        if (name) {
            if (name.length < 5) {
                errors.push("Name must be at least 5 characters")
            }
            event.name = name;
        };
        if (type) {
            if (type !== 'Online' && type !== 'In Person') {
                errors.push("Type must be Online or In person")
            }
            event.type = type;
        }

        if (description) {
            if (description.length < 50) {
                errors.push("Description must be 50 characters or more")
            }
            event.description = description;
        };

        if (price) {
            if (typeof (price) !== 'number') {
                errors.push("Price is invalid")
            }
            event.price = price;
        };

        if (capacity) {
            if (typeof (capacity) !== 'number') {
                errors.push("Capacity must be integer")
            }
            event.capacity = capacity;
        };

        if (errors.length > 0) {
            return res.status(400).json({
                "errors": errors
            })
        }

        if (startDate) {
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
        }

        if (endDate) {
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

        }


        await event.save();
        let resEvent = await Event.findByPk(event.id, {
            attributes: ['id', 'groupId', 'venueId', 'name', 'type', 'description', 'capacity', 'price', 'startDate', 'endDate']
        })
        return res.json(resEvent)
    }
)

router.get(
    '/:id',
    async (req, res) => {
        const id = req.params.id;

        const event = await Event.findByPk(id, {
            include: [{ model: Venue, attributes: ['id', 'city', 'state', 'lat', 'lng'] }, { model: Group, attributes: ['id', 'name', 'city', 'state', 'organizerId', 'previewImage'] }, { model: EventImage, attributes: ['id', 'url', 'preview'] }],
            attributes: [
                'id', 'groupId', 'venueId', 'name', 'description', 'type', 'capacity', 'price', 'startDate', 'endDate', 'previewImage'
            ]
        });


        if (!event) {

            return res.status(404).json(
                {
                    "message": "Event couldn't be found",
                    "statusCode": 404
                }
            )
        }

        const user = await User.findByPk(event.Group.organizerId);

        let count = await Attendant.count({
            where: { eventId: event.id }
        });
        event.setDataValue('numAttending', count);
        event.setDataValue(`Organizer`, user);

        res.status(200).json(event);


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
        let { page, size, name, type, startDate, groupId } = req.query;
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

        if (!size) size = 25;
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
        if (groupId && typeof (groupId) === 'integer') {
            where.groupId = groupId;
        }



        const events2 = await Event.findAll({
            include: [{ model: Venue, attributes: ['id', 'city', 'state'] }, { model: Group, attributes: ['id', 'name', 'city', 'state'] }],
            attributes: [
                'id', 'groupId', 'venueId', 'name', 'type', 'startDate', 'previewImage', 'description'
            ],
            where,
            // not returning all events when no page or size are set as queries
            limit: size,
            offset: size * (page - 1),

        });

        let eventsArr = [];
        for (let event of events2) {
            let count = await Attendant.count({
                where: { eventId: event.id }
            });
            event.setDataValue('numAttending', count);
        }


        res.status(200).json({
            'Events': events2,
            'page': page,
            'size': size
        });

    }
);


module.exports = router;

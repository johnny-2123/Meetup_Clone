const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
const { Event, Venue, Attendant, sequelize, Group, EventImage, GroupMember, User, Sequelize, GroupImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require("sequelize");
const group = require('../../db/models/group.js');

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


router.get(
    '/:id/members',
    async (req, res) => {
        let groupId = req.params.id;
        let group = await Group.findByPk(groupId);

        if (!group) {
            return res.status(403).json({
                "message": "Group couldn't be found",
                "statusCode": 404
            });
        };
        let user = req.user;
        let groupMember = await GroupMember.findOne({
            where: {
                userId: user.id,
                groupId: group.id
            }
        });

        let groupMembers = [];
        let users;
        if (groupMember) {
            if (group.organizerId !== user.id && groupMember.status !== 'co-host') {
                users = await group.getUsers({
                    attributes: {
                        include: [[Sequelize.literal(`(SELECT GroupMembers.status FROM GroupMembers JOIN Users ON (GroupMembers.UserId = Users.id) WHERE GroupMembers.groupId = ${group.id})`), 'status']]
                    }
                })
            } else {
                users = await group.getUsers({
                    attributes: {
                        include: [[Sequelize.literal(`(SELECT GroupMembers.status AS status FROM GroupMembers JOIN Users ON (GroupMembers.UserId = Users.id) WHERE GroupMembers.groupId = ${group.id})`), 'status'], 'id']
                    },

                })

            }
        } else {
            if (group.organizerId !== user.id) {
                users = await group.getUsers({
                    attributes: {
                        include: [[Sequelize.literal(`(SELECT GroupMembers.status FROM GroupMembers JOIN Users ON (GroupMembers.UserId = Users.id) WHERE GroupMembers.groupId = ${group.id})`), 'status']]
                    }
                })

            } else {
                users = await group.getUsers({
                    attributes: {
                        include: [[Sequelize.literal(`(SELECT GroupMembers.status FROM GroupMembers JOIN Users ON (GroupMembers.UserId = Users.id) WHERE GroupMembers.groupId = ${group.id})`), 'status']],
                    }
                })

            }

        }
        users.forEach(obj => {
            let userPush = {};
            userPush.id = obj.id;
            userPush.firstName = obj.firstName;
            userPush.lastName = obj.lastName;
            let membership = {};
            console.log(obj.GroupMember.status)
            membership.status = obj.GroupMember.status;
            userPush.membership = membership;

            groupMembers.push(userPush)
        });

        return res.status(200).json(groupMembers);
    }
)


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
    '/current',
    requireAuth,
    async (req, res) => {
        let currentUser = await User.findByPk(req.user.id);
        let groupsOrganized = await currentUser.getGroups();
        let groupsJoined = await Group.findAll({
            include: [
                { model: User, as: User.tableName, attributes: [] }
            ],
            where: {
                '$Users.id$': `${currentUser.id}`
            },
            attributes: ['id', 'organizerId', 'name', 'about', 'type', 'private', 'city', 'state', 'createdAt', 'updatedAt', 'previewImage'],
            nest: true
        })
        let groupsJoinedArr = []
        for (let groupJoined of groupsJoined) {
            let count = await GroupMember.count({
                where: { groupId: groupJoined.id }
            });
            let toPush = {}
            toPush.id = groupJoined.id;
            toPush.organizerId = groupJoined.organizerId;
            toPush.name = groupJoined.name;
            toPush.type = groupJoined.type;
            toPush.private = groupJoined.private;
            toPush.city = groupJoined.state;
            toPush.state = groupJoined.state;
            toPush.about = groupJoined.about;
            toPush.previewImage = groupJoined.previewImage;
            toPush.createdAt = groupJoined.createdAt;
            toPush.updatedAt = groupJoined.updatedAt;
            toPush.numMembers = count;
            groupsJoinedArr.push(toPush);
        }
        let groupsOrganizedArr = [];
        for (let groupOrganized of groupsOrganized) {
            let count = await GroupMember.count({
                where: { groupId: groupOrganized.id }
            });
            let toPush = {}
            toPush.id = groupOrganized.id;
            toPush.organizerId = groupOrganized.organizerId;
            toPush.name = groupOrganized.name;
            toPush.type = groupOrganized.type;
            toPush.private = groupOrganized.private;
            toPush.city = groupOrganized.state;
            toPush.state = groupOrganized.state;
            toPush.about = groupOrganized.about;
            toPush.previewImage = groupOrganized.previewImage;
            toPush.createdAt = groupOrganized.createdAt;
            toPush.updatedAt = groupOrganized.updatedAt;
            toPush.numMembers = count;
            groupsOrganizedArr.push(toPush);
        }
        for (item of groupsOrganizedArr) {
            if (groupsJoinedArr.filter(idx => idx.id === item.id).length === 0) {
                groupsJoinedArr.push(item)
            }
        }
        return res.status(200).json(groupsJoinedArr);
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


router.get(
    '/:id',
    async (req, res) => {
        let groupId = req.params.id;
        let group = await Group.findByPk(groupId, {
            include: [
                {
                    model: GroupImage, attributes: ['id', 'url', 'preview']
                },
                { model: User, as: 'Organizer', attributes: ['id', 'firstName', 'lastName'] },
                { model: Venue, attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng'] },
                { model: User, as: 'members', attributes: [] },
            ],
            attributes: [
                'id', 'organizerId', 'name', 'about', 'type', 'private', 'city', 'state', 'createdAt', 'updatedAt',
            ],
        });
        if (!group) {
            return res.status(404).json({
                "message": "Group couldn't be found",
                "statusCode": 404
            });
        };
        let count = await GroupMember.count({
            where: { groupId: groupId }
        });
        group.setDataValue('numMembers', count);
        return res.status(200).json(group);
    }
)

module.exports = router;

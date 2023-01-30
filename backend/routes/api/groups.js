const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
const { Event, Venue, Attendant, sequelize, Group, EventImage, GroupMember, User, Sequelize, GroupImage } = require('../../db/models');
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



router.get(
    '/current',
    requireAuth,
    async (req, res) => {
        let currentUser = await User.findByPk(req.user.id);
        let groupsOrganized = await currentUser.getGroupsOrganized();
        // console.log(groupsOrganized)
        // let groupsJoined = await Group.findAll({
        //     include: [
        //         { model: User, as: User.tableName, attributes: [] }
        //     ],
        //     where: {
        //         '$Users.id$': `${currentUser.id}`
        //     },
        //     attributes: ['id', 'organizerId', 'name', 'about', 'type', 'private', 'city', 'state', 'createdAt', 'updatedAt', 'previewImage'],
        //     nest: true
        // })
        let groupsJoined = await currentUser.getUserGroup();
        console.log(groupsJoined);
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
            if (groupsJoinedArr.filter(idx => idx.id === item.id).length !== -1) {
                groupsJoinedArr.push(item)
            }
        }
        let resGroups = {};
        resGroups.Groups = groupsJoinedArr;
        return res.status(200).json(resGroups);
    }
)

/////////////////////
///////////////Create a new Venue for a Group specified by its id

router.post(
    '/:id/venues',
    requireAuth,
    async (req, res) => {
        let groupId = req.params.id;
        let user = req.user;
        let group = await Group.findByPk(groupId);
        let { address, city, state, lat, lng } = req.body;



        if (!group) {
            return res.status(404).json({
                "message": "Group couldn't be found",
                "statusCode": 404
            });

        }
        let groupMember = await GroupMember.findOne({
            where: {
                groupId: group.id,
                userId: user.id
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



        if (!address) {
            return res.status(400).json('Street address is required')

        }
        if (!city) {
            return res.status(400).json('City is required')

        }
        if (!state) {
            return res.status(400).json('State is required')

        }
        if (!lat) {
            return res.status(400).json('Latitude is required')

        }
        if (!lng) {
            return res.status(400).json('Longitude is required')

        }

        let newVenue = await Venue.create({
            address,
            city,
            state,
            lat,
            lng,
            groupId: group.id
        });


        let venue = await Venue.findByPk(newVenue.id);

        res.status(200).json(venue);

    }


)

/////////
///////////### Get All Venues for a Group specified by its id


router.get(
    '/:id/venues',
    requireAuth,
    async (req, res) => {
        let groupId = req.params.id;
        let user = req.user;

        let group = await Group.findByPk(groupId);

        if (!group) {
            return res.status(404).json({
                "message": "Group couldn't be found",
                "statusCode": 404
            });
        };

        let groupMember = await GroupMember.findOne({
            where: {
                userId: user.id,
                groupId: group.id
            }
        });

        console.log(groupMember)
        console.log(group.organizerId);
        console.log(user.id)
        if (groupMember) {
            if (group.organizerId !== parseInt(user.id) && groupMember.status !== 'co-host') {
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

        let venues = await Venue.findAll({
            where: { groupId: group.id }
        });
        let resVenues = {};
        resVenues.Venues = venues
        return res.status(200).json(resVenues)

    }

)

router.delete(
    '/:id/membership',
    requireAuth,
    async (req, res) => {
        let groupId = req.params.id;
        let memberId = req.body.memberId;
        let user = req.user;

        let group = await Group.findByPk(groupId);

        if (!group) {
            return res.status(404).json({
                "message": "Group couldn't be found",
                "statusCode": 404
            });
        };
        let member = await User.findByPk(memberId);

        if (!member) {
            return res.status(404).json({
                "message": "Validation Error",
                "statusCode": 400,
                "errors": {
                    "memberId": "User couldn't be found"
                }
            });

        };

        if (group.organizerId !== user.id && memberId !== user.id) {
            return res.status(403).json({
                "message": "Forbidden",
                "statusCode": 403
            });

        }

        let groupMember = await GroupMember.findOne({
            where: {
                userId: memberId,
                groupId: group.id
            }
        });

        if (!groupMember) {
            return res.status(404).json({
                "message": "Membership does not exist for this User",
                "statusCode": 404
            });
        };


        await groupMember.destroy();

        return res.status(200).json({
            "message": "Successfully deleted membership from group"
        });



    }


)

/////// edit a membership status
router.put(
    '/:id/membership',
    requireAuth,
    async (req, res) => {
        let groupId = req.params.id;
        let group = await Group.findByPk(groupId);
        let user = req.user;
        let userId = user.id;
        let { memberId } = req.body;
        let { status } = req.body;

        let member = await User.findByPk(memberId);

        if (!group) {
            return res.status(404).json({
                "message": "Group couldn't be found",
                "statusCode": 404
            });
        };

        if (!member) {
            return res.status(404).json({
                "message": "User couldn't be found",
                "statusCode": 404
            });

        }
        let groupMember = await GroupMember.findOne({
            where: {
                groupId: group.id,
                userId: memberId
            }
        });
        let currentMember = await GroupMember.findOne({
            where: { groupId: group.id, userId: user.id }
        });

        if (!groupMember) {
            return res.status(404).json({
                "message": "Membership between the user and the group does not exits",
                "statusCode": 404
            });

        }

        if (status === 'pending') {
            return res.status(400).json({
                "message": "Validations Error",
                "statusCode": 400,
                "errors": {
                    "status": "Cannot change a membership status to pending"
                }
            });
        };


        if (groupMember) {
            if (group.organizerId !== user.id && currentMember.status !== 'co-host') {
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

        if (status === 'member') {
            if (groupMember) {
                if (group.organizerId !== user.id && currentMember.status !== 'co-host') {
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
        }

        if (status === 'co-host') {
            if (group.organizerId !== user.id) {
                return res.status(403).json({
                    "message": "Forbidden",
                    "statusCode": 403
                });
            }
        }

        groupMember.status = status;

        await groupMember.save();

        let resMember = {};

        resMember.memberId = groupMember.userId;
        resMember.groupId = groupMember.groupId;
        resMember.status = groupMember.status;
        return res.status(200).json(resMember);

    }

)

///////////////////////////
//////////////////////// Request a Membership for a Group based on the Group's id
router.post(
    '/:id/membership',
    requireAuth,
    async (req, res) => {
        let groupId = req.params.id;
        let group = await Group.findByPk(groupId);
        let user = req.user;
        let userId = user.id;

        if (!group) {
            return res.status(403).json({
                "message": "Group couldn't be found",
                "statusCode": 404
            });
        };

        let groupMember = await GroupMember.findOne({
            where: {
                groupId: group.id,
                userId: user.id
            }
        });

        if (groupMember) {
            if (groupMember.status === 'pending') {
                return res.status(400).json({
                    "message": "Membership has already been requested",
                    "statusCode": 400
                });
            } else {
                return res.status(400).json({
                    "message": "User is already a member of the group",
                    "statusCode": 400
                });

            }
        }

        let newMembership = await GroupMember.create({
            groupId: group.id,
            userId: user.id,
            status: 'pending'
        });

        let membership = await GroupMember.findOne({
            where: {
                groupId: newMembership.groupId,
                userId: newMembership.userId
            }
        });

        let resMember = {}
        console.log(newMembership);
        console.log(membership);
        resMember.groupId = membership.groupId;
        resMember.memberId = membership.userId;
        resMember.status = membership.status;
        res.status(400).json(resMember);

    }

)

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
        let groupMember;
        if (user) {
            groupMember = await GroupMember.findOne({
                where: {
                    userId: user.id,
                    groupId: group.id
                }
            });
        }
        let groupMembers = [];
        let members;
        // if (groupMember) {
        //     if (group.organizerId !== user.id && groupMember.status !== 'co-host') {
        //         users = await group.getMembers({
        //             attributes: {
        //                 include: [[Sequelize.literal(`(SELECT GroupMembers.status FROM GroupMembers JOIN Users ON (GroupMembers.UserId = Users.id) WHERE GroupMembers.groupId = ${group.id})`), 'status']]
        //             }
        //         })
        //     } else {
        //         users = await group.getMembers({
        //             attributes: {
        //                 include: [[Sequelize.literal(`(SELECT GroupMembers.status AS status FROM GroupMembers JOIN Users ON (GroupMembers.UserId = Users.id) WHERE GroupMembers.groupId = ${group.id})`), 'status'], 'id']
        //             },

        //         })

        //     }
        // } else {
        //     if (group.organizerId !== user.id) {
        //         users = await group.getMembers({
        //             attributes: {
        //                 include: [[Sequelize.literal(`(SELECT GroupMembers.status FROM GroupMembers JOIN Users ON (GroupMembers.UserId = Users.id) WHERE GroupMembers.groupId = ${group.id})`), 'status']]
        //             }
        //         })

        //     } else {
        //         users = await group.getMembers({
        //             attributes: {
        //                 include: [[Sequelize.literal(`(SELECT GroupMembers.status FROM GroupMembers JOIN Users ON (GroupMembers.UserId = Users.id) WHERE GroupMembers.groupId = ${group.id})`), 'status']],
        //             }
        //         })

        //     }

        // }

        if (groupMember) {
            if (group.organizerId !== user.id && groupMember.status !== 'co-host') {
                members = await GroupMember.findAll({
                    where: { groupId: group.id, status: { [Op.ne]: 'pending' } }
                });
            } else {
                members = await GroupMember.findAll({
                    where: { groupId: group.id }
                });

            }
        } else {
            if (group.organizerId !== user.id) {
                members = await GroupMember.findAll({
                    where: { groupId: group.id, status: { [Op.ne]: 'pending' } }
                });
            } else {
                members = await GroupMember.findAll({
                    where: { groupId: group.id }
                });

            }

        }
        for (let member of members) {
            let user = await User.findByPk(member.userId);
            member.setDataValue('user', user)
            let toPush = {};
            toPush.id = user.id;
            toPush.firstName = user.firstName;
            toPush.lastName = user.lastName;
            let membership = {};
            membership.status = member.status;
            toPush.Membership = membership;
            groupMembers.push(toPush);
        }


        // users.forEach(obj => {
        //     let userPush = {};
        //     userPush.id = obj.id;
        //     userPush.firstName = obj.firstName;
        //     userPush.lastName = obj.lastName;
        //     let membership = {};
        //     console.log(obj.GroupMember.status)
        //     membership.status = obj.GroupMember.status;
        //     userPush.membership = membership;

        //     groupMembers.push(userPush)
        // });
        let resMembers = {};
        resMembers.Members = groupMembers
        return res.status(200).json(resMembers);
    }
)


//add an image to a group based on the groups id
router.post(
    '/:id/images',
    requireAuth,
    async (req, res) => {
        let user = req.user;
        let groupId = req.params.id;
        const { url, preview } = req.body;

        let group = await Group.findByPk(groupId);

        if (!group) {

            if (!group) {
                return res.status(403).json({
                    "message": "Group couldn't be found",
                    "statusCode": 403
                });
            }

        }

        if (group.organizerId !== user.id) {
            return res.status(403).json({
                "message": "Forbidden",
                "statusCode": 403
            });
        }

        let newImage = await GroupImage.create({
            url,
            preview,
            groupId: group.id
        });


        let image = await GroupImage.findByPk(newImage.id);
        return res.status(200).json(image);



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

        // let events = await Event.findAll({
        //     where: {
        //         groupId: groupId
        //     },
        //     include: [{ model: Venue, attributes: ['id', 'city', 'state'] }, { model: Attendant, attributes: [] }, { model: Group, attributes: ['id', 'name', 'city', 'state'] }],
        //     attributes: [
        //         [sequelize.fn('COUNT', sequelize.col('Attendants.id')), 'numAttending'],
        //         'id', 'groupId', 'venueId', 'name', 'type', 'startDate', 'previewImage'
        //     ],
        //     group: ['Attendants.eventId'],
        // });

        let events = await Event.findAll({
            where: {
                groupId: groupId
            },
            include: [{ model: Venue, attributes: ['id', 'city', 'state'] }, { model: Group, attributes: ['id', 'name', 'city', 'state'] }],
            attributes: [
                'id', 'groupId', 'venueId', 'name', 'type', 'startDate', 'previewImage'
            ]
        });

        for (let event of events) {
            let count = await Attendant.count({
                where: { eventId: event.id }
            });
            event.setDataValue('numAttending', count);

        }
        let resEvents = {};
        resEvents.Events = events;
        return res.status(200).json(resEvents);
    }
)


router.delete(
    '/:id',
    requireAuth,
    async (req, res) => {
        let user = req.user;
        let groupId = req.params.id;
        let group = await Group.findByPk(groupId);

        if (!group) {
            return res.status(403).json({
                "message": "Group couldn't be found",
                "statusCode": 404
            });
        }

        if (group.organizerId !== user.id) {
            return res.status(403).json({
                "message": "Forbidden",
                "statusCode": 403
            });
        }

        await group.destroy()


        return res.status(200).json({
            "message": "Successfully deleted"
        });
    }

)


router.put(
    '/:id',
    requireAuth,
    async (req, res) => {
        let groupId = req.params.id;
        let user = req.user;
        const { name, about, type, private, city, state } = req.body;
        let group = await Group.findByPk(groupId);

        if (!group) {
            return res.status(404).json({
                "message": "Group couldn't be found",
                "statusCode": 404
            });
        };

        if (group.organizerId !== user.id) {
            return res.status(403).json({
                "message": "Forbidden",
                "statusCode": 403
            });
        };

        if (name) {
            if (name.length > 60) {
                return res.status(400).json('Name must be 60 characters or less');
            }
            group.name = name;
        };

        if (about) {
            if (about.length < 50) {
                return res.status(400).json('About must be 50 characters or more');
            }
            group.about = about;
        };

        if (type) {
            if (type !== 'Online' && type !== 'In person') {
                return res.status(400).json('Type must be Online or In person');
            }
            group.type = type;
        };

        if (private) {
            if (private !== true && private !== false) {
                return res.status(400).json('Private must be a boolean');
            }
            group.private = private;
        };

        if (!city) {
            return res.status(400).json('City is required');
        };
        group.city = city;

        if (!state) {
            return res.status(400).json('State is required');
        };
        group.state = state;

        await group.save();

        let resGroup = await Group.findByPk(group.id, {
            attributes: ['id', 'organizerId', 'name', 'about', 'type', 'private', 'city', 'state', 'createdAt', 'updatedAt']
        })

        return res.json(resGroup);

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



router.post(
    '/',
    requireAuth,
    async (req, res) => {
        const { name, about, type, private, city, state } = req.body;
        let user = req.user;

        if (name) {
            if (name.length > 60) {
                return res.status(400).json('Name must be 60 characters or less');
            }
        };

        if (about) {
            if (about.length < 50) {
                return res.status(400).json('About must be 50 characters or more');
            }
        };

        if (type) {
            if (type !== 'Online' && type !== 'In person') {
                return res.status(400).json('Type must be Online or In person');
            }
        };

        if (private) {
            if (private !== true && private !== false) {
                return res.status(400).json('Private must be a boolean');
            }
        };

        if (!city) {
            return res.status(400).json('City is required');
        };

        if (!state) {
            return res.status(400).json('State is required');
        };

        let newGroup = await Group.create({
            name,
            about,
            type,
            private,
            city,
            state,
            organizerId: user.id
        });

        let group = await Group.scope('createdGroup').findByPk(newGroup.id);

        return res.status(200).json(group);

    }

)




router.get(
    '/',
    async (req, res) => {
        let groups = await Group.findAll();


        for (let group of groups) {
            let count = await GroupMember.count({
                where: { groupId: group.id }
            });
            group.setDataValue('numMembers', count);

        }
        let resGroups = {};
        resGroups.Groups = groups;
        return res.status(200).json(resGroups);
    }
)

module.exports = router;

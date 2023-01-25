const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
const { Event, Venue, Attendant, sequelize, Group, EventImage, GroupMember } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require("sequelize");

const router = express.Router();


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

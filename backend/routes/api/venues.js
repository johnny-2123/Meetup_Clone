const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
const { Event, Venue, Attendant, sequelize, Group, EventImage, GroupMember, User, Sequelize, GroupImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require("sequelize");


const router = express.Router();

router.put(
    '/:id',
    requireAuth,
    async (req, res) => {
        let venueId = req.params.id;
        let user = req.user;
        let { address, city, state, lat, lng } = req.body;

        let venue = await Venue.findByPk(venueId);

        if (!venue) {
            return res.status(404).json({
                "message": "Venue couldn't be found",
                "statusCode": 404
            });

        }

        let groupId = venue.groupId;

        let group = await Group.findByPk(groupId);



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

        };


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

        venue.address = address;
        venue.city = city;
        venue.state = state;
        venue.lat = lat;
        venue.lng = lng;

        await venue.save();
        let resVenue = await Venue.findByPk(venue.id, {
            attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
        })
        return res.status(200).json(venue);


    }

)





module.exports = router;

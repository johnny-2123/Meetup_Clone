const express = require('express');
const { setTokenCookie, requireAuth } = require('../../utils/auth.js');
const { Event, Venue, Attendant, sequelize, Group, EventImage, GroupMember } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require("sequelize");

const router = express.Router();

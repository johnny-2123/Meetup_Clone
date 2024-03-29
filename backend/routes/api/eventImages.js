const express = require("express");
const { setTokenCookie, requireAuth } = require("../../utils/auth.js");
const {
  User,
  Group,
  Event,
  EventImage,
  GroupMember,
} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

router.delete("/:id", requireAuth, async (req, res) => {
  let imageId = req.params.id;
  let user = req.user;
  let eventImage = await EventImage.findByPk(req.params.id);
  if (!eventImage) {
    return res.status(404).json({
      message: "Event Image couldn't be found",
      statusCode: 404,
    });
  }

  let event = await Event.findByPk(eventImage.eventId);
  let group = await Group.findByPk(event.groupId);
  let groupMember = await GroupMember.findOne({
    where: {
      userId: user.id,
      groupId: group.id,
    },
  });

  if (groupMember) {
    if (group.organizerId !== user.id && groupMember.status !== "co-host") {
      return res.status(403).json({
        message: "Forbidden",
        statusCode: 403,
      });
    }
  } else {
    if (group.organizerId !== user.id) {
      return res.status(403).json({
        message: "Forbidden",
        statusCode: 403,
      });
    }
  }

  await eventImage.destroy();

  return res.status(200).json({
    deletedEvent: eventImage,
    message: "Successfully deleted",
  });
});

module.exports = router;

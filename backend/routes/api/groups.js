const express = require("express");
const { setTokenCookie, requireAuth } = require("../../utils/auth.js");
const {
  Event,
  Venue,
  Attendant,
  sequelize,
  Group,
  EventImage,
  GroupMember,
  User,
  Sequelize,
  GroupImage,
} = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { Op } = require("sequelize");

const validateSignup = [
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  handleValidationErrors,
];

const router = express.Router();

router.get("/current", requireAuth, async (req, res) => {
  try {
    const currentUser = await User.findByPk(req.user.id);
    const [groupsOrganized, groupsJoined] = await Promise.all([
      currentUser.getGroupsOrganized(),
      currentUser.getUserGroup(),
    ]);

    const groupsJoinedArr = await Promise.all(
      groupsJoined.map(async (groupJoined) => {
        const count = await GroupMember.count({
          where: { groupId: groupJoined.id },
        });
        const groupMember = await GroupMember.findOne({
          where: { userId: currentUser.id, groupId: groupJoined.id },
        });
        return {
          id: groupJoined.id,
          organizerId: groupJoined.organizerId,
          name: groupJoined.name,
          type: groupJoined.type,
          private: groupJoined.private,
          city: groupJoined.city,
          state: groupJoined.state,
          about: groupJoined.about,
          previewImage: groupJoined.previewImage,
          createdAt: groupJoined.createdAt,
          updatedAt: groupJoined.updatedAt,
          numMembers: count,
          currentUserGroupStatus: groupMember.status,
        };
      })
    );

    const groupsOrganizedArr = await Promise.all(
      groupsOrganized.map(async (groupOrganized) => {
        const count = await GroupMember.count({
          where: { groupId: groupOrganized.id },
        });
        return {
          id: groupOrganized.id,
          organizerId: groupOrganized.organizerId,
          name: groupOrganized.name,
          type: groupOrganized.type,
          private: groupOrganized.private,
          city: groupOrganized.city,
          state: groupOrganized.state,
          about: groupOrganized.about,
          previewImage: groupOrganized.previewImage,
          createdAt: groupOrganized.createdAt,
          updatedAt: groupOrganized.updatedAt,
          numMembers: count,
        };
      })
    );

    const mergedGroupsArr = groupsOrganizedArr.concat(
      groupsJoinedArr.filter((groupJoined) => {
        return !groupsOrganizedArr.some((groupOrganized) => {
          return groupOrganized.id === groupJoined.id;
        });
      })
    );

    const resGroups = { Groups: mergedGroupsArr };
    return res.status(200).json(resGroups);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

/////////////////////
///////////////Create a new Venue for a Group specified by its id

router.post("/:id/venues", requireAuth, async (req, res) => {
  let groupId = req.params.id;
  let user = req.user;
  let group = await Group.findByPk(groupId);
  let { address, city, state, lat, lng } = req.body;

  if (!group) {
    return res.status(404).json({
      message: "Group couldn't be found",
      statusCode: 404,
    });
  }
  let groupMember = await GroupMember.findOne({
    where: {
      groupId: group.id,
      userId: user.id,
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

  if (!address) {
    return res.status(400).json("Street address is required");
  }
  if (!city) {
    return res.status(400).json("City is required");
  }
  if (!state) {
    return res.status(400).json("State is required");
  }
  if (!lat) {
    return res.status(400).json("Latitude is required");
  }
  if (!lng) {
    return res.status(400).json("Longitude is required");
  }

  let newVenue = await Venue.create({
    address,
    city,
    state,
    lat,
    lng,
    groupId: group.id,
  });

  let venue = await Venue.findByPk(newVenue.id);

  res.status(200).json(venue);
});

/////////
///////////### Get All Venues for a Group specified by its id

router.get("/:id/venues", requireAuth, async (req, res) => {
  let groupId = req.params.id;
  let user = req.user;

  let group = await Group.findByPk(groupId);

  if (!group) {
    return res.status(404).json({
      message: "Group couldn't be found",
      statusCode: 404,
    });
  }

  let groupMember = await GroupMember.findOne({
    where: {
      userId: user.id,
      groupId: group.id,
    },
  });

  if (groupMember) {
    if (
      group.organizerId !== parseInt(user.id) &&
      groupMember.status !== "co-host"
    ) {
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

  let venues = await Venue.findAll({
    where: { groupId: group.id },
  });
  let resVenues = {};
  resVenues.Venues = venues;
  return res.status(200).json(resVenues);
});

router.delete("/:id/membership", requireAuth, async (req, res) => {
  let groupId = req.params.id;
  let memberId = req.body.memberId;
  let user = req.user;

  let group = await Group.findByPk(groupId);

  let errors = [];

  if (!group) {
    errors.push("Group couldn't be found");

    return res.status(404).json({
      errors: errors,
    });
  }
  let member = await User.findByPk(memberId);

  if (!member) {
    errors.push("User couldn't be found");

    return res.status(404).json({
      errors: errors,
    });
  }

  if (group.organizerId !== user.id && memberId !== user.id) {
    errors.push("Forbidden");

    return res.status(404).json({
      errors: errors,
    });
  }

  let groupMember = await GroupMember.findOne({
    where: {
      userId: memberId,
      groupId: group.id,
    },
  });

  if (!groupMember) {
    errors.push("Membership does not exist for this User");

    return res.status(404).json({
      errors: errors,
    });
  }

  await groupMember.destroy();

  return res.status(200).json({
    message: "Successfully deleted membership from group",
  });
});

/////// edit a membership status
router.put("/:id/membership", requireAuth, async (req, res) => {
  let groupId = req.params.id;
  let group = await Group.findByPk(groupId);
  let user = req.user;
  let userId = user.id;
  let { memberId } = req.body;
  let { status } = req.body;

  let member = await User.findByPk(memberId);

  let errors = [];

  if (!group) {
    errors.push("Group couldn't be found");
    return res.status(404).json({
      errors: errors,
    });
  }

  if (!member) {
    errors.push("User couldn't be found");
    return res.status(404).json({
      errors: errors,
    });
  }
  let groupMember = await GroupMember.findOne({
    where: {
      groupId: group.id,
      userId: memberId,
    },
  });
  let currentMember = await GroupMember.findOne({
    where: { groupId: group.id, userId: user.id },
  });

  if (!groupMember) {
    errors.push("Membership between the user and the group does not exits");
    return res.status(404).json({
      errors: errors,
    });
  }

  if (status === "pending") {
    errors.push("Cannot change a membership status to pending");
    return res.status(404).json({
      errors: errors,
    });
  }

  ///////////////////might need to edit the groupMember below to currentMember
  if (groupMember) {
    if (group.organizerId !== user.id && currentMember.status !== "co-host") {
      errors.push("Forbidden");
      return res.status(403).json({
        errors: errors,
      });
    }
  } else {
    if (group.organizerId !== user.id) {
      errors.push("Forbidden");
      return res.status(403).json({
        errors: errors,
      });
    }
  }

  if (status === "active") {
    if (groupMember) {
      if (group.organizerId !== user.id && currentMember.status !== "co-host") {
        errors.push("Forbidden");
        return res.status(403).json({
          errors: errors,
        });
      }
    } else {
      if (group.organizerId !== user.id) {
        errors.push("Forbidden");
        return res.status(403).json({
          errors: errors,
        });
      }
    }
  }

  if (status === "co-host") {
    if (group.organizerId !== user.id) {
      errors.push("Forbidden");
      return res.status(403).json({
        errors: errors,
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
});

///////////////////////////
//////////////////////// Request a Membership for a Group based on the Group's id
router.post("/:id/membership", requireAuth, async (req, res) => {
  let groupId = req.params.id;
  let group = await Group.findByPk(groupId);
  let user = req.user;
  let userId = user.id;

  let errors = [];

  if (!group) {
    errors.push("Group couldn't be found");

    return res.status(404).json({
      errors: errors,
    });
  }

  let groupMember = await GroupMember.findOne({
    where: {
      groupId: group?.id,
      userId: user?.id,
    },
  });

  if (groupMember) {
    if (groupMember.status === "pending") {
      errors.push("Membership already requested");
      return res.status(404).json({
        errors: errors,
      });
    } else {
      errors.push("User is already a member of the group");
      return res.status(404).json({
        errors: errors,
      });
    }
  }

  let newMembership = await GroupMember.create({
    groupId: group.id,
    userId: user.id,
    status: "pending",
  });

  let membership = await GroupMember.findOne({
    where: {
      groupId: newMembership.groupId,
      userId: newMembership.userId,
    },
  });

  let resMember = {};

  resMember.groupId = membership.groupId;
  resMember.memberId = membership.userId;
  resMember.status = membership.status;
  res.status(200).json(resMember);
});

router.get("/:id/members", async (req, res) => {
  let groupId = req.params.id;
  let group = await Group.findByPk(groupId);

  let errors = [];

  if (!group) {
    errors.push("Group couldn't be found");
    return res.status(404).json({
      errors: errors,
    });
  }
  let user = req.user;
  let groupMember;
  if (user) {
    groupMember = await GroupMember.findOne({
      where: {
        userId: user.id,
        groupId: group.id,
      },
    });
  }
  let groupMembers = [];
  let members;

  if (groupMember) {
    if (group.organizerId !== user.id && groupMember.status !== "co-host") {
      members = await GroupMember.findAll({
        where: { groupId: group.id, status: { [Op.ne]: "pending" } },
      });
    } else {
      members = await GroupMember.findAll({
        where: { groupId: group.id },
      });
    }
  } else {
    if (group.organizerId !== user.id) {
      members = await GroupMember.findAll({
        where: { groupId: group.id, status: { [Op.ne]: "pending" } },
      });
    } else {
      members = await GroupMember.findAll({
        where: { groupId: group.id },
      });
    }
  }
  for (let member of members) {
    let user = await User.findByPk(member.userId);
    member.setDataValue("user", user);
    let toPush = {};
    toPush.id = user.id;
    toPush.firstName = user.firstName;
    toPush.lastName = user.lastName;
    let membership = {};
    membership.status = member.status;
    toPush.Membership = membership;
    groupMembers.push(toPush);
  }

  let resMembers = {};
  resMembers.Members = groupMembers;
  return res.status(200).json(resMembers);
});

//add an image to a group based on the groups id
router.post("/:id/images", requireAuth, async (req, res) => {
  let user = req.user;
  let groupId = req.params.id;
  const { url, preview } = req.body;

  let group = await Group.findByPk(groupId);

  if (!group) {
    if (!group) {
      return res.status(403).json({
        message: "Group couldn't be found",
        statusCode: 403,
      });
    }
  }

  if (group.organizerId !== user.id) {
    return res.status(403).json({
      message: "Forbidden",
      statusCode: 403,
    });
  }

  let newImage = await GroupImage.create({
    url,
    preview,
    groupId: group.id,
  });

  let image = await GroupImage.findByPk(newImage.id);
  return res.status(200).json(image);
});

router.post("/:id/events", requireAuth, async (req, res) => {
  let {
    name,
    type,
    description,
    price,
    capacity,
    startDate,
    endDate,
    venueId,
    previewImage,
  } = req.body;
  price = parseInt(price);
  capacity = parseInt(capacity);
  let groupId = req.params.id;
  let group = await Group.findByPk(groupId);
  let user = req.user;

  let errors = [];

  if (!group) {
    return res.status(404).json({
      message: "Group couldn't be found",
      statusCode: 404,
    });
  }

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

  if (venueId) {
    const venue = await Venue.findByPk(venueId);
    if (!venue) {
      errors.push("Venue does not exist");
    }
  }

  if (name.length < 5) {
    errors.push("Name must be at least 5 characters");
  }

  if (type !== "Online" && type !== "In Person") {
    errors.push("Type must be Online or In person");
  }
  if (typeof capacity !== "number") {
    errors.push("Capacity must be an integer");
  }

  if (typeof price !== "number") {
    errors.push("Price must be a number greater than 0");
  }

  if (!description) {
    errors.push("Description is required");
  }

  if (description) {
    if (description.length < 30) {
      errors.push("Description must be greater than 30 characters");
    }
  }

  let startD = new Date(startDate);
  let isAfterToday = (input) => {
    return new Date(input).valueOf() > new Date().valueOf();
  };

  let isFuture = isAfterToday(startD);

  if (isFuture === false) {
    errors.push("Start date must be in the future");
  }

  let endD = new Date(endDate);
  let isAfterStart = startD < endD;

  if (!isAfterStart) {
    errors.push("End date is less than start date");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      errors: errors,
    });
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
    groupId: group.id,
    previewImage,
  });
  let eventReturned = await Event.findByPk(event.id, {
    attributes: [
      "id",
      "groupId",
      "venueId",
      "name",
      "type",
      "capacity",
      "price",
      "description",
      "startDate",
      "endDate",
      "previewImage",
    ],
  });

  return res.json(eventReturned);
});

router.get("/:id/events", async (req, res) => {
  let groupId = req.params.id;

  let group = await Group.findByPk(groupId);
  if (!group) {
    return res.status(404).json({
      message: "Group couldn't be found",
      statusCode: 404,
    });
  }

  let events = await Event.findAll({
    where: {
      groupId: groupId,
    },
    include: [
      { model: Venue, attributes: ["id", "city", "state"] },
      { model: Group, attributes: ["id", "name", "city", "state"] },
    ],
    attributes: [
      "id",
      "groupId",
      "venueId",
      "name",
      "type",
      "startDate",
      "previewImage",
      "description",
    ],
  });

  for (let event of events) {
    let count = await Attendant.count({
      where: { eventId: event.id },
    });
    event.setDataValue("numAttending", count);
  }
  let resEvents = {};
  resEvents.Events = events;
  return res.status(200).json(resEvents);
});

router.delete("/:id", requireAuth, async (req, res) => {
  let user = req.user;
  let groupId = req.params.id;
  let group = await Group.findByPk(groupId);

  if (!group) {
    return res.status(403).json({
      message: "Group couldn't be found",
      statusCode: 404,
    });
  }

  if (group.organizerId !== user.id) {
    return res.status(403).json({
      message: "Forbidden",
      statusCode: 403,
    });
  }

  await group.destroy();
  await Event.destroy({
    where: { groupId: groupId },
  });

  return res.status(200).json({
    message: "Successfully deleted",
  });
});

router.put("/:id", requireAuth, async (req, res) => {
  let groupId = req.params.id;
  let user = req.user;
  const { name, about, type, private, city, state, previewImage } = req.body;
  let group = await Group.findByPk(groupId);

  let errors = [];

  if (!group) {
    errors.push("Group couldn't be found");
  }

  if (group.organizerId !== user.id) {
    errors.push("Forbidden");
  }

  if (name) {
    if (name.length > 60) {
      errors.push("Name must be 60 characters or less");
    }
    if (name.length < 5) {
      errors.push("Name must be at least 5 characters");
    }
    group.name = name;
  }

  if (about) {
    if (about.length < 50) {
      errors.push("About must be 50 characters or more");
    }
    group.about = about;
  }

  if (type) {
    if (type !== "Online" && type !== "In person") {
      errors.push("Type must be Online or In person");
    }
    group.type = type;
  }

  if (private) {
    if (private !== true && private !== false) {
      errors.push("Private must be a boolean");
    }
    group.private = private;
  }

  if (!city) {
    errors.push("City is required");
  }
  group.city = city;

  if (!state) {
    errors.push("State is required");
  }
  group.state = state;

  if (previewImage) {
    let validFormats = [".jpg", ".jpeg", "png"];
    let validImage = validFormats.some((element) =>
      previewImage.endsWith(element)
    );

    if (validImage) {
      group.previewImage = previewImage;
    } else {
      errors.push(`image url must end with .jpg .jpeg or .png`);
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      errors: errors,
    });
  }

  await group.save();

  let resGroup = await Group.findByPk(group.id, {
    attributes: [
      "id",
      "organizerId",
      "name",
      "about",
      "type",
      "private",
      "city",
      "state",
      "createdAt",
      "updatedAt",
    ],
  });
  return res.json(resGroup);
});

router.get("/:id", async (req, res) => {
  let groupId = req.params.id;
  let group = await Group.findByPk(groupId, {
    include: [
      {
        model: GroupImage,
        attributes: ["id", "url", "preview"],
      },
      {
        model: User,
        as: "Organizer",
        attributes: ["id", "firstName", "lastName", "username"],
      },
      {
        model: Venue,
        attributes: ["id", "groupId", "address", "city", "state", "lat", "lng"],
      },
      { model: User, as: "members", attributes: [] },
    ],
    attributes: [
      "id",
      "organizerId",
      "name",
      "about",
      "type",
      "private",
      "city",
      "state",
      "createdAt",
      "updatedAt",
      "previewImage",
    ],
  });
  if (!group) {
    return res.status(404).json({
      message: "Group couldn't be found",
      statusCode: 404,
    });
  }
  let count = await GroupMember.count({
    where: { groupId: groupId },
  });
  group.setDataValue("numMembers", count);

  return res.status(200).json(group);
});

router.post("/", requireAuth, async (req, res) => {
  let { name, about, type, private, city, state, previewImage } = req.body;
  let user = req.user;

  let errors = [];
  if (name) {
    if (name.length > 60) {
      errors.push("Name must be 60 characters or less");
    }
    if (name.length < 5) {
      errors.push("Name must be at least 5 characters");
    }
  }

  if (about) {
    if (about.length < 50) {
      errors.push("About must be 50 characters or more");
    }
  }

  if (type) {
    if (type !== "Online" && type !== "In person") {
      errors.push("Type must be Online or In person");
    }
  }

  if (private) {
    if (private === "true") {
      private = true;
    }
    if (private === "false") {
      private = false;
    }
    if (private !== true && private !== false) {
      errors.push("Private must be a boolean");
    }
  }

  if (!city) {
    errors.push("City is required");
  }

  if (!state) {
    errors.push("State is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      errors: errors,
    });
  }

  let newGroup = await Group.create({
    name,
    about,
    type,
    private,
    city,
    state,
    organizerId: user.id,
    previewImage,
  });

  let group = await Group.scope("createdGroup").findByPk(newGroup.id);

  return res.status(200).json(group);
});

router.get("/", async (req, res) => {
  let groups = await Group.findAll();

  for (let group of groups) {
    let count = await GroupMember.count({
      where: { groupId: group.id },
    });
    group.setDataValue("numMembers", count);
  }

  for (let group of groups) {
    let count = await Event.count({
      where: { groupId: group.id },
    });
    group.setDataValue("numEvents", count);
  }

  let resGroups = {};
  resGroups.Groups = groups;
  return res.status(200).json(resGroups);
});

module.exports = router;

'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const { Event, User, Attendant } = require('../models');
const eventAttendants = [
  {
    eventName: 'Met Gala',
    attendants: [
      { username: "Demo-lition", status: 'going' },
      { username: "FakeUser1", status: 'going' },
      { username: "FakeUser3", status: 'going' },
      { username: "FakeUser2", status: 'going' },
    ]
  },
  {
    eventName: 'Tennis Singles',
    attendants: [
      { username: "Demo-lition", status: 'going' },
      { username: "FakeUser3", status: 'going' },
      { username: "FakeUser2", status: 'going' },
    ]
  },
  {
    eventName: 'Movie Night',
    attendants: [
      { username: "Demo-lition", status: 'going' },
      { username: "FakeUser1", status: 'going' },
      { username: "FakeUser3", status: 'going' },
    ]
  },
  {
    eventName: 'Trivia',
    attendants: [
      { username: "Demo-lition", status: 'going' },
      { username: "FakeUser2", status: 'going' },
    ]
  }
];

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    for (let obj of eventAttendants) {
      const event = await Event.findOne({ where: { name: obj.eventName } });

      for (let attendant of obj.attendants) {
        const user = await User.findOne({ where: { username: attendant.username } });
        const status = attendant.status;
        await Attendant.create({
          eventId: event.id,
          userId: user.id,
          status: status,
        });
      }
    }

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    for (let obj of eventAttendants) {
      const event = await Event.findOne({ where: { name: obj.eventName } });

      for (let attendant of obj.attendants) {
        const user = await User.findOne({ where: { username: attendant.username } });
        console.log(`user.id: ${user.id}`)
        let testAttendants = await event.getAttendants();
        console.log(`testAttendants: ${testAttendants}`);
        // await event.removeAttendant({
        //   where: { userId: parseInt(user.id) }
        // });

        await Attendant.destroy({
          where: { eventId: event.id, userId: parseInt(user.id) }
        });
      }
    }
  }
};

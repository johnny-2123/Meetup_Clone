'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Event } = require('../models');

const events = [
  {
    groupId: 1,
    venueId: 1,
    name: 'Met Gala',
    type: 'In Person',
    startDate: '2021-11-19 20:00:00',
    endDate: '2021-11-20 20:00:00',
    previewImage: 'image url'
  },
  {
    groupId: 2,
    venueId: 2,
    name: 'Tennis Singles',
    type: 'In Person',
    startDate: '2021-12-19 20:00:00',
    endDate: '2021-12-20 20:00:00',
    previewImage: 'image url'
  },
  {
    groupId: 3,
    venueId: 3,
    name: 'Movie Night',
    type: 'Online',
    startDate: '2021-8-19 20:00:00',
    endDate: '2021-8-20 20:00:00',
    previewImage: 'image url'
  },
  {
    groupId: 4,
    venueId: 4,
    name: 'Trivia',
    type: 'Online',
    startDate: '2022-8-19 20:00:00',
    endDate: '2022-8-20 20:00:00',
    previewImage: 'image url'
  }
]
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
    await Event.bulkCreate(events, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Events', {
      where: { name: events.map(event => event.name) }
    }, {});

  }
};

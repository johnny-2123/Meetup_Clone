'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const { Event, User, Attendant } = require('../models');


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
    options.tableName = 'Attendants';
    await queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        userId: 1,
        status: 'going'
      },
      {
        eventId: 1,
        userId: 2,
        status: 'going'
      },
      {
        eventId: 1,
        userId: 3,
        status: 'pending'
      },
      {
        eventId: 1,
        userId: 4,
        status: 'pending'
      },
      {
        eventId: 2,
        userId: 1,
        status: 'going'
      },
      {
        eventId: 2,
        userId: 3,
        status: 'going'
      },
      {
        eventId: 2,
        userId: 4,
        status: 'going'
      },
      {
        eventId: 3,
        userId: 1,
        status: 'going'
      },
      {
        eventId: 3,
        userId: 2,
        status: 'going'
      },
      {
        eventId: 3,
        userId: 3,
        status: 'going'
      },
      {
        eventId: 3,
        userId: 4,
        status: 'going'
      },
      {
        eventId: 4,
        userId: 3,
        status: 'going'
      },
      {
        eventId: 4,
        userId: 4,
        status: 'going'
      }
    ], {});

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Attendants';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      eventId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};

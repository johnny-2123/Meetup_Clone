'use strict';
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

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
    options.tableName = 'Events';
    await queryInterface.bulkInsert(options, [
      {
        name: 'Met Gala',
        type: 'In Person',
        groupId: 1,
        venueId: 1,
        startDate: '2021-11-19 20:00:00',
        endDate: '2021-11-20 20:00:00',
        previewImage: 'image url'
      },
      {
        name: 'Tennis Singles',
        type: 'In Person',
        groupId: 2,
        venueId: 2,
        startDate: '2021-12-19 20:00:00',
        endDate: '2021-12-20 20:00:00',
        previewImage: 'image url'
      },
      {
        name: 'Movie Night',
        type: 'Online',
        groupId: 3,
        venueId: 3,
        startDate: '2021-8-19 20:00:00',
        endDate: '2021-8-20 20:00:00',
        previewImage: 'image url'
      },
      {
        name: 'Trivia',
        type: 'Online',
        groupId: 4,
        venueId: 4,
        startDate: '2022-8-19 20:00:00',
        endDate: '2022-8-20 20:00:00',
        previewImage: 'image url'
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
    options.tableName = 'Events';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Met Gala', 'In Person', 'Movie Night', 'Trivia'] }
    }, {});
  }
};

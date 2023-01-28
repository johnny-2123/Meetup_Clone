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
    options.tableName = 'EventImages';
    await queryInterface.bulkInsert(options, [
      {
        eventId: 1,
        url: 'imageUrl',
        preview: true
      },
      {
        eventId: 1,
        url: 'imageUrl2',
        preview: true
      },
      {
        eventId: 2,
        url: 'imageUrl',
        preview: true
      },
      {
        eventId: 2,
        url: 'imageUrl2',
        preview: true
      },
      {
        eventId: 3,
        url: 'imageUrl',
        preview: true
      },
      {
        eventId: 3,
        url: 'imageUrl2',
        preview: true
      },
      {
        eventId: 4,
        url: 'imageUrl',
        preview: true
      },
      {
        eventId: 4,
        url: 'imageUrl2',
        preview: true
      },
    ], {});

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'EventImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ['imageUrl', 'imageUrl2'] }
    }, {});
  }
};

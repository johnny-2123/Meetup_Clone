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
    options.tableName = 'Venues';
    await queryInterface.bulkInsert(options, [
      {
        address: '123 Disney Lane',
        city: 'Chicago',
        state: 'Illinois',
        lat: 37.7645358,
        lng: -122.4730327,
        groupId: 1
      },
      {
        address: '123 14 st',
        city: 'Miami',
        state: 'Florida',
        lat: 37.7645358,
        lng: -122.4730327,
        groupId: 2
      },
      {
        address: '123 15 st',
        city: 'New York',
        state: 'New York',
        lat: 37.7645358,
        lng: -122.4730327,
        groupId: 3
      },
      {
        address: '123 16 st',
        city: 'Washington',
        state: 'DC',
        lat: 37.7645358,
        lng: -122.4730327,
        groupId: 4
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
    options.tableName = 'Venues';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      address: { [Op.in]: ['123 Disney Lane', '123 14 st', '123 15 st', '123 16 st'] }
    }, {});
  }
};

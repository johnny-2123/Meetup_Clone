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
    await queryInterface.bulkInsert(options, [
      {
        groupId: 1,
        userId: 1,
        status: 'active'
      },
      {
        groupId: 1,
        userId: 2,
        status: 'co-host'
      },
      {
        groupId: 1,
        userId: 3,
        status: 'active'
      },
      {
        groupId: 1,
        userId: 4,
        status: 'active'
      },
      {
        groupId: 2,
        userId: 4,
        status: 'active'
      }, {
        groupId: 2,
        userId: 2,
        status: 'co-host'
      },
      {
        groupId: 3,
        userId: 3,
        status: 'active'
      },
      {
        groupId: 3,
        userId: 1,
        status: 'active'
      },
      {
        groupId: 3,
        userId: 4,
        status: 'active'
      }, {
        groupId: 3,
        userId: 2,
        status: 'co-host'
      },
      {
        groupId: 4,
        userId: 1,
        status: 'active'
      },
      {
        groupId: 4,
        userId: 4,
        status: 'active'
      }, {
        groupId: 4,
        userId: 2,
        status: 'co-host'
      }], {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'GroupMembers';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      groupId: { [Op.in]: [1, 2, 3, 4] }
    }, {});
  }
};

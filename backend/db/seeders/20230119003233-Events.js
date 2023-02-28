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
        description: 'Costume Party',
        price: 11,
        capacity: 100,
        groupId: 1,
        venueId: 1,
        startDate: '2021-11-19 20:00:00',
        endDate: '2021-11-20 20:00:00',
        previewImage: 'image url'
      },
      {
        name: 'Tennis Singles',
        type: 'In Person',
        description: 'Sporting Event',
        price: 5,
        capacity: 40,
        groupId: 2,
        venueId: 2,
        startDate: '2021-12-19 20:00:00',
        endDate: '2021-12-20 20:00:00',
        previewImage: 'image url'
      },
      {
        name: 'Movie Night',
        type: 'Online',
        description: 'Watch a movie',
        price: 7,
        capacity: 55,
        groupId: 3,
        venueId: 3,
        startDate: '2021-8-19 20:00:00',
        endDate: '2021-8-20 20:00:00',
        previewImage: 'image url'
      },
      {
        name: 'Trivia',
        type: 'Online',
        description: 'test your trivia knowledge',
        price: 0,
        capacity: 50,
        groupId: 4,
        venueId: 4,
        startDate: '2022-8-19 20:00:00',
        endDate: '2022-8-20 20:00:00',
        previewImage: 'image url'
      },
      {
        name: 'Fortnite Tournament',
        type: 'Online',
        description: 'battle royale competition',
        price: 0,
        capacity: 50,
        groupId: 1,
        venueId: 1,
        startDate: '2023-8-19 20:00:00',
        endDate: '2023-8-20 20:00:00',
        previewImage: 'image url'
      },
      {
        name: 'Hoops and Mimosas',
        type: 'In Person',
        description: 'Non-competitive way to socialize and exercise',
        price: 0,
        capacity: 50,
        groupId: 2,
        venueId: 1,
        startDate: '2023-8-19 20:00:00',
        endDate: '2023-8-20 20:00:00',
        previewImage: 'image url'
      },
      {
        name: 'Chess Tournament',
        type: 'In Person',
        description: 'Competition with $500 prize for the winner',
        price: 5,
        capacity: 50,
        groupId: 3,
        venueId: 1,
        startDate: '2023-8-19 20:00:00',
        endDate: '2023-8-20 20:00:00',
        previewImage: 'image url'
      },
      {
        name: 'Fundraiser Night',
        type: 'In Person',
        description: 'Best Poker Face wins $1000 for a charity of their choice',
        price: 100,
        capacity: 50,
        groupId: 4,
        venueId: 1,
        startDate: '2023-8-19 20:00:00',
        endDate: '2023-8-20 20:00:00',
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
      name: { [Op.in]: ['Met Gala', 'In Person', 'Movie Night', 'Trivia', 'Fortnite Tournament', 'Hoops and Mimosas', 'Chess Tournament', 'Fundraiser Night'] }
    }, {});
  }
};

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
        name: 'Fifa Tournament',
        type: 'Online',
        description: 'Test your video game skills at this tournament and make friends in the process',
        price: 100,
        capacity: 0,
        groupId: 1,
        venueId: 2,
        startDate: '2023-4-19 20:00:00',
        endDate: '2023-4-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649384/photo-1518091043644-c1d4457512c6_cnl44x.jpg'
      }, {
        name: 'Fortnite Tournament',
        type: 'Online',
        description: 'battle royale competition',
        price: 0,
        capacity: 50,
        groupId: 1,
        venueId: 1,
        startDate: '2023-8-19 20:00:00',
        endDate: '2023-8-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649308/photo-1589241062272-c0a000072dfa_cc6ruv.jpg'
      }, {
        name: 'Met Gala Night',
        type: 'In Person',
        description: 'Costume Party with your favorite people. Wear your best outfits and bring your best dance moves.',
        price: 11,
        capacity: 100,
        groupId: 1,
        venueId: 1,
        startDate: '2021-11-19 20:00:00',
        endDate: '2021-11-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649103/GettyImages-1340149063-scaled_g6gri7.jpg'
      },
      {
        name: 'Tennis Singles',
        type: 'In Person',
        description: 'Take a break from our usual basketball games at this sporting event',
        price: 5,
        capacity: 40,
        groupId: 2,
        venueId: 2,
        startDate: '2021-12-19 20:00:00',
        endDate: '2021-12-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649178/btxtohrerroggpurj4lm.jpg'
      },
      {
        name: 'Movie Night',
        type: 'Online',
        description: `Watch a movie based on the book of the month. Everyone is welcome, even if you haven't read the book yet (but careful for spoilers).`,
        price: 7,
        capacity: 55,
        groupId: 6,
        venueId: 3,
        startDate: '2021-8-19 20:00:00',
        endDate: '2021-8-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649250/photo-1585647347483-22b66260dfff_mfbyyn.jpg'
      },
      {
        name: 'Trivia',
        type: 'Online',
        description: 'test your trivia knowledge with us',
        price: 0,
        capacity: 50,
        groupId: 6,
        venueId: 4,
        startDate: '2022-8-19 20:00:00',
        endDate: '2022-8-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649281/photo-1652077859695-de2851a95620_lxepr0.jpg'
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
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649334/photo-1555766720-1e727844cc8f_hgelas.jpg'
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
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649354/photo-1604948501466-4e9c339b9c24_zdwozt.jpg'
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
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649369/premium_photo-1671683370315-87306b0faf90_azbek0.jpg'
      },

      {
        name: 'The Last of Us Watch Party',
        type: 'Online',
        description: 'Watch the hit hbo series inspired by the legendary video game with us',
        price: 0,
        capacity: 50,
        groupId: 1,
        venueId: 2,
        startDate: '2023-5-19 20:00:00',
        endDate: '2023-5-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649407/photo-1535016120720-40c646be5580_wjgvcp.jpg'
      },
      {
        name: 'Bulls Game trip',
        type: 'In Person',
        description: 'Watch the Chicago Bulls with other fans. Everyone welcome',
        price: 0,
        capacity: 100,
        groupId: 2,
        venueId: 2,
        startDate: '2022-5-19 20:00:00',
        endDate: '2022-5-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649459/photo-1620588212046-66bc57e70eeb_occccd.jpg'
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
      name: { [Op.in]: ['Met Gala Night', 'Tennis Singles', 'Movie Night', 'Trivia', 'Fortnite Tournament', 'Hoops and Mimosas', 'Chess Tournament', 'Fundraiser Night', 'Fifa Tournament', 'The Last of Us Watch Party'] }
    }, {});
  }
};

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
        name: 'Smash Bros Tournament',
        type: 'Online',
        description: 'Test your video game skills at this tournament and make friends in the process',
        price: 10,
        capacity: 20,
        groupId: 1,
        venueId: 2,
        startDate: '2023-6-19 20:00:00',
        endDate: '2023-6-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677817589/wii.jpg_ucinfp.jpg'
      },
      {
        name: 'Fifa Tournament',
        type: 'Online',
        description: 'Test your video game skills at this tournament and make friends in the process',
        price: 10,
        capacity: 20,
        groupId: 1,
        venueId: 2,
        startDate: '2023-4-19 20:00:00',
        endDate: '2023-4-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649384/photo-1518091043644-c1d4457512c6_cnl44x.jpg'
      }, {
        name: 'Fifa Tournament 2',
        type: 'Online',
        description: 'Test your video game skills at this tournament and make friends in the process',
        price: 10,
        capacity: 20,
        groupId: 1,
        venueId: 2,
        startDate: '2023-3-25 20:00:00',
        endDate: '2023-3-26 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649384/photo-1518091043644-c1d4457512c6_cnl44x.jpg'
      }, {
        name: 'Fortnite Tournament',
        type: 'Online',
        description: 'Battle royale competition open to all members, old and new. Bring your competetive spirit.',
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
        description: 'Costume Party with your favorite people. Wear your flashiest outfits inspired by your favorite characters and bring your best dance moves.',
        price: 100,
        capacity: 100,
        groupId: 1,
        venueId: 1,
        startDate: '2021-11-19 20:00:00',
        endDate: '2021-11-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649103/GettyImages-1340149063-scaled_g6gri7.jpg'
      },
      {
        name: 'The Last of Us Watch Party',
        type: 'Online',
        description: 'Watch the hit hbo series inspired by the legendary video game with us. We will have snacks but feel free to bring anything also',
        price: 0,
        capacity: 50,
        groupId: 1,
        venueId: 2,
        startDate: '2023-5-19 20:00:00',
        endDate: '2023-5-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649407/photo-1535016120720-40c646be5580_wjgvcp.jpg'
      }, {
        name: 'The Last of Us Finale Watch Party',
        type: 'Online',
        description: 'Watch the hit hbo series inspired by the legendary video game with us. We will have snacks but feel free to bring anything also',
        price: 0,
        capacity: 50,
        groupId: 1,
        venueId: 2,
        startDate: '2023-3-13 20:00:00',
        endDate: '2023-3-14 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649407/photo-1535016120720-40c646be5580_wjgvcp.jpg'
      },
      {
        name: 'Hoops and Mimosas',
        type: 'In Person',
        description: 'Non-competitive way to socialize and exercise. We suggest mimosas after basketball but order is up to you',
        price: 20,
        capacity: 50,
        groupId: 2,
        venueId: 1,
        startDate: '2023-8-19 20:00:00',
        endDate: '2023-8-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649334/photo-1555766720-1e727844cc8f_hgelas.jpg'
      },
      {
        name: 'Tennis Singles',
        type: 'In Person',
        description: 'Take a break from our usual basketball games at this sporting event.',
        price: 5,
        capacity: 40,
        groupId: 2,
        venueId: 2,
        startDate: '2021-12-19 20:00:00',
        endDate: '2021-12-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649178/btxtohrerroggpurj4lm.jpg'
      },
      {
        name: 'Bulls Game trip',
        type: 'In Person',
        description: 'Watch the Chicago Bulls with other fans. Everyone welcome',
        price: 50,
        capacity: 30,
        groupId: 2,
        venueId: 2,
        startDate: '2022-5-19 20:00:00',
        endDate: '2022-5-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649459/photo-1620588212046-66bc57e70eeb_occccd.jpg'
      },
      {
        name: 'Chess Tournament',
        type: 'In Person',
        description: 'Competition with $500 prize for the winner. May the best player win',
        price: 15,
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
        capacity: 15,
        groupId: 4,
        venueId: 1,
        startDate: '2023-8-19 20:00:00',
        endDate: '2023-8-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649369/premium_photo-1671683370315-87306b0faf90_azbek0.jpg'
      },
      {
        name: 'Fundraiser Night 2',
        type: 'In Person',
        description: 'Best Poker Face wins $1000 for a charity of their choice',
        price: 100,
        capacity: 15,
        groupId: 4,
        venueId: 1,
        startDate: '2023-7-19 20:00:00',
        endDate: '2023-7-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649369/premium_photo-1671683370315-87306b0faf90_azbek0.jpg'
      },
      {
        name: `Texas Hold'em Night`,
        type: 'In Person',
        description: 'Best Poker Face takes the money',
        price: 100,
        capacity: 15,
        groupId: 4,
        venueId: 1,
        startDate: '2022-5-19 20:00:00',
        endDate: '2022-5-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649369/premium_photo-1671683370315-87306b0faf90_azbek0.jpg'
      },
      {
        name: `Seven-card stud`,
        type: 'In Person',
        description: 'Best Poker Face takes the money',
        price: 100,
        capacity: 15,
        groupId: 4,
        venueId: 1,
        startDate: '2022-6-19 20:00:00',
        endDate: '2022-6-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649369/premium_photo-1671683370315-87306b0faf90_azbek0.jpg'
      },
      {
        name: `High Low Chicago Night`,
        type: 'In Person',
        description: 'Best Poker Face takes the money',
        price: 100,
        capacity: 15,
        groupId: 4,
        venueId: 1,
        startDate: '2023-6-19 20:00:00',
        endDate: '2023-6-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649369/premium_photo-1671683370315-87306b0faf90_azbek0.jpg'
      },
      {
        name: 'End of Chapter Discussion 2',
        type: 'Online',
        description: `Tell us your thoughts on the week's chapter.`,
        price: 0,
        capacity: 20,
        groupId: 6,
        venueId: 3,
        startDate: '2023-10-17 20:00:00',
        endDate: '2023-10-18 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649250/photo-1585647347483-22b66260dfff_mfbyyn.jpg'
      }, {
        name: 'End of Chapter Discussion 1',
        type: 'Online',
        description: `Tell us your thoughts on the week's chapter.`,
        price: 0,
        capacity: 20,
        groupId: 6,
        venueId: 3,
        startDate: '2023-9-17 20:00:00',
        endDate: '2023-9-18 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649250/photo-1585647347483-22b66260dfff_mfbyyn.jpg'
      },
      {
        name: 'Movie Night',
        type: 'Online',
        description: `Watch a movie based on the book of the month. Everyone is welcome, even if you haven't read the book yet (but careful for spoilers).`,
        price: 0,
        capacity: 20,
        groupId: 6,
        venueId: 3,
        startDate: '2023-8-19 20:00:00',
        endDate: '2023-8-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649250/photo-1585647347483-22b66260dfff_mfbyyn.jpg'
      },
      {
        name: 'Movie Night 2',
        type: 'Online',
        description: `Watch a movie based on the book of the month. Everyone is welcome, even if you haven't read the book yet (but careful for spoilers).`,
        price: 0,
        capacity: 20,
        groupId: 6,
        venueId: 3,
        startDate: '2021-8-19 20:00:00',
        endDate: '2021-8-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649250/photo-1585647347483-22b66260dfff_mfbyyn.jpg'
      },
      {
        name: 'Trivia',
        type: 'Online',
        description: 'Test your trivia knowledge with us',
        price: 0,
        capacity: 20,
        groupId: 6,
        venueId: 4,
        startDate: '2022-8-19 20:00:00',
        endDate: '2022-8-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649281/photo-1652077859695-de2851a95620_lxepr0.jpg'
      }, {
        name: 'Trivia Night 2',
        type: 'Online',
        description: 'Test your trivia knowledge with us',
        price: 0,
        capacity: 20,
        groupId: 6,
        venueId: 4,
        startDate: '2023-3-12 20:00:00',
        endDate: '2023-3-13 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677649281/photo-1652077859695-de2851a95620_lxepr0.jpg'
      },
      {
        name: 'Rehearsal 1',
        type: 'In Person',
        description: 'Mandatory practice for our upcoming showcase at World of Dance',
        price: 0,
        capacity: 25,
        groupId: 7,
        venueId: 4,
        startDate: '2023-8-19 20:00:00',
        endDate: '2023-8-20 20:00:00',
        previewImage: 'https://images.unsplash.com/photo-1615213253844-9a9d661d40d0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80'
      },
      {
        name: 'Rehearsal 2',
        type: 'In Person',
        description: 'Mandatory practice for our upcoming showcase at World of Dance',
        price: 0,
        capacity: 25,
        groupId: 7,
        venueId: 4,
        startDate: '2022-9-19 20:00:00',
        endDate: '2022-9-20 20:00:00',
        previewImage: 'https://images.unsplash.com/photo-1615213253844-9a9d661d40d0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80'
      },
      {
        name: 'Rehearsal 3',
        type: 'In Person',
        description: 'Mandatory practice for our upcoming showcase at World of Dance',
        price: 0,
        capacity: 25,
        groupId: 7,
        venueId: 4,
        startDate: '2022-10-19 20:00:00',
        endDate: '2022-10-20 20:00:00',
        previewImage: 'https://images.unsplash.com/photo-1615213253844-9a9d661d40d0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80'
      },
      {
        name: 'Rehearsal 4',
        type: 'In Person',
        description: 'Mandatory practice for our upcoming showcase at World of Dance',
        price: 0,
        capacity: 25,
        groupId: 7,
        venueId: 4,
        startDate: '2022-11-19 20:00:00',
        endDate: '2022-11-20 20:00:00',
        previewImage: 'https://images.unsplash.com/photo-1615213253844-9a9d661d40d0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80'
      },
      {
        name: 'Rehearsal 5',
        type: 'In Person',
        description: 'Mandatory practice for our upcoming showcase at World of Dance',
        price: 0,
        capacity: 25,
        groupId: 7,
        venueId: 4,
        startDate: '2023-3-19 20:00:00',
        endDate: '2023-3-20 20:00:00',
        previewImage: 'https://images.unsplash.com/photo-1615213253844-9a9d661d40d0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80'
      },
      {
        name: 'Rehearsal 6',
        type: 'In Person',
        description: 'Mandatory practice for our upcoming showcase at World of Dance',
        price: 0,
        capacity: 25,
        groupId: 7,
        venueId: 4,
        startDate: '2023-4-19 20:00:00',
        endDate: '2023-4-20 20:00:00',
        previewImage: 'https://images.unsplash.com/photo-1615213253844-9a9d661d40d0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1178&q=80'
      },
      {
        name: 'Improv Pracice',
        type: 'In Person',
        description: 'Mandatory practice for our upcoming improv showcase at the Chicago Improv Festival',
        price: 0,
        capacity: 10,
        groupId: 8,
        venueId: 4,
        startDate: '2022-5-19 20:00:00',
        endDate: '2023-5-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1678234352/UP-Club-Interior-001_rduqey.jpg'
      },
      {
        name: 'Improv Pracice 2',
        type: 'In Person',
        description: 'Mandatory practice for our upcoming improv showcase at the Chicago Improv Festival',
        price: 0,
        capacity: 10,
        groupId: 8,
        venueId: 4,
        startDate: '2022-6-19 20:00:00',
        endDate: '2022-6-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1678234352/UP-Club-Interior-001_rduqey.jpg'
      },
      {
        name: 'Improv Pracice 3',
        type: 'In Person',
        description: 'Mandatory practice for our upcoming improv showcase at the Chicago Improv Festival',
        price: 0,
        capacity: 10,
        groupId: 8,
        venueId: 4,
        startDate: '2022-7-19 20:00:00',
        endDate: '2022-7-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1678234352/UP-Club-Interior-001_rduqey.jpg'
      },
      {
        name: 'Improv Pracice 4',
        type: 'In Person',
        description: 'Mandatory practice for our upcoming improv showcase at the Chicago Improv Festival',
        price: 0,
        capacity: 10,
        groupId: 8,
        venueId: 4,
        startDate: '2022-12-19 20:00:00',
        endDate: '2022-12-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1678234352/UP-Club-Interior-001_rduqey.jpg'
      },
      {
        name: 'Improv Pracice 5',
        type: 'In Person',
        description: 'Mandatory practice for our upcoming improv showcase at the Chicago Improv Festival',
        price: 0,
        capacity: 10,
        groupId: 8,
        venueId: 4,
        startDate: '2023-5-19 20:00:00',
        endDate: '2023-5-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1678234352/UP-Club-Interior-001_rduqey.jpg'
      },
      {
        name: 'Improv Pracice 6',
        type: 'In Person',
        description: 'Mandatory practice for our upcoming improv showcase at the Chicago Improv Festival',
        price: 0,
        capacity: 10,
        groupId: 8,
        venueId: 4,
        startDate: '2023-6-19 20:00:00',
        endDate: '2023-6-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1678234352/UP-Club-Interior-001_rduqey.jpg'
      },
      {
        name: 'Improv Pracice 7',
        type: 'In Person',
        description: 'Mandatory practice for our upcoming improv showcase at the Chicago Improv Festival',
        price: 0,
        capacity: 10,
        groupId: 8,
        venueId: 4,
        startDate: '2023-7-19 20:00:00',
        endDate: '2023-7-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1678234352/UP-Club-Interior-001_rduqey.jpg'
      },
      {
        name: 'Improv Pracice 8',
        type: 'In Person',
        description: 'Mandatory practice for our upcoming improv showcase at the Chicago Improv Festival',
        price: 0,
        capacity: 10,
        groupId: 8,
        venueId: 4,
        startDate: '2023-12-19 20:00:00',
        endDate: '2023-12-20 20:00:00',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1678234352/UP-Club-Interior-001_rduqey.jpg'
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
      name: { [Op.in]: ['Smash Bros Tournament', 'Met Gala Night', 'Tennis Singles', 'Movie Night', 'Trivia', 'Fortnite Tournament', 'Hoops and Mimosas', 'Chess Tournament', 'Fundraiser Night', 'Fifa Tournament', 'The Last of Us Watch Party', 'Bulls Game trip', 'Fundraiser Night 2', `Texas Hold'em Night`, `Seven-card stud`, `High Low Chicago Night`, 'End of Chapter Discussion 2', 'End of Chapter Discussion 1', 'Movie Night 2', 'Rehearsal 1', 'Rehearsal 2', 'Rehearsal 3', 'Rehearsal 4', 'Rehearsal 5', 'Rehearsal 6', 'Improv Pracice', 'Improv Pracice 2', 'Improv Pracice 3', 'Improv Pracice 4', 'Improv Pracice 5', 'Improv Pracice 6', 'Improv Pracice 7', 'Improv Pracice 8'] }
    }, {});
  }
};

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
        url: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1682490600/images_gg8ml6.jpg',
        preview: true
      },
      {
        eventId: 1,
        url: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1682490559/images_unouvj.jpg',
        preview: true
      },
      {
        eventId: 1,
        url: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1682490559/images_unouvj.jpg',
        preview: true
      },
      {
        eventId: 1,
        url: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1682490577/images_zcemo7.jpg',
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

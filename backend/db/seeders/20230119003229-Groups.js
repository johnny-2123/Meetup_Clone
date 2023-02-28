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
    options.tableName = 'Groups';
    await queryInterface.bulkInsert(options, [
      {
        organizerId: 1,
        name: 'Video Game Club',
        type: 'In person',
        private: true,
        city: 'Chicago',
        state: 'Illinois',
        about: 'enjoy a tightnight community',
        previewImage: 'image url'
      },
      {
        organizerId: 1,
        name: 'Pickup Basketball',
        type: 'In person',
        private: true,
        city: 'Washington',
        state: 'District of Columbia',
        about: 'find community with us',
        previewImage: 'image url'
      },
      {
        organizerId: 1,
        name: 'chess',
        type: 'online',
        private: false,
        city: 'Miami',
        state: 'Florida',
        about: 'meet new people',
        previewImage: 'image url'
      },
      {
        organizerId: 1,
        name: 'poker',
        type: 'online',
        private: false,
        city: 'Houston',
        state: 'Texas',
        about: 'make new friends',
        previewImage: 'image url'
      },
      {
        organizerId: 2,
        name: 'intramural soccer',
        type: 'In person',
        private: false,
        city: 'Washington',
        state: 'DC',
        about: 'play soccer in a friendly environment',
        previewImage: 'image url'
      },
      {
        organizerId: 2,
        name: 'Book Club',
        type: 'Online',
        private: false,
        city: 'Houston',
        state: 'Texas',
        about: 'expand your knowledge and make new friends',
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
    options.tableName = 'Groups';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Video Game Club', 'Pickup Basketball', 'chess', 'poker'] }
    }, {});
  }
};

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
        name: 'bulls',
        type: 'In person',
        private: true,
        city: 'Chicago',
        state: 'Illinois',
        previewImage: 'image url'
      },
      {
        name: 'wizards',
        type: 'In person',
        private: true,
        city: 'Washington',
        state: 'District of Columbia',
        previewImage: 'image url'
      },
      {
        name: 'chess',
        type: 'online',
        private: false,
        city: 'Miami',
        state: 'Florida',
        previewImage: 'image url'
      },
      {
        name: 'poker',
        type: 'online',
        private: false,
        city: 'Houston',
        state: 'Texas',
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
      name: { [Op.in]: ['bulls', 'wizardsn', 'chess', 'poker'] }
    }, {});
  }
};

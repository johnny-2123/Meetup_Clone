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
        name: 'The Video Game Social and Competition Club of Chicago',
        type: 'In person',
        private: true,
        city: 'Chicago',
        state: 'Illinois',
        about: 'enjoy a tightnight community playing video games and more with a diverse group of people from Chicago and the surrounding suburbs',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677815579/photo-1493711662062-fa541adb3fc8_fqkzqb.jpg'
      },
      {
        organizerId: 1,
        name: 'Pickup Basketball',
        type: 'In person',
        private: false,
        city: 'Washington',
        state: 'District of Columbia',
        about: 'Find community and exercise with through basketball. We are open to all experience levels and backgrounds.',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677815647/photo-1627627256672-027a4613d028_v5balp.jpg'
      },
      {
        organizerId: 2,
        name: 'Chess Club by the Water',
        type: 'Online',
        private: true,
        city: 'Miami',
        state: 'Florida',
        about: `Meet new people at our high-level chess events on the beach. Develop your skills while under the sun. Don't forget your sunscreen. Open to intermediate and above levels.`,
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677815673/photo-1529699211952-734e80c4d42b_l5smoc.jpg'
      },
      {
        organizerId: 2,
        name: 'Poker Nights',
        type: 'Online',
        private: true,
        city: 'Houston',
        state: 'Texas',
        about: 'Make new friends and win (or lose) money at the same time. Bring your best poker face and competitive spirit. For experienced players only',
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677815706/photo-1626775238053-4315516eedc9_idljmp.jpg'
      },
      {
        organizerId: 3,
        name: 'Intramural Soccer',
        type: 'In person',
        private: false,
        city: 'Washington',
        state: 'DC',
        about: `Play soccer in a friendly and judgement free environment. Great way to make new friends whether you're new to the city or a seasoned resident`,
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677815738/photo-1574629810360-7efbbe195018_e079vu.jpg'
      },
      {
        organizerId: 4,
        name: 'Book Club',
        type: 'Online',
        private: false,
        city: 'Houston',
        state: 'Texas',
        about: `Expand your knowledge and make new friends. We read all kinds of genres and vote on the book of the month based on member recommendations. We mostly do online book related events but occasionally do in person outings when there's interest`,
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677815777/photo-1589998059171-988d887df646_u1h2kd.jpg'
      },
      {
        organizerId: 4,
        name: 'Fuego Reggaeton Dance Group',
        type: 'In Person',
        private: true,
        city: 'Los Angeles',
        state: 'California',
        about: `Competition level dance group based in LA. We do primarily reggaeton pieces that stay faithful to the genre's movements but incorporate elements from other styles. Audition if you want to join a group of passionate movers.`,
        previewImage: 'https://res.cloudinary.com/dkul3ouvi/image/upload/v1677817137/photo-1621976498727-9e5d56476276_isjewy.jpg'
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

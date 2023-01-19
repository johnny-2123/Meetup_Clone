'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here


      //this association causing problems
      // Venue.belongsTo(models.Group, { foreignKey: 'groupId', onDelete: 'cascade' });
    }
  }
  Venue.init({
    groupId: {
      type: DataTypes.INTEGER
    },
    address: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.STRING
    },
    lat: {
      type: DataTypes.INTEGER
    },
    lng: {
      type: DataTypes.INTEGER
    }
  }, {
    sequelize,
    modelName: 'Venues',
  });
  return Venue;
};

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendant.belongsTo(models.Event, { foreignKey: 'eventId' });
      Attendant.belongsTo(models.User, { foreignKey: 'userId' });
    }
  }
  Attendant.init({
    eventId: {
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Attendant',
    defaultScope: {
      attributes: {
        exclude: ['createdAt', 'updatedAt']
      }
    },
  });
  return Attendant;
};

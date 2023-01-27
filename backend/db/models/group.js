'use strict';
const {
  Model, Validator
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Group.belongsTo(models.User, {
        foreignKey: 'organizerId', as: 'Organizer'
      });

      Group.hasMany(models.Event, { foreignKey: 'groupId' });

      Group.hasMany(models.Venue, { foreignKey: 'groupId', onDelete: 'cascade' });

      Group.belongsToMany(models.User, { through: models.GroupMember, as: 'members', onDelete: 'cascade' });

      Group.hasMany(models.GroupImage, { foreignKey: 'groupId', onDelete: 'cascade' });
    }
  }
  Group.init({
    organizerId: {
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.STRING
    },
    private: {
      type: DataTypes.BOOLEAN
    },
    city: {
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.STRING
    },
    about: {
      type: DataTypes.STRING
    },
    previewImage: {
      type: DataTypes.STRING
    },
    deletedAt: {
      type: DataTypes.JSON
    },
  }, {
    sequelize,
    modelName: 'Group',
    paranoid: true,
    timestamps: true,
    defaultScope: {
      attributes: {
        exclude: ['deletedAt']
      }
    }
  });
  return Group;
};

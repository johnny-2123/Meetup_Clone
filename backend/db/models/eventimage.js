"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EventImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EventImage.belongsTo(models.Event, { foreignKey: "eventId" });
    }
  }
  EventImage.init(
    {
      eventId: {
        type: DataTypes.INTEGER,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      preview: {
        type: DataTypes.BOOLEAN,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "EventImage",
      defaultScope: {
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
      },
    }
  );
  return EventImage;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class group_message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      group_message.hasMany(models.messagge, {
        as: "messages",
        foreignKey: "idGroup",
      });

      group_message.hasMany(models.group_member, {
        as: "members",
        foreignKey: "idGroup",
      });
    }
  }
  group_message.init(
    {
      id: {
        allowNull: false,
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        validate: {
          notNull: true,
        },
      },
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "group_message",
    }
  );
  return group_message;
};

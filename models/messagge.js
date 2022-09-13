"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class messagge extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      messagge.belongsTo(models.user, {
        as: "sender",
        foreignKey: {
          name: "idSender",
        },
      });

      messagge.belongsTo(models.user, {
        as: "receiver",
        foreignKey: {
          name: "idReceiver",
        },
      });

      messagge.belongsTo(models.group_message, {
        as: "group",
        foreignKey: {
          name: "idGroup",
        },
      });
    }
  }
  messagge.init(
    {
      id: {
        allowNull: false,
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        validate: {
          notNull,
        },
      },
      idReceiver: DataTypes.UUID,
      idSender: DataTypes.UUID,
      idGroup: DataTypes.INTEGER,
      text: DataTypes.STRING,
      image: DataTypes.STRING,
      voice: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "messagge",
    }
  );
  return messagge;
};

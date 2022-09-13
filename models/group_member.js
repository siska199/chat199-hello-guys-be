"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class group_member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  group_member.init(
    {
      id: {
        allowNull: false,
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        validate: {
          notNull:true,
        },
      },
      idUser: DataTypes.UUID,
      idGroup: DataTypes.UUID,
      joined_datetime: DataTypes.DATE,
      left_datetime: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "group_member",
    }
  );
  return group_member;
};

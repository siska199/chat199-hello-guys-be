"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class post_seen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  post_seen.init(
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
      idPost: DataTypes.UUID,
      idUser: DataTypes.UUID,
      seen_status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "post_seen",
    }
  );
  return post_seen;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      post.belongsTo(models.user, {
        as: "user",
        foreignKey: "idUser",
      });

      post.hasMany(models.comment, {
        as: "comments",
        foreignKey: "idPost",
        onUpdate: "cascade",
        onDelete: "cascade",
      });

      post.hasMany(models.like, {
        as: "likes",
        foreignKey: "idPost",
        onDelete: "cascade",
        onUpdate: "update",
      });

      post.hasMany(models.post_seen, {
        as: "seens",
        foreignKey: "idPost",
        onDelete: "cascade",
        onUpdate: "update",
      });
    }
  }
  post.init(
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
      idUser: DataTypes.UUID,
      text: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "post",
    }
  );
  return post;
};

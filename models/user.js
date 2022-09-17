"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.messagge,{ //Kita ambil seluruh messages dimana uswr sebagai receiver
        as : "messagesAsReceiver",
        foreignKey :{
          name : "idReceiver"
        }
      })
      user.hasMany(models.messagge,{ //kita ambil seluruh messages dimana uset sebagai sender
        as : "messagesAsSender",
        foreignKey : {
          name : "idSender"
        }
      })



    }
  }
  user.init(
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
      password: DataTypes.STRING,
      fullname: DataTypes.STRING,
      username: DataTypes.STRING,
      image: DataTypes.STRING,
      info: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};

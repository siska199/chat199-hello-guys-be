const { messagge } = require("../../models");
const { Op } = require("sequelize");
const sequelize  = require("sequelize")

exports.addMessage = async (data) => {
  try {
    await messagge.create(data);
  } catch (error) {
    throw new Error(error);
  }
};

exports.getMessages = async (idReceiver, idSender) => {
  try {
    const groupMessages = await messagge.findAll({
      // attributes : [
      // // "idSender","idReceiver"
      // ],
      group: ["idSender"],
      raw: true,
    });
    console.log("group messages: ", groupMessages);
    const messages = await messagge.findAll({
      where: {
        idSender: {
          [Op.or]: [idSender, idReceiver],
        },
        idReceiver: {
          [Op.or]: [idReceiver, idSender],
        },
      },
      raw: true,
      order: [["createdAt"]],
      group: ["messagge.createdAt"],
    });

    return messages;
  } catch (error) {
    throw new Error(error);
  }
};

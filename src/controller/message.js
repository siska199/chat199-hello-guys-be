const { messagge } = require("../../models");
const { Op } = require("sequelize");

exports.addMessage = async (data) => {
  try {
    const addMsg = await messagge.create(data);
  } catch (error) {
    throw new Error(error);
  }
};

exports.getMessages = async (idReceiver, idSender) => {
  try {
    console.log(idReceiver, idSender)
    const messages = await messagge.findAll({
      where: {
        idSender: {
          [Op.or]: [idSender, idReceiver],
        },
        idReceiver: {
          [Op.or]: [idReceiver, idSender],
        },
      },
      raw:true,
      order: [["createdAt"]],
    });
    console.log("query language; ", messages)
    return messages;
  } catch (error) {
    throw new Error(error);
  }
};

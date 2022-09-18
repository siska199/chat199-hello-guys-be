const { messagge } = require("../../models");
const { Op } = require("sequelize");

exports.addMessage = async (data) => {
  try {
    await messagge.create(data);
  } catch (error) {
    throw new Error(error);
  }
};

exports.getMessages = async (idReceiver, idSender) => {
  try {
    await messagge.update(
      {
        read: 1,
      },
      {
        where: {
          idReceiver: idSender,
          idSender: idReceiver,
        },
      }
    );

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

exports.getMessagesOffline = async (idReceiver, idSender) => {
  const messages = await messagge.findAll({
    where: {
      idSender,
      idReceiver,
      read: 0,
    },
  });
  return messages.length;
};

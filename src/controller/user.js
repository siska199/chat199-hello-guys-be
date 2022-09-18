const { Op } = require("sequelize");
const { user, messagge } = require("../../models");
const { getMessagesOffline } = require("./message");
const {
  validatesData,
  encryptPassword,
  generateToken,
  comparePassword,
  getLatestMessage,
} = require("../utils/helper");

exports.register = async (req, res) => {
  try {
    const form = {
      username: req.body.username.trim().toLowerCase(),
      fullname: req.body.fullname.trim().toLowerCase(),
      password: req.body.password.trim(),
    };
    const resValidation = validatesData(form);
    if (resValidation !== true)
      return res.status(400).json({
        message: resValidation,
      });
    const usernameHaveUsed = await user.findOne({
      where: {
        username: form.username,
      },
    });
    if (usernameHaveUsed)
      return res.status(400).json({
        message: "This username have been use by other user",
      });

    const createUser = await user.create({
      ...form,
      password: await encryptPassword(form.password),
    });
    let dataUser = await user.findOne({
      where: {
        id: createUser.id,
      },
    });
    dataUser = dataUser.get({ plain: true });
    delete dataUser.password;
    return res.status(201).json({
      message: "Register user success",
      data: {
        ...dataUser,
        token: generateToken(dataUser.id),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    let findUser = await user.findOne({
      where: {
        username,
      },
    });
    if (!findUser)
      return res.status(400).json({
        message: "Username and password doesn't match",
      });
    const checkPassword = await comparePassword(password, findUser.password);
    if (!checkPassword)
      return res.status(400).json({
        message: "Username and password doesn't match",
      });
    await user.update(
      { status: "online" },
      {
        where: { id: findUser.id },
      }
    );

    findUser = findUser.get({ plain: true });
    delete findUser.password;
    return res.status(200).json({
      message: "Login success",
      data: {
        ...findUser,
        status: "online",
        token: generateToken(findUser.id),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const { id } = req.user;
    const findUser = await user.findOne({
      where: { id },
    });
    if (!findUser)
      return res.status(403).json({ message: "This user have been removed" });
    await user.update(
      { status: "offline" },
      {
        where: {
          id,
        },
      }
    );
    res.status(200).json({
      message: "Logout user success",
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.user;
    let findUser = await user.findOne({
      where: {
        id,
      },
    });
    if (!findUser)
      return res.status(404).json({
        message: "This user doesn't exist",
      });
    findUser = findUser.get({ plain: true });
    delete findUser.password;
    return res.status(200).json({
      message: "Get user data success",
      data: {
        ...findUser,
      },
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.user;
    const updateUser = await user.update(req.body, {
      where: {
        id,
      },
    });
    if (!updateUser)
      return res.status(404).json({
        message: "This user doesn't exist",
      });

    return res.status(200).json({
      message: "Update profile success",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//-------Get contacts user except the user itself----------////

exports.getContacts = async (idUser) => {
  try {
    let contacts = await user.findAll({
      where: {
        id: {
          [Op.not]: idUser,
        },
      },
      include: [
        {
          model: messagge,
          as: "messagesAsReceiver",
          where: {
            idSender: idUser,
          },
          required: false,
          order: ["createdAt"],
        },
        {
          model: messagge,
          as: "messagesAsSender",
          where: {
            idReceiver: idUser,
          },
          required: false,
        },
      ],
      order: [
        [{ model: messagge, as: "messagesAsReceiver" }, "createdAt", "DESC"],
        [{ model: messagge, as: "messagesAsSender" }, "createdAt", "DESC"],
      ],
      attributes: {
        exclude: ["password"],
      },
    });
    if (contacts.length > 0)
      contacts = await Promise.all(
        JSON.parse(JSON.stringify(contacts)).map(async (data) => {
          const lastMessage = getLatestMessage(
            data.messagesAsReceiver[0],
            data.messagesAsSender[0]
          );
          const countNotif = await getMessagesOffline(idUser, data.id);
          return {
            id: data.id,
            fullname: data.fullname,
            username: data.username,
            image: data.image,
            info: data.info,
            status: data.status,
            lastMessage,
            notif: countNotif,
          };
        })
      );

    return contacts;
  } catch (error) {
    throw new Error(error);
  }
};

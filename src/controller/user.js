const { user } = require("../../models");
const {
  validatesData,
  encryptPassword,
  generateToken,
  comparePassword,
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

    let createUser = await user.create({
      ...form,
      password: await encryptPassword(form.password),
    });
    createUser = createUser.get({ plain: true });
    delete createUser.password;
    return res.status(201).json({
      message: "Register user success",
      data: {
        ...createUser,
        token: generateToken(createUser.id),
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
    findUser = findUser.get({ plain: true });
    delete findUser.password;
    return res.status(200).json({
      message: "Login success",
      data: {
        ...findUser,
        token: generateToken(findUser.id),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
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
        ...findUser.get({ plain: true }),
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

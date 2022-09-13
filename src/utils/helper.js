const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const validateData = (type, data) => {
  let pattern = "";
  err = "";
  switch (type) {
    case "username":
      pattern = "^[a-z0-9]{3,10}$";
      err =
        "Username should be 3-10 characters and should't contain uppercase letter";
      break;
    case "fullname":
      pattern = "^([a-z]+[ ]{0,1})+$";
      err =
        "Fullname should't contain uppercase letter and should only contain alphabet";
      break;
    case "password":
      pattern = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,20})";
      err =
        "Password should be 8-20 characters and includes at least contain 1 lowercase, 1 uppercase, 1 numeric, and 1 special character";
      break;
    default:
      break;
  }
  const regex = new RegExp(pattern);
  const result = regex.test(data);

  return result ? true : err;
};

const validatesData = (data) => {
  for (field in data) {
    const resultVal = validateData(field, data[field]);
    if (resultVal != true) return resultVal;
  }

  return true;
};

const encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
  console.log("password: ", password);
  console.log("hashed password: ", hashedPassword);
  const res = bcrypt.compare(password, hashedPassword);

  return res;
};

const generateToken = (id) => {
  const secret = process.env.SECRET_TOKEN;
  const token = jwt.sign({ id }, secret);
  return token;
};
module.exports = {
  validatesData,
  encryptPassword,
  comparePassword,
  generateToken,
};
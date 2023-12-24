const createError = require("http-errors");
const User = require("../models/user.model");
const { authSchema } = require("../helpers/validationSchema");
const { signAccessToken } = require("../helpers/jwtHelper");

const register = async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    const exist = await User.findOne({ email: result.email });
    if (exist) throw createError.Conflict(`${result.email} is already in use`);
    const user = await User.create(result);
    const accessToken = await signAccessToken(user.id);
    res.status(201).send(accessToken);
  } catch (err) {
    next(err);
  }
};

const login = (req, res) => {
  res.send("login");
};

const logout = (req, res) => {
  res.send("logout");
};

const refreshToken = (req, res) => {
  res.send("refreshtoken");
};

module.exports = { register, login, logout, refreshToken };

const User = require("../models/user.model");
const { authSchema } = require("../helpers/validationSchema");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwtHelper");
const createHttpError = require("http-errors");

const register = async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    const exist = await User.findOne({ email: result.email });
    if (exist)
      throw createHttpError.Conflict(`${result.email} is already in use`);
    const user = await User.create(result);
    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);
    res.status(201).send({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);
    const user = await User.findOne({ email: result.email });
    if (!user) throw createHttpError.NotFound("Username not registered");
    const isMatched = await user.isPasswordValid(result.password);
    if (!isMatched)
      throw createHttpError.Unauthorized("Username/password not valid");
    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);
    res.send({ accessToken, refreshToken });
  } catch (err) {
    if (err.isJoi)
      next(createHttpError.BadRequest("Invalid username/password"));
    next(err);
  }
};

const logout = (req, res) => {
  res.send("logout");
};

const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  try {
    if (!refreshToken) throw createHttpError.BadRequest();
    const userId = await verifyRefreshToken(refreshToken);
    const accessToken = await signAccessToken(userId);
    const refToken = await signRefreshToken(userId);
    res.send({ accessToken, refToken });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, logout, refreshToken };

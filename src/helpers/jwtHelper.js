const JWT = require("jsonwebtoken");
const createHttpError = require("http-errors");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require("./config");

const signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "1h",
      issuer: "rvmaher.com",
      audience: userId,
    };
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        return reject(createHttpError.InternalServerError());
      }
      resolve(token);
    });
  });
};

const verifyAccessToken = async (req, res, next) => {
  if (!req.headers["authorization"])
    return next(createHttpError.Unauthorized());
  const bearerToken = req.headers["authorization"];
  const token = bearerToken?.split(" ")[1];
  JWT.verify(token, ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const message =
        err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(createHttpError.Unauthorized(message));
    }
    req.payload = payload;
    next();
  });
};

const signRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};
    const secret = REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: "1y",
      issuer: "rvmaher.com",
      audience: userId,
    };
    JWT.sign(payload, secret, options, (err, token) => {
      if (err) {
        return reject(createHttpError.InternalServerError());
      }
      resolve(token);
    });
  });
};

const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    JWT.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return reject(createHttpError.Unauthorized(message));
      }
      const userId = payload.aud;
      resolve(userId);
    });
  });
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};

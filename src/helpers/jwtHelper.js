const JWT = require("jsonwebtoken");
const createHttpError = require("http-errors");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require("./config");
const { redisClient } = require("../helpers/initRedis");

const ONE_YEAR = 365 * 24 * 60 * 60;

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
    JWT.sign(payload, secret, options, async (err, token) => {
      if (err) {
        return reject(createHttpError.InternalServerError());
      }
      try {
        await redisClient.SETEX(userId, ONE_YEAR, token);
        return resolve(token);
      } catch {
        return reject(createHttpError.InternalServerError());
      }
    });
  });
};

const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    JWT.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return reject(createHttpError.Unauthorized(message));
      }
      const userId = payload.aud;
      try {
        const refToken = await redisClient.GET(userId);
        if (refreshToken === refToken) return resolve(userId);
        else return reject(createHttpError.Unauthorized());
      } catch {
        return reject(createHttpError.InternalServerError());
      }
    });
  });
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};

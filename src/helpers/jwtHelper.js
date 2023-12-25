const JWT = require("jsonwebtoken");
const createHttpError = require("http-errors");
const { ACCESS_TOKEN_SECRET } = require("./config");

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

module.exports = { signAccessToken };

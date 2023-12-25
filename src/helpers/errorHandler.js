const createHttpError = require("http-errors");

const errorHandler = (err, req, res, next) => {
  if (err.isJoi) {
    err.status = 422;
  }
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
};

const notFound = (req, res, next) => {
  next(createHttpError.NotFound());
};

module.exports = { errorHandler, notFound };

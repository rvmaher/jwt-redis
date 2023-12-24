const Joi = require("joi");

const authSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().min(5).max(20).required(),
});

module.exports = { authSchema };

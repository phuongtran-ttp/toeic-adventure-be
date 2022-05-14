const Joi = require('joi');
const { objectId, password } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().custom(password).required(),
    role: Joi.string().custom(objectId),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

module.exports = {
  login,
  register
};

const Joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    role: Joi.string().custom(objectId),
  }),
};

const update = {
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string(),
    role: Joi.string().custom(objectId),
    isEmailVerified: Joi.boolean(),
  }),
};

module.exports = {
  create,
  update
};

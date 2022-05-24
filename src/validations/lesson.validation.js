const Joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    content: Joi.string().required(),
    topic: Joi.string().custom(objectId).required(),
  }),
};

const update = {
  body: Joi.object().keys({
    name: Joi.string(),
    content: Joi.string(),
    topic: Joi.string().custom(objectId),
  }),
};

module.exports = {
  create,
  update
};

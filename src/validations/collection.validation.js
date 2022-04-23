const Joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    thumbnail: Joi.string().custom(objectId).required(),
  }),
};

const update = {
  body: Joi.object().keys({
    name: Joi.string(),
    thumbnail: Joi.string().custom(objectId),
  }),
};

module.exports = {
  create,
  update
};

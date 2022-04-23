const Joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    questions: Joi.array().items(Joi.string().custom(objectId)),
    testCollection: Joi.string().custom(objectId),
  }),
};

const update = {
  body: Joi.object().keys({
    name: Joi.string(),
    questions: Joi.array().items(Joi.string().custom(objectId)),
    testCollection: Joi.string().custom(objectId),
  }),
};

module.exports = {
  create,
  update,
};

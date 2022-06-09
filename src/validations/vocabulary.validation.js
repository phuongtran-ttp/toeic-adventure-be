const Joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
  body: Joi.object().keys({
    word: Joi.string().required(),
    meaning: Joi.string().required(),
    phonetic: Joi.string().required(),
    audio: Joi.string().custom(objectId),
    theme: Joi.string().custom(objectId).required(),
  }),
};

const update = {
  body: Joi.object().keys({
    word: Joi.string(),
    meaning: Joi.string(),
    phonetic: Joi.string(),
    audio: Joi.string().custom(objectId),
    theme: Joi.string().custom(objectId),
  }),
};

module.exports = {
  create,
  update
};

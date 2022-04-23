const Joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    questions: Joi.array().items(Joi.string().custom(objectId)),
    part: Joi.number().integer().required().min(1).max(7),
  }),
};

const updateSkillTest = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    questions: Joi.array().items(Joi.string().custom(objectId)),
    part: Joi.number().integer().required().min(1).max(7),
  }),
};

module.exports = {
  create,
  updateSkillTest
};

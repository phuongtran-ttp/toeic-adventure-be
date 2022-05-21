const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createFullTestHistory = {
  body: Joi.object().keys({
    correctSentences: Joi.object().keys({
      listening: Joi.number().required(),
      reading: Joi.number().required(),
    }),
    test: Joi.string().custom(objectId).required(),
  }),
};

const createSkillTestHistory = {
  body: Joi.object().keys({
    correctSentences: Joi.number().required(),
    test: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createFullTestHistory,
  createSkillTestHistory,
};

const Joi = require('joi');
const { objectId } = require('./custom.validation');

const answerSchema = Joi.object().keys({
  text: Joi.string().required(),
  explanation: Joi.string(),
});

const questionSchema = Joi.object().keys({
  text: Joi.string().required(),
  image: Joi.array().items(Joi.string().custom(objectId)),
  sound: Joi.array().items(Joi.string().custom(objectId)),
  choices: Joi.array().items(Joi.string()),
});

const create = {
  body: Joi.object().keys({
    question: questionSchema,
    answer: answerSchema,
    difficultyLevel: Joi.string().required().valid('EASY', 'MEDIUM', 'DIFFICULT'),
    part: Joi.number().integer().required().min(1).max(7),
    childs: Joi.array().items(Joi.object().keys({
      question: questionSchema,
      answer: answerSchema,
    })),
  }),
};

const update = {
  body: Joi.object().keys({
    question: questionSchema,
    answer: answerSchema,
    difficultyLevel: Joi.string().valid('EASY', 'MEDIUM', 'DIFFICULT'),
    part: Joi.number().integer().min(1).max(7),
    childs: Joi.array().items(Joi.object().keys({
      question: questionSchema,
      answer: answerSchema,
    })),
  }),
};

module.exports = {
  create,
  update,
};

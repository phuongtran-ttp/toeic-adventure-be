const Joi = require('joi');
const { objectId } = require('./custom.validation');

const create = {
  body: Joi.object().keys({
    enName: Joi.string().required(),
    vnName: Joi.string().required(),
  }),
};

const update = {
  body: Joi.object().keys({
    enName: Joi.string(),
    vnName: Joi.string(),
  }),
};

module.exports = {
  create,
  update
};

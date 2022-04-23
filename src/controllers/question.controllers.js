const Question = require('../models/question.model');
const getQueryParams = require('../utils/getQueryParams');
const questionServices = require('../services/question.services');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

const find = async (req, res) => {
  const { filter, options } = getQueryParams(req);
  options.populate = [
    'question.image',
    'question.sound',
    'childs.question.image',
    'childs.question.sound',
  ];
  const resultPage = await questionServices.findPage(filter, options);
  return res.json(resultPage);
};

const findOne = async (req, res) => {
  const { id } = req.params;
  const question = await questionServices.findById(id, {
    populate: [
      'question.image',
      'question.sound',
      'childs.question.image',
      'childs.question.sound',
    ],
  });
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }

  return res.json(question.toJSON());
};

const create = async (req, res) => {
  const question = await questionServices.create(req.body, {
    populate: [
      'question.image',
      'question.sound',
      'childs.question.image',
      'childs.question.sound',
    ],
  });
  return res.status(httpStatus.CREATED).json(question.toJSON());
};

const update = async (req, res) => {
  const { id } = req.params;
  const question = await questionServices.updateById(id, req.body, {
    populate: [
      'question.image',
      'question.sound',
      'childs.question.image',
      'childs.question.sound',
    ],
  });
  if (!question) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }
  
  return res.json(question.toJSON());
};

const deleteOne = async (req, res) => {
  const { id } = req.params;
  const deletedQuestion = await questionServices.deleteById(id);
  if (!deletedQuestion) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Question not found');
  }

  res.json(true);
};

const count = async (req, res) => {
  const count = await questionServices.count(req.query);
  return res.json(count);
};

module.exports = {
  find,
  findOne,
  create,
  update,
  deleteOne,
  count,
};

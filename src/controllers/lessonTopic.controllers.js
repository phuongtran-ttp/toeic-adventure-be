const getQueryParams = require('../utils/getQueryParams');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const lessonTopicServices = require('../services/lessonTopic.services');

const find = async (req, res) => {
  const { filter, options } = getQueryParams(req);
  const resultPage = await lessonTopicServices.findPage(filter, options);
  return res.json(resultPage);
};

const findOne = async (req, res) => {
  const { id } = req.params;
  let lessonTopic = await lessonTopicServices.findById(id);

  if (!lessonTopic) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vocabulary not found');
  }

  return res.json(lessonTopic.toJSON());
};

const create = async (req, res) => {
  const lessonTopic = await lessonTopicServices.create(req.body);
  return res.status(httpStatus.CREATED).json(lessonTopic.toJSON());
};

const update = async (req, res) => {
  const { id } = req.params;
  const lessonTopic = await lessonTopicServices.updateById(id, req.body);

  if (!lessonTopic) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vocabulary not found');
  }
  
  return res.json(lessonTopic.toJSON());
};

const deleteOne = async (req, res) => {
  const { id } = req.params;
  const deletedVocabulary = await lessonTopicServices.deleteById(id);
  
  if (!deletedVocabulary) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vocabulary not found');
  }

  res.json(true);
};

const count = async (req, res) => {
  const count = await lessonTopicServices.count(req.query);
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

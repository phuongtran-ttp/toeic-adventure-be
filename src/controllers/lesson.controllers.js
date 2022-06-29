const getQueryParams = require('../utils/getQueryParams');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const lessonServices = require('../services/lesson.services');
const lessonTopicServices = require('../services/lessonTopic.services');

const find = async (req, res) => {
  const { filter, options } = getQueryParams(req);
  options.populate = 'topic';
  const results = await lessonServices.find(filter, options);
  return res.json({ results });
};

const findOne = async (req, res) => {
  const { id } = req.params;
  let lesson = await lessonServices.findById(id, {
    populate: 'topic',
  });

  if (!lesson) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lesson not found');
  }

  return res.json(lesson.toJSON());
};

const create = async (req, res) => {
  const params = req.body;
  const topic = await lessonTopicServices.findById(params.topic);

  if (!topic) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Topic not found');
  }
  
  const lesson = await lessonServices.create(params, {
    populate: 'topic',
  });
  return res.status(httpStatus.CREATED).json(lesson.toJSON());
};

const update = async (req, res) => {
  const { id } = req.params;
  const params = req.body;
  const topic = await lessonTopicServices.findById(params.topic);

  if (!topic) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Topic not found');
  }

  const lesson = await lessonServices.updateById(id, params, {
    populate: 'topic',
  });

  if (!lesson) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lesson not found');
  }
  
  return res.json(lesson.toJSON());
};

const deleteOne = async (req, res) => {
  const { id } = req.params;
  const deletedLesson = await lessonServices.deleteById(id);
  
  if (!deletedLesson) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lesson not found');
  }

  res.json(true);
};

const count = async (req, res) => {
  const count = await lessonServices.count(req.query);
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

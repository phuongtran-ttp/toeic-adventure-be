const getQueryParams = require('../utils/getQueryParams');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const vocabularyServices = require('../services/vocabulary.services');
const vocabularyThemeServices = require('../services/vocabularyTheme.services');

const find = async (req, res) => {
  const { filter, options } = getQueryParams(req);
  options.populate = 'audio theme';
  const resultPage = await vocabularyServices.findPage(filter, options);
  return res.json(resultPage);
};

const findOne = async (req, res) => {
  const { id } = req.params;
  let vocabulary = await vocabularyServices.findById(id, {
    populate: 'audio theme',
  });

  if (!vocabulary) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vocabulary not found');
  }

  return res.json(vocabulary.toJSON());
};

const create = async (req, res) => {
  const params = req.body;
  const theme = await vocabularyThemeServices.findById(params.theme);

  if (!theme) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Theme not found');
  }
  
  const vocabulary = await vocabularyServices.create(params, {
    populate: 'audio theme',
  });
  return res.status(httpStatus.CREATED).json(vocabulary.toJSON());
};

const update = async (req, res) => {
  const { id } = req.params;
  const params = req.body;
  const theme = await vocabularyThemeServices.findById(params.theme);

  if (!theme) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Theme not found');
  }

  const vocabulary = await vocabularyServices.updateById(id, params, {
    populate: 'audio theme',
  });

  if (!vocabulary) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vocabulary not found');
  }
  
  return res.json(vocabulary.toJSON());
};

const deleteOne = async (req, res) => {
  const { id } = req.params;
  const deletedVocabulary = await vocabularyServices.deleteById(id);
  
  if (!deletedVocabulary) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vocabulary not found');
  }

  res.json(true);
};

const count = async (req, res) => {
  const count = await vocabularyServices.count(req.query);
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

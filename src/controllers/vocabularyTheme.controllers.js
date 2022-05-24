const getQueryParams = require('../utils/getQueryParams');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const vocabularyThemeServices = require('../services/vocabularyTheme.services');

const find = async (req, res) => {
  const { filter, options } = getQueryParams(req);
  const resultPage = await vocabularyThemeServices.findPage(filter, options);
  return res.json(resultPage);
};

const findOne = async (req, res) => {
  const { id } = req.params;
  let vocabularyTheme = await vocabularyThemeServices.findById(id);

  if (!vocabularyTheme) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vocabulary not found');
  }

  return res.json(vocabularyTheme.toJSON());
};

const create = async (req, res) => {
  const vocabularyTheme = await vocabularyThemeServices.create(req.body);
  return res.status(httpStatus.CREATED).json(vocabularyTheme.toJSON());
};

const update = async (req, res) => {
  const { id } = req.params;
  const vocabularyTheme = await vocabularyThemeServices.updateById(id, req.body);

  if (!vocabularyTheme) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vocabulary not found');
  }
  
  return res.json(vocabularyTheme.toJSON());
};

const deleteOne = async (req, res) => {
  const { id } = req.params;
  const deletedVocabulary = await vocabularyThemeServices.deleteById(id);
  
  if (!deletedVocabulary) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Vocabulary not found');
  }

  res.json(true);
};

const count = async (req, res) => {
  const count = await vocabularyThemeServices.count(req.query);
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

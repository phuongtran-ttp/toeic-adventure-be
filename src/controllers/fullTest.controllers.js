const getQueryParams = require('../utils/getQueryParams');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const fullTestServices = require('../services/fullTest.services');

const find = async (req, res) => {
  const { filter, options } = getQueryParams(req);
  options.select = '-questions -jsonFile';
  options.populate = 'testCollection';
  const resultPage = await fullTestServices.findPage(filter, options);
  return res.json(resultPage);
};

const findOne = async (req, res) => {
  const { id } = req.params;
  const fullTest = await fullTestServices.findById(id, {
    populate: 'jsonFile testCollection',
    select: '-questions',
  });

  if (!fullTest) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Test not found');
  }

  return res.json(fullTest.toJSON());
};

const create = async (req, res) => {
  const fullTest = await fullTestServices.create(req.body, {
    select: { questions: 0 },
    populate: 'testCollection',
  });
  return res.status(httpStatus.CREATED).json(fullTest.toJSON());
};

const update = async (req, res) => {
  const { id: fullTestId } = req.params;
  const fullTest = await fullTestServices.updateById(
    fullTestId,
    req.body,
    {
      populate: 'jsonFile',
      select: { questions: 0 },
    }
  );
  
  if (!fullTest) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Test not found');
  }

  return res.json(fullTest);
};

const deleteOne = async (req, res) => {
  const { id: fullTestId } = req.params;
  const deletedTest = await fullTestServices.deleteById(fullTestId);
  if (!deletedTest) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Test not found');
  }

  res.json(true);
};

const count = async (req, res) => {
  const count = await fullTestServices.count(req.query);
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

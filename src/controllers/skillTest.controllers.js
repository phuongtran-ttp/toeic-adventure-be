const getQueryParams = require('../utils/getQueryParams');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const skillTestServices = require('../services/skillTest.services');

const find = async (req, res) => {
  const { filter, options } = getQueryParams(req);
  options.select = '-questions -jsonFile';
  const resultPage = await skillTestServices.findPage(filter, options);

  return res.json(resultPage);
};

const findOne = async (req, res) => {
  const { id } = req.params;
  const skillTest = await skillTestServices.findById(id, {
    populate: 'jsonFile',
    select: '-questions',
  });

  if (!skillTest) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Test not found');
  }

  return res.json(skillTest.toJSON());
};

const create = async (req, res) => {
  let skillTest = await skillTestServices.create(req.body, {
    select: { questions: 0 },
  });

  return res.status(httpStatus.CREATED).json(skillTest);
};

const update = async (req, res) => {
  const { id: skillTestId } = req.params;
  const skillTest = await skillTestServices.updateById(
    skillTestId,
    req.body,
    {
      populate: 'jsonFile',
      select: { questions: 0 },
    }
  );

  return res.json(skillTest);
};

const deleteOne = async (req, res) => {
  const { id: skillTestId } = req.params;
  const deletedTest = await skillTestServices.deleteById(skillTestId);
  if (!deletedTest) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Test not found');
  }

  res.json(true);
};

const count = async (req, res) => {
  const count = await skillTestServices.count(req.query);
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

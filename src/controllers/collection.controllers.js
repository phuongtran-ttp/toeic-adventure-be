const getQueryParams = require('../utils/getQueryParams');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const collectionServices = require('../services/collection.services');
const fullTestServices = require('../services/fullTest.services');

const find = async (req, res) => {
  const { filter, options } = getQueryParams(req);
  options.populate = 'thumbnail';
  const results = await collectionServices.find(filter, options);
  return res.json({ results });
};

const findOne = async (req, res) => {
  const { id } = req.params;
  let collection = await collectionServices.findById(id, {
    populate: 'thumbnail',
  });
  if (!collection) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Collection not found');
  }

  let fullTestCount = await fullTestServices.countFullTests({
    collectionTest: collection._id,
  });

  collection = collection.toJSON();
  collection.testsCount = fullTestCount;
  return res.json(collection);
};

const create = async (req, res) => {
  const collection = await collectionServices.create(req.body, {
    populate: 'thumbnail',
  });
  return res.status(httpStatus.CREATED).json(collection.toJSON());
};

const update = async (req, res) => {
  const { id } = req.params;
  const collection = await collectionServices.updateById(id, req.body, {
    populate: 'thumbnail',
  });
  if (!collection) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Collection not found');
  }
  
  return res.json(collection.toJSON());
};

const deleteOne = async (req, res) => {
  const { id } = req.params;
  const deletedCollection = await collectionServices.deleteById(id);
  if (!deletedCollection) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Collection not found');
  }

  res.json(true);
};

const count = async (req, res) => {
  const count = await collectionServices.count(req.query);
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

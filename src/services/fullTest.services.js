const FullTest = require('../models/fullTest.model');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const fs = require('fs');
const path = require('path');
const fileServices = require('../services/file.services');

const BASE_UPLOAD_URI = 'uploads/full-tests';

/**
 * Generate name for json file of the full test
 * @param {Object} fullTest 
 * @returns {String}
 */
const generateFileName = (fullTest) => {
  let fileName = fullTest.name.toLowerCase().replace(/ /g, '_');
  return Date.now() + '_' + fileName + '.json';
};

/**
 * Save the full test as a json file
 * @param {Object} fullTest 
 * @returns {Promise<File>}
 */
const saveAsFile = async ({ _id: id }) => {
  const test = await FullTest.findById(id).populate({
    path: 'questions',
    populate: [
      'question.image',
      'question.sound',
      'childs.question.image',
      'childs.question.sound',
    ],
  });

  const fileName = generateFileName(test);
  await fs.promises.writeFile(
    path.join('public', BASE_UPLOAD_URI, fileName),
    JSON.stringify(test.toJSON(), null, 2)
  );

  return await fileServices.createFile({
    name: fileName,
    url: `/${BASE_UPLOAD_URI}/${fileName}`,
    mime: 'application/json',
  });
};

/**
 * Compare two objectId arrays
 * @param {Array<ObjectId>} q1 - First objectId array
 * @param {Array<ObjectId>} q2 - Second objectId array
 * @returns {Boolean}
 */
const isEquals = (q1, q2) => {
  return q1.sort().toString() === q2.sort().toString();
};

/**
 * Create a full test
 * @param {Object} fullTestBody
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<FullTest>}
 */
const create = async (fullTestBody, options = {}) => {
  delete fullTestBody.jsonFile;
  let fullTest = await FullTest.create(fullTestBody);

  // save test as file to cache
  const jsonFile = await saveAsFile(fullTest);
  let update = FullTest.findByIdAndUpdate(fullTest._id, {
    jsonFile: jsonFile._id,
  });
  if (options.populate) {
    update = update.populate(options.populate);
  }
  
  if (options.select) {
    update = update.select(options.select);
  }

  return await update.exec();
};

/**
 * Create full tests
 * @param {Array<Object>} fullTestBodyArray
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Array<FullTest>>}
 */
const createMany = async (fullTestBodyArray, options = {}) => {
  const promises = fullTestBodyArray.map((fullTestBody) => {
    return create(fullTestBody, options);
  });
  return await Promise.all(promises);
};

/**
 * Find full test by id
 * @param {ObjectId} fullTestId
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<FullTest>}
 */
const findById = async (fullTestId, options = {}) => {
  let promise = FullTest.findById(fullTestId);
  if (options.populate) {
    promise = promise.populate(options.populate);
  }

  if (options.select) {
    promise = promise.select(options.select);
  }

  return await promise.exec();
};

/**
 * Find full tests
 * @param {Object} [filter]
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<FullTest>}
 */
 const find = async (filter = {}, options = {}) => {
  let query = FullTest.find(filter);
  if (options.populate) {
    query = query.populate(options.populate);
  }

  if (options.select) {
    query = query.select(options.select);
  }

  return await query.exec();
};

/**
 * Find full tests with pagination
 * @param {Object} [filter] - Mongo filter
 * @param {Object} [options] - Query options
 * @param {Object} [options.select] - Return fields
 * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
 * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
 * @param {number} [options.pageSize] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const findPage = async (filter, options) => {
  const resultPage = await FullTest.findPage(filter, options);
  return resultPage;
};

/**
 * Update full test by id
 * @param {ObjectId} fullTestId
 * @param {Object} updateBody
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<FullTest>}
 */
const updateById = async (fullTestId, updateBody, options = {}) => {
  delete updateBody.jsonFile;
  let fullTest = await findById(fullTestId);
  if (!fullTest) {
    return;
  }

  // if questions is updated, update jsonFile
  if (
    updateBody.questions &&
    !isEquals(updateBody.questions, fullTest.questions)
  ) {
    await fileServices.deleteFileById(fullTest.jsonFile);
    const jsonFile = await saveAsFile(fullTest);
    updateBody.jsonFile = jsonFile._id;
  }

  // updating
  let update = FullTest.findByIdAndUpdate(fullTest._id, updateBody, {
    returnDocument: 'after',
  });

  if (options.select) {
    update = update.select(options.select);
  }

  if (options.populate) {
    update = update.populate(options.populate);
  }

  return await update.exec();
};

/**
 * Delete full test by id
 * @param {ObjectId} fullTestId
 * @returns {Promise<FullTest>}
 */
const deleteById = async (fullTestId) => {
  const fullTest = await FullTest.findByIdAndDelete(fullTestId);
  if (!fullTest) {
    return;
  }
  return fullTest;
};

/**
 * Count full tests by filter
 * @param {Object} filter - Mongo filter
 * @returns {Promise<Number>}
 */
const count = async (filter = {}) => {
  return await FullTest.count(filter);
};

module.exports = {
  create,
  createMany,
  find,
  findById,
  findPage,
  updateById,
  deleteById,
  count,
};

const SkillTest = require('../models/skillTest.model');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const fs = require('fs');
const path = require('path');
const fileServices = require('../services/file.services');

const BASE_UPLOAD_URI = 'uploads/skill-tests';

/**
 * Generate name for json file of the skill test
 * @param {Object} skillTest 
 * @returns {String}
 */
const generateFileName = (skillTest) => {
  let fileName = skillTest.name.toLowerCase().replace(/ /g, '_');
  return Date.now() + '_' + fileName + '.json';
};

/**
 * Save the skill test as a json file
 * @param {Object} skillTest 
 * @returns {Promise<File>}
 */
const saveAsFile = async ({ _id: id }) => {
  const test = await SkillTest.findById(id).populate({
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
 * Create a skill test
 * @param {Object} skillTestBody
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<SkillTest>}
 */
const create = async (skillTestBody, options = {}) => {
  // create new skill test
  delete skillTestBody.jsonFile;
  let skillTest = await SkillTest.create(skillTestBody);

  // save test as file to cache
  const jsonFile = await saveAsFile(skillTest);
  let update = SkillTest.findByIdAndUpdate(skillTest._id, {
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
 * Create skill tests
 * @param {Array<Object>} skillTestBodyArray
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Array<SkillTest>>}
 */
const createMany = async (skillTestBodyArray, options = {}) => {
  // TODO: chuck promise to avoid leak memory
  const promises = skillTestBodyArray.map((skillTestBody) => {
    return create(skillTestBody, options);
  });
  return await Promise.all(promises);
};

/**
 * Get skill test by id
 * @param {ObjectId} skillTestId
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<SkillTest>}
 */
const findById = async (skillTestId, options = {}) => {
  let promise = SkillTest.findById(skillTestId);
  if (options.populate) {
    promise = promise.populate(options.populate);
  }

  if (options.select) {
    promise = promise.select(options.select);
  }

  return await promise.exec();
};

/**
 * Find skill tests
 * @param {Object} [filter]
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<SkillTest>}
 */
 const find = async (filter = {}, options = {}) => {
  let query = SkillTest.find(filter);
  if (options.populate) {
    query = query.populate(options.populate);
  }

  if (options.select) {
    query = query.select(options.select);
  }

  return await query.exec();
};


/**
 * Find skill tests with pagination
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
  const resultPage = await SkillTest.findPage(filter, options);
  return resultPage;
};

/**
 * Update skill test by id
 * @param {ObjectId} skillTestId
 * @param {Object} updateBody
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<SkillTest>}
 */
const updateById = async (skillTestId, updateBody, options = {}) => {
  delete updateBody.jsonFile;
  let skillTest = await findById(skillTestId);
  if (!skillTest) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Skill test not found');
  }

  // if questions is updated, update jsonFile
  if (
    updateBody.questions &&
    !isEquals(updateBody.questions, skillTest.questions)
  ) {
    await fileServices.deleteFileById(skillTest.jsonFile);
    const jsonFile = await saveAsFile(skillTest);
    updateBody.jsonFile = jsonFile._id;
  }

  // updating
  let update = SkillTest.findByIdAndUpdate(skillTest._id, updateBody, {
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
 * Delete skill test by id
 * @param {ObjectId} skillTestId
 * @returns {Promise<SkillTest>}
 */
const deleteById = async (skillTestId) => {
  const skillTest = await SkillTest.findByIdAndDelete(skillTestId);
  if (!skillTest) {
    return;
  }
  return skillTest;
};

/**
 * Count skill tests by filter
 * @param {Object} filter - Mongo filter
 * @returns {Promise<Number>}
 */
const count = async (filter = {}) => {
  return await SkillTest.count(filter);
};

module.exports = {
  create,
  createMany,
  findById,
  find,
  findPage,
  updateById,
  deleteById,
  count,
};

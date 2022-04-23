const Question = require('../models/question.model');

/**
 * Create a question
 * @param {Object} questionBody
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Question>}
 */
const create = async (questionBody, options = {}) => {
  const question = await Question.create(questionBody);
  // TODO: need check whether options is empty or not
  promise = Question.findById(question._id);
  if (options.select) {
    promise = promise.select(options.select);
  }

  if (options.populate) {
    promise = promise.populate(options.populate);
  }

  return await promise.exec();
};

/**
 * Create questions
 * @param {Array<Object>} questionBodyArray
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Array<Question>>}
 */
const createMany = async (questionBodyArray, options = {}) => {
  // TODO: chuck promises to avoid leak memory
  const promises = questionBodyArray.map((questionBody) => {
    return create(questionBody, options);
  });
  return await Promise.all(promises);
};


/**
 * Find question by id
 * @param {ObjectId} questionId
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Question>}
 */
 const findById = async (questionId, options = {}) => {
  let promise = Question.findById(questionId);
  if (options.populate) {
    promise = promise.populate(options.populate);
  }

  if (options.select) {
    promise = promise.select(options.select);
  }

  return await promise.exec();
};

/**
 * Find questions
 * @param {Object} [filter]
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Question>}
 */
 const find = async (filter = {}, options = {}) => {
  let query = Question.find(filter);
  if (options.populate) {
    query = query.populate(options.populate);
  }

  if (options.select) {
    query = query.select(options.select);
  }

  return await query.exec();
};

/**
 * Query for questions with pagination
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
  const resultPage = await Question.findPage(filter, options);
  return resultPage;
};

/**
 * Update question by id
 * @param {ObjectId} questionId
 * @param {Object} updateBody
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Question>}
 */
 const updateById = async (questionId, updateBody, options = {}) => {
  let update = Question.findByIdAndUpdate(questionId, updateBody, {
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
 * Delete question by id
 * @param {ObjectId} questionId
 * @returns {Promise<Question>}
 */
const deleteById = async (questionId) => {
  const question = await Question.findByIdAndDelete(questionId);
  if (!question) {
    return;
  }

  return question;
};

/**
 * Count question by filter
 * @param {Object} filter - Mongo filter
 * @returns {Promise<Number>}
 */
const count = async (filter = {}) => {
  return await Question.count(filter);
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
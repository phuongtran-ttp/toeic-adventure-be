const LessonTopic = require('../models/lessonTopic.model');

/**
 * Create a lesson topic
 * @param {Object} topicBody
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<LessonTopic>}
 */
const create = async (topicBody, options = {}) => {
  let topic = await LessonTopic.create(topicBody);
  // TODO: need check whether options is empty or not
  promise = LessonTopic.findById(topic._id);
  if (options.populate) {
    promise = promise.populate(options.populate);
  }
  
  if (options.select) {
    promise = promise.select(options.select);
  }

  return await promise.exec();
};

/**
 * Create many lesson topic
 * @param {Array<Object>} topicBodyArray
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Array<LessonTopic>>}
 */
const createMany = async (topicBodyArray, options = {}) => {
  // TODO: chuck promises to avoid leak memory
  const promises = topicBodyArray.map((topicBody) => {
    return create(topicBody, options);
  });
  return await Promise.all(promises);
};

/**
 * Find lesson topic by id
 * @param {ObjectId} topicId
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<LessonTopic>}
 */
const findById = async (topicId, options = {}) => {
  let promise = LessonTopic.findById(topicId);
  if (options.populate) {
    promise = promise.populate(options.populate);
  }

  if (options.select) {
    promise = promise.select(options.select);
  }

  return await promise.exec();
};

/**
 * Find lesson topics
 * @param {Object} [filter]
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<LessonTopic>}
 */
 const find = async (filter = {}, options = {}) => {
  let query = LessonTopic.find(filter);
  if (options.populate) {
    query = query.populate(options.populate);
  }

  if (options.select) {
    query = query.select(options.select);
  }

  return await query.exec();
};

/**
 * Find lesson topic with pagination
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
  const resultPage = await LessonTopic.findPage(filter, options);
  return resultPage;
};

/**
 * Update lesson topic by id
 * @param {ObjectId} topicId
 * @param {Object} updateBody
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<LessonTopic>}
 */
const updateById = async (topicId, updateBody, options = {}) => {
  let update = LessonTopic.findByIdAndUpdate(topicId, updateBody, {
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
 * Delete lesson topic by id
 * @param {ObjectId} topicId
 * @returns {Promise<LessonTopic>}
 */
const deleteById = async (topicId) => {
  const topic = await LessonTopic.findByIdAndDelete(topicId);
  if (!topic) {
    return;
  }

  return topic;
};

/**
 * Count lesson topic by filter
 * @param {Object} filter - Mongo filter
 * @returns {Promise<Number>}
 */
const count = async (filter = {}) => {
  return await LessonTopic.count(filter);
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

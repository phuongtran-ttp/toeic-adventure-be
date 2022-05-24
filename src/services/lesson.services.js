const Lesson = require('../models/lesson.model');

/**
 * Create a lesson
 * @param {Object} lessonBody
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Lesson>}
 */
const create = async (lessonBody, options = {}) => {
  let lesson = await Lesson.create(lessonBody);

  // TODO: need check whether options is empty or not
  promise = Lesson.findById(lesson._id);
  if (options.populate) {
    promise = promise.populate(options.populate);
  }
  
  if (options.select) {
    promise = promise.select(options.select);
  }

  return await promise.exec();
};

/**
 * Create many lessons
 * @param {Array<Object>} lessonBodyArray
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Array<Lesson>>}
 */
const createMany = async (lessonBodyArray, options = {}) => {
  // TODO: chuck promises to avoid leak memory
  const promises = lessonBodyArray.map((lessonBody) => {
    return create(lessonBody, options);
  });
  return await Promise.all(promises);
};

/**
 * Find lesson by id
 * @param {ObjectId} lessonId
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Lesson>}
 */
const findById = async (lessonId, options = {}) => {
  let promise = Lesson.findById(lessonId);
  if (options.populate) {
    promise = promise.populate(options.populate);
  }

  if (options.select) {
    promise = promise.select(options.select);
  }

  return await promise.exec();
};

/**
 * Find lessons
 * @param {Object} [filter]
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Lesson>}
 */
 const find = async (filter = {}, options = {}) => {
  let query = Lesson.find(filter);
  if (options.populate) {
    query = query.populate(options.populate);
  }

  if (options.select) {
    query = query.select(options.select);
  }

  return await query.exec();
};

/**
 * Find lessons with pagination
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
  const resultPage = await Lesson.findPage(filter, options);
  return resultPage;
};

/**
 * Update lesson by id
 * @param {ObjectId} lessonId
 * @param {Object} updateBody
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Lesson>}
 */
const updateById = async (lessonId, updateBody, options = {}) => {
  let update = Lesson.findByIdAndUpdate(lessonId, updateBody, {
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
 * Delete lesson by id
 * @param {ObjectId} lessonId
 * @returns {Promise<Lesson>}
 */
const deleteById = async (lessonId) => {
  const lesson = await Lesson.findByIdAndDelete(lessonId);
  if (!lesson) {
    return;
  }

  return lesson;
};

/**
 * Count lesson by filter
 * @param {Object} filter - Mongo filter
 * @returns {Promise<Number>}
 */
const count = async (filter = {}) => {
  return await Lesson.count(filter);
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

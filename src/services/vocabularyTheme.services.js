const VocabularyTheme = require('../models/vocabularyTheme.model');

/**
 * Create a vocabulary theme
 * @param {Object} themeBody
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<VocabularyTheme>}
 */
const create = async (themeBody, options = {}) => {
  let theme = await VocabularyTheme.create(themeBody);
  // TODO: need check whether options is empty or not
  promise = VocabularyTheme.findById(theme._id);
  if (options.populate) {
    promise = promise.populate(options.populate);
  }
  
  if (options.select) {
    promise = promise.select(options.select);
  }

  return await promise.exec();
};

/**
 * Create many vocabulary theme
 * @param {Array<Object>} themeBodyArray
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Array<VocabularyTheme>>}
 */
const createMany = async (themeBodyArray, options = {}) => {
  // TODO: chuck promises to avoid leak memory
  const promises = themeBodyArray.map((themeBody) => {
    return create(themeBody, options);
  });
  return await Promise.all(promises);
};

/**
 * Find vocabulary theme by id
 * @param {ObjectId} themeId
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<VocabularyTheme>}
 */
const findById = async (themeId, options = {}) => {
  let promise = VocabularyTheme.findById(themeId);
  if (options.populate) {
    promise = promise.populate(options.populate);
  }

  if (options.select) {
    promise = promise.select(options.select);
  }

  return await promise.exec();
};

/**
 * Find vocabulary themes
 * @param {Object} [filter]
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<VocabularyTheme>}
 */
 const find = async (filter = {}, options = {}) => {
  let query = VocabularyTheme.find(filter);
  if (options.populate) {
    query = query.populate(options.populate);
  }

  if (options.select) {
    query = query.select(options.select);
  }

  return await query.exec();
};

/**
 * Find vocabulary theme with pagination
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
  const resultPage = await VocabularyTheme.findPage(filter, options);
  return resultPage;
};

/**
 * Update vocabulary theme by id
 * @param {ObjectId} themeId
 * @param {Object} updateBody
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<VocabularyTheme>}
 */
const updateById = async (themeId, updateBody, options = {}) => {
  let update = VocabularyTheme.findByIdAndUpdate(themeId, updateBody, {
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
 * Delete vocabulary theme by id
 * @param {ObjectId} themeId
 * @returns {Promise<VocabularyTheme>}
 */
const deleteById = async (themeId) => {
  const vocabulary = await VocabularyTheme.findByIdAndDelete(themeId);
  if (!vocabulary) {
    return;
  }

  return vocabulary;
};

/**
 * Count vocabulary theme by filter
 * @param {Object} filter - Mongo filter
 * @returns {Promise<Number>}
 */
const count = async (filter = {}) => {
  return await VocabularyTheme.count(filter);
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

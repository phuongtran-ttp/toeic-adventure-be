const skillTestHistoryModel = require('../models/skillTestHistory.model');
const SkillTestHistory = require('../models/skillTestHistory.model');

/**
 * Create a history
 * @param {Object} historyBody
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<SkillTestHistory>}
 */
const create = async (historyBody, options = {}) => {
  let history = await SkillTestHistory.create(historyBody);
  // TODO: need check whether options is empty or not
  promise = SkillTestHistory.findById(history._id);
  if (options.populate) {
    promise = promise.populate(options.populate);
  }
  
  if (options.select) {
    promise = promise.select(options.select);
  }

  return await promise.exec();
};

/**
 * Create many historys
 * @param {Array<Object>} historyBodyArray
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Array<SkillTestHistory>>}
 */
const createMany = async (historyBodyArray, options = {}) => {
  // TODO: chuck promises to avoid leak memory
  const promises = historyBodyArray.map((historyBody) => {
    return create(historyBody, options);
  });
  return await Promise.all(promises);
};

/**
 * Find history by id
 * @param {ObjectId} historyId
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<SkillTestHistory>}
 */
const findById = async (historyId, options = {}) => {
  let promise = SkillTestHistory.findById(historyId);
  if (options.populate) {
    promise = promise.populate(options.populate);
  }

  if (options.select) {
    promise = promise.select(options.select);
  }

  return await promise.exec();
};

/**
 * Find historys
 * @param {Object} [filter]
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<SkillTestHistory>}
 */
 const find = async (filter = {}, options = {}) => {
  let query = SkillTestHistory.find(filter);
  if (options.populate) {
    query = query.populate(options.populate);
  }

  if (options.select) {
    query = query.select(options.select);
  }

  return await query.exec();
};

/**
 * Find historys with pagination
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
  const resultPage = await SkillTestHistory.findPage(filter, options);
  return resultPage;
};

/**
 * Find one history
 * @param {Object} filter
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @param {Object | String | Array} [options.sort]
 * @returns {Promise<User>}
 */
 const findOne = async (filter, options = {}) => {
  let promise = SkillTestHistory.findOne(filter);
  if (options.populate) {
    promise = promise.populate(options.populate);
  }

  if (options.select) {
    promise = promise.select(options.select);
  }

  if (options.sort) {
    promise = promise.sort(options.sort);
  }

  return await promise.exec();
};

/**
 * Update history by id
 * @param {ObjectId} historyId
 * @param {Object} updateBody
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<SkillTestHistory>}
 */
const updateById = async (historyId, updateBody, options = {}) => {
  let update = SkillTestHistory.findByIdAndUpdate(historyId, updateBody, {
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
 * Delete history by id
 * @param {ObjectId} historyId
 * @returns {Promise<SkillTestHistory>}
 */
const deleteById = async (historyId) => {
  const history = await SkillTestHistory.findByIdAndDelete(historyId);
  if (!history) {
    return;
  }

  return history;
};

/**
 * Count history by filter
 * @param {Object} filter - Mongo filter
 * @returns {Promise<Number>}
 */
const count = async (filter = {}) => {
  return await SkillTestHistory.count(filter);
};


const countDoneTest = async (userId) => {
  const doneTest = await skillTestHistoryModel.find({ user: userId }).distinct('test');
  return doneTest.length;
}

module.exports = {
  create,
  createMany,
  findById,
  find,
  findPage,
  findOne,
  updateById,
  deleteById,
  count,
  countDoneTest,
};

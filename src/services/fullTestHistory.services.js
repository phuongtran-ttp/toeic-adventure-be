const fullTestHistoryModel = require('../models/fullTestHistory.model');
const FullTestHistory = require('../models/fullTestHistory.model');
const mongoose = require('mongoose');

/**
 * Create a history
 * @param {Object} historyBody
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<FullTestHistory>}
 */
const create = async (historyBody, options = {}) => {
  let history = await FullTestHistory.create(historyBody);
  // TODO: need check whether options is empty or not
  promise = FullTestHistory.findById(history._id);
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
 * @returns {Promise<Array<FullTestHistory>>}
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
 * @returns {Promise<FullTestHistory>}
 */
const findById = async (historyId, options = {}) => {
  let promise = FullTestHistory.findById(historyId);
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
 * @returns {Promise<FullTestHistory>}
 */
 const find = async (filter = {}, options = {}) => {
  let query = FullTestHistory.find(filter);
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
  const resultPage = await FullTestHistory.findPage(filter, options);
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
  let promise = FullTestHistory.findOne(filter);
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
 * @returns {Promise<FullTestHistory>}
 */
const updateById = async (historyId, updateBody, options = {}) => {
  let update = FullTestHistory.findByIdAndUpdate(historyId, updateBody, {
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
 * @returns {Promise<FullTestHistory>}
 */
const deleteById = async (historyId) => {
  const history = await FullTestHistory.findByIdAndDelete(historyId);
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
  return await FullTestHistory.count(filter);
};

const calcReadingScore = (correctSentences) => {
  correctSentences = parseInt(correctSentences);
  let score = 0;
  const add10 = [30, 39, 40, 47, 49, 51, 52, 53, 57, 58, 63, 71, 79, 81, 83, 86, 87, 90, 92, 95, 97];
  for (let i = 1; i <= correctSentences; i++) {
    if (add10.includes(i)) {
      score += 10;
      continue;
    }

    if (i === 69 || i === 98 || (i >= 2 && i <= 21)) {
      continue;
    }

    score += 5;
  }

  return score;
};

const calcListeningScore = (correctSentences) => {
  correctSentences = parseInt(correctSentences);
  let score = 0;
  const add10 = [29, 30, 36, 37, 38, 40, 41, 42, 45, 46, 48, 53, 54, 57, 58, 62, 63, 75, 76, 79, 86, 89];
  for (let i = 1; i <= correctSentences; i++) {
    if (add10.includes(i)) {
      score += 10;
      continue;
    }

    if (i >= 94 || (i >= 2 && i <= 17)) {
      continue;
    }

    score += 5;
  }

  return score;
};

const countDoneTest = async (userId) => {
  const doneTest = await fullTestHistoryModel.find({ user: userId }).distinct('test');
  return doneTest.length;
};

const predictScore = async (userId) => {
  let oneMonthBefore = new Date();
  oneMonthBefore.setMonth(oneMonthBefore.getMonth() - 1);
  const result = await fullTestHistoryModel.aggregate([
    { $match: { user: { $eq: mongoose.Types.ObjectId(userId) }, createdAt: { $gte: oneMonthBefore } }},
    { $group: { _id: null, average: { $avg: '$totalScore' } } },
  ]);

  const averageScore = result[0].average;
  const roundedScore = Math.round(averageScore / 5) * 5;
  return roundedScore;
};

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
  calcReadingScore,
  calcListeningScore,
  countDoneTest,
  predictScore
};

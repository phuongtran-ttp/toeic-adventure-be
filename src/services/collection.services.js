const Collection = require('../models/collection.model');

/**
 * Create a collection
 * @param {Object} collectionBody
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Collection>}
 */
const create = async (collectionBody, options = {}) => {
  let collection = await Collection.create(collectionBody);
  // TODO: need check whether options is empty or not
  promise = Collection.findById(collection._id);
  if (options.populate) {
    promise = promise.populate(options.populate);
  }
  
  if (options.select) {
    promise = promise.select(options.select);
  }

  return await promise.exec();
};

/**
 * Create many collections
 * @param {Array<Object>} collectionBodyArray
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Array<Collection>>}
 */
const createMany = async (collectionBodyArray, options = {}) => {
  // TODO: chuck promises to avoid leak memory
  const promises = collectionBodyArray.map((collectionBody) => {
    return create(collectionBody, options);
  });
  return await Promise.all(promises);
};

/**
 * Find collection by id
 * @param {ObjectId} collectionId
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Collection>}
 */
const findById = async (collectionId, options = {}) => {
  let promise = Collection.findById(collectionId);
  if (options.populate) {
    promise = promise.populate(options.populate);
  }

  if (options.select) {
    promise = promise.select(options.select);
  }

  return await promise.exec();
};

/**
 * Find collections
 * @param {Object} [filter]
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Collection>}
 */
 const find = async (filter = {}, options = {}) => {
  let query = Collection.find(filter);
  if (options.populate) {
    query = query.populate(options.populate);
  }

  if (options.select) {
    query = query.select(options.select);
  }

  return await query.exec();
};

/**
 * Find collections with pagination
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
  const resultPage = await Collection.findPage(filter, options);
  return resultPage;
};

/**
 * Update collection by id
 * @param {ObjectId} collectionId
 * @param {Object} updateBody
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Collection>}
 */
const updateById = async (collectionId, updateBody, options = {}) => {
  let update = Collection.findByIdAndUpdate(collectionId, updateBody, {
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
 * Delete collection by id
 * @param {ObjectId} collectionId
 * @returns {Promise<Collection>}
 */
const deleteById = async (collectionId) => {
  const collection = await Collection.findByIdAndDelete(collectionId);
  if (!collection) {
    return;
  }

  return collection;
};

/**
 * Count collection by filter
 * @param {Object} filter - Mongo filter
 * @returns {Promise<Number>}
 */
const count = async (filter = {}) => {
  return await Collection.count(filter);
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

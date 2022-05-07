const Code = require('../models/code.model');

/**
 * Create a code
 * @param {Object} codeBody
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Code>}
 */
const create = async (codeBody, options = {}) => {
  let code = await Code.create(codeBody);
  // TODO: need check whether options is empty or not
  promise = Code.findById(code._id);
  if (options.populate) {
    promise = promise.populate(options.populate);
  }
  
  if (options.select) {
    promise = promise.select(options.select);
  }

  return await promise.exec();
};

/**
 * Create many codes
 * @param {Array<Object>} codeBodyArray
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Array<Code>>}
 */
const createMany = async (codeBodyArray, options = {}) => {
  // TODO: chuck promises to avoid leak memory
  const promises = codeBodyArray.map((codeBody) => {
    return create(codeBody, options);
  });
  return await Promise.all(promises);
};

/**
 * Find code by id
 * @param {ObjectId} codeId
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Code>}
 */
const findById = async (codeId, options = {}) => {
  let promise = Code.findById(codeId);
  if (options.populate) {
    promise = promise.populate(options.populate);
  }

  if (options.select) {
    promise = promise.select(options.select);
  }

  return await promise.exec();
};

/**
 * Find codes
 * @param {Object} [filter]
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Code>}
 */
 const find = async (filter = {}, options = {}) => {
  let query = Code.find(filter);
  if (options.populate) {
    query = query.populate(options.populate);
  }

  if (options.select) {
    query = query.select(options.select);
  }

  return await query.exec();
};

/**
 * Find one code
 * @param {Object} filter
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<User>}
 */
 const findOne = async (filter, options = {}) => {
  let promise = Code.findOne(filter);
  if (options.populate) {
    promise = promise.populate(options.populate);
  }

  if (options.select) {
    promise = promise.select(options.select);
  }

  return await promise.exec();
};

/**
 * Update code by id
 * @param {ObjectId} codeId
 * @param {Object} updateBody
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Code>}
 */
const updateById = async (codeId, updateBody, options = {}) => {
  let update = Code.findByIdAndUpdate(codeId, updateBody, {
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
 * Delete code by id
 * @param {ObjectId} codeId
 * @returns {Promise<Code>}
 */
const deleteById = async (codeId) => {
  const code = await Code.findByIdAndDelete(codeId);
  if (!code) {
    return;
  }

  return code;
};


module.exports = {
  create,
  createMany,
  findById,
  find,
  findOne,
  updateById,
  deleteById,
};

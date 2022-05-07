const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { nanoid } = require('nanoid');
const roleServices = require('../services/role.services');
const DEFAULT_ROLE_NAME = 'Authenticated';

/**
 * Create a user
 * @param {Object} userBody
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<User>}
 */
const create = async (userBody, options = {}) => {
  // check whether email is taken or not
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  // set default role if params does not have
  if (!userBody.role) {
    const role = await roleServices.findOne({
      name: DEFAULT_ROLE_NAME,
    });

    userBody.role = role.id;
  }
  
  userBody.resetPasswordToken = nanoid(128);
  userBody.verifyEmailToken = nanoid(128);
  let user = await User.create(userBody);
  // TODO: need check whether options is empty or not
  return await findById(user._id, options);
};

/**
 * Create many users
 * @param {Array<Object>} userBodyArray
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Array<User>>}
 */
const createMany = async (userBodyArray, options = {}) => {
  // TODO: chuck promises to avoid leak memory
  const promises = userBodyArray.map((userBody) => {
    return create(userBody, options);
  });
  return await Promise.all(promises);
};

/**
 * Find user by id
 * @param {ObjectId} userId
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<User>}
 */
const findById = async (userId, options = {}) => {
  let promise = User.findById(userId);
  if (options.populate) {
    promise = promise.populate(options.populate);
  }

  if (options.select) {
    promise = promise.select(options.select);
  }

  return await promise.exec();
};

/**
 * Find one role
 * @param {Object} filter
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<User>}
 */
 const findOne = async (filter, options = {}) => {
  let promise = User.findOne(filter);
  if (options.populate) {
    promise = promise.populate(options.populate);
  }

  if (options.select) {
    promise = promise.select(options.select);
  }

  return await promise.exec();
};

/**
 * Find users
 * @param {Object} [filter]
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<User>}
 */
 const find = async (filter = {}, options = {}) => {
  let query = User.find(filter);
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
  const resultPage = await User.findPage(filter, options);
  return resultPage;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<User>}
 */
const updateById = async (userId, updateBody, options = {}) => {
  let update = User.findByIdAndUpdate(userId, updateBody, {
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
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteById = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    return;
  }

  return user;
};

/**
 * Count user by filter
 * @param {Object} filter - Mongo filter
 * @returns {Promise<Number>}
 */
const count = async (filter = {}) => {
  return await User.count(filter);
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
  findOne,
};

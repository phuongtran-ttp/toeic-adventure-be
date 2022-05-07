const Role = require('../models/role.model');

/**
 * Create a role
 * @param {Object} roleBody
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Role>}
 */
const create = async (roleBody, options = {}) => {
  let role = await Role.create(roleBody);
  // TODO: need check whether options is empty or not
  return await findById(role._id, options);
};

/**
 * Create many roles
 * @param {Array<Object>} roleBodyArray
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Array<Role>>}
 */
const createMany = async (roleBodyArray, options = {}) => {
  // TODO: chuck promises to avoid leak memory
  const promises = roleBodyArray.map((roleBody) => {
    return create(roleBody, options);
  });
  return await Promise.all(promises);
};

/**
 * Find role by id
 * @param {ObjectId} roleId
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Role>}
 */
const findById = async (roleId, options = {}) => {
  let promise = Role.findById(roleId);
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
 * @returns {Promise<Role>}
 */
 const findOne = async (filter, options = {}) => {
  let promise = Role.findOne(filter);
  if (options.populate) {
    promise = promise.populate(options.populate);
  }

  if (options.select) {
    promise = promise.select(options.select);
  }

  return await promise.exec();
};

/**
 * Find roles
 * @param {Object} [filter]
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Role>}
 */
 const find = async (filter = {}, options = {}) => {
  let query = Role.find(filter);
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
  const resultPage = await Role.findPage(filter, options);
  return resultPage;
};

/**
 * Update role by id
 * @param {ObjectId} roleId
 * @param {Object} updateBody
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Role>}
 */
const updateById = async (roleId, updateBody, options = {}) => {
  let update = Role.findByIdAndUpdate(roleId, updateBody, {
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
 * Delete role by id
 * @param {ObjectId} roleId
 * @returns {Promise<Role>}
 */
const deleteById = async (roleId) => {
  const role = await Role.findByIdAndDelete(roleId);
  if (!role) {
    return;
  }

  return role;
};

/**
 * Count role by filter
 * @param {Object} filter - Mongo filter
 * @returns {Promise<Number>}
 */
const count = async (filter = {}) => {
  return await Role.count(filter);
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

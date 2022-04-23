const fs = require('fs');
const path = require('path');
const File = require('../models/file.model');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');

/**
 * Create a file
 * @param {Object} fileBody
 * @param {Object | String | Array} populate
 * @returns {Promise<File>}
 */
const createFile = async (fileBody, populate) => {
  let newFile = await File.create(fileBody);
  if (populate) {
    newFile = await Question.populate(newFile, populate);
  }
  return newFile;
};

/**
 * Create files
 * @param {Array<Object>} fileBodyArray
 * @param {Object | String | Array} populate
 * @returns {Promise<Array<File>>}
 */
const createFiles = async (fileBodyArray, populate) => {
  const promises = fileBodyArray.map((fileBody) => {
    return createFile(fileBody, populate);
  });
  return await Promise.all(promises);
};

/**
 * Get file by id
 * @param {ObjectId} fileId
 * @returns {Promise<File>}
 */
const findFileById = async (fileId) => {
  return await File.findById(fileId);
};

/**
 * Query for files with pagination
 * @param {Object} [filter] - Mongo filter
 * @param {Object} [options] - Query options
 * @param {Object} [options.select] - Return fields
 * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
 * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
 * @param {number} [options.pageSize] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryFiles = async (filter, options) => {
  const resultPage = await File.findPage(filter, options);
  return resultPage;
};

/**
 * Delete file by id
 * @param {ObjectId} fileId
 * @returns {Promise<File>}
 */
 const deleteFileById = async (fileId) => {
  const file = await File.findByIdAndDelete(fileId);
  if (!file) {
    return;
  }

  const filePath = path.join('public', file.url);
  if (fs.existsSync(filePath)) {
    await fs.promises.unlink(filePath);
  }

  return file;
};

module.exports = {
  createFile,
  createFiles,
  findFileById,
  queryFiles,
  deleteFileById,
};
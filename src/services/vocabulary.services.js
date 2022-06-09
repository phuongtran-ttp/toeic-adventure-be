const Vocabulary = require('../models/vocabulary.model');
const VocabularyTheme = require('../models/vocabularyTheme.model');
const https = require('https');
const fs = require('fs');
const path = require('path');

/**
 * Create a vocabulary
 * @param {Object} vocabularyBody
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Vocabulary>}
 */
const create = async (vocabularyBody, options = {}) => {
  let vocabulary = await Vocabulary.create(vocabularyBody);
  
  // increment word count by 1
  await VocabularyTheme.findOneAndUpdate({_id: vocabularyBody.theme}, {$inc : {'wordCount' : 1}});

  // TODO: need check whether options is empty or not
  promise = Vocabulary.findById(vocabulary._id);
  if (options.populate) {
    promise = promise.populate(options.populate);
  }
  
  if (options.select) {
    promise = promise.select(options.select);
  }

  return await promise.exec();
};

/**
 * Create many vocabularies
 * @param {Array<Object>} vocabularyBodyArray
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Array<Vocabulary>>}
 */
const createMany = async (vocabularyBodyArray, options = {}) => {
  // TODO: chuck promises to avoid leak memory
  const promises = vocabularyBodyArray.map((vocabularyBody) => {
    return create(vocabularyBody, options);
  });
  return await Promise.all(promises);
};

/**
 * Find vocabulary by id
 * @param {ObjectId} vocabularyId
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Vocabulary>}
 */
const findById = async (vocabularyId, options = {}) => {
  let promise = Vocabulary.findById(vocabularyId);
  if (options.populate) {
    promise = promise.populate(options.populate);
  }

  if (options.select) {
    promise = promise.select(options.select);
  }

  return await promise.exec();
};

/**
 * Find vocabularies
 * @param {Object} [filter]
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Vocabulary>}
 */
 const find = async (filter = {}, options = {}) => {
  let query = Vocabulary.find(filter);
  if (options.populate) {
    query = query.populate(options.populate);
  }

  if (options.select) {
    query = query.select(options.select);
  }

  return await query.exec();
};

/**
 * Find vocabularies with pagination
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
  const resultPage = await Vocabulary.findPage(filter, options);
  return resultPage;
};

/**
 * Update vocabulary by id
 * @param {ObjectId} vocabularyId
 * @param {Object} updateBody
 * @param {Object} [options]
 * @param {Object | String | Array} [options.populate]
 * @param {Object | String | Array} [options.select]
 * @returns {Promise<Vocabulary>}
 */
const updateById = async (vocabularyId, updateBody, options = {}) => {
  let update = Vocabulary.findByIdAndUpdate(vocabularyId, updateBody, {
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
 * Delete vocabulary by id
 * @param {ObjectId} vocabularyId
 * @returns {Promise<Vocabulary>}
 */
const deleteById = async (vocabularyId) => {
  const vocabulary = await Vocabulary.findByIdAndDelete(vocabularyId);
  if (!vocabulary) {
    return;
  }

  return vocabulary;
};

/**
 * Count vocabulary by filter
 * @param {Object} filter - Mongo filter
 * @returns {Promise<Number>}
 */
const count = async (filter = {}) => {
  return await Vocabulary.count(filter);
};

const leechAudio = (word) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(`./public/uploads/audio/${word}.mp3`);
    https.get(`https://vtudien.com/doc/anh/${word}.mp3`, function(res) {
      if (res.statusCode !== 200) {
        reject();
      }

      res.pipe(file);
  
      // after download completed close filestream
      file.on('finish', () => {
          file.close();
          resolve();
      });
    });
  });
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
  leechAudio,
};

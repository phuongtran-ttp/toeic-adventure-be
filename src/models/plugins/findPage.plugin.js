/* eslint-disable no-param-reassign */

const findPage = (schema) => {
  /**
   * @typedef {Object} QueryResult
   * @property {Document[]} results - Results found
   * @property {Object} pagination - Pagination info
   * @property {number} pagination.page - Current page
   * @property {number} pagination.pageSize - Maximum number of results per page
   * @property {number} pagination.pageCount - Total number of pages
   * @property {number} pagination.total - Total number of documents
   */
  /**
   * Query for documents with pagination
   * @param {Object} [filter] - Mongo filter
   * @param {Object} [options] - Query options
   * @param {Object} [options.select] - Return fields
   * @param {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
   * @param {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
   * @param {number} [options.pageSize] - Maximum number of results per page (default = 10)
   * @param {number} [options.page] - Current page (default = 1)
   * @returns {Promise<QueryResult>}
   */
  schema.statics.findPage = async function (filter = {}, options = {}) {
    let sort = {};
    if (options.sortBy) {
      const sortingCriteria = [];
      options.sortBy.split(',').forEach((sortOption) => {
        const [key, order] = sortOption.split(':');
        sortingCriteria.push((order === 'desc' ? '-' : '') + key);
      });
      sort = sortingCriteria.join(' ');
    } else {
      sort = {
        createdAt: -1,
      };
    }

    const limit = options.pageSize && parseInt(options.pageSize, 10) > 0 ? parseInt(options.pageSize, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

    if (options.select && options.select !== '*') {
      docsPromise = docsPromise.select(options.select);
    }

    if (options.populate) {
      docsPromise = docsPromise.populate(options.populate);
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);
      const result = {
        results,
        pagination: {
          page,
          pageSize: limit,
          pageCount: totalPages,
          total: totalResults
        },
      };
      return Promise.resolve(result);
    });
  };
};

module.exports = findPage;

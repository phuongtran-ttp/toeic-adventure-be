/**
 * @typedef {Object} QueryParams
 * @property {Object} filter - Query filter
 * @property {Object} [options] - Query options
 * @property {string} [options.sortBy] - Sorting criteria using the format: sortField:(desc|asc). Multiple sorting criteria should be separated by commas (,)
 * @property {string} [options.populate] - Populate data fields. Hierarchy of fields should be separated by (.). Multiple populating criteria should be separated by commas (,)
 * @property {number} [options.pageSize] - Maximum number of results per page (default = 10)
 * @property {number} [options.page] - Current page (default = 1)
 */
/**
 * Get query params from request
 * @param {Object} reg - Express request
 * @returns {QueryParams}
 */
const getQueryParams = (req) => {
  if (!req || !req.query) {
    return {
      filter: {},
      options: {
        page: 1,
        pageSize: 10,
      },
    };
  }

  const { page, pageSize, ...filter } = req.query;
  const options = { page, pageSize };
  if (filter.sortBy) {
    options.sortBy = filter.sortBy;
    delete filter.sortBy;
  }


  if (filter.populate) {
    options.populate = filter.populate;
    delete filter.populate;
  }

  return {
    filter,
    options,
  };
};

module.exports = getQueryParams;
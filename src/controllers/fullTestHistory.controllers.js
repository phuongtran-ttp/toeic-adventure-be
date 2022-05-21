const getQueryParams = require('../utils/getQueryParams');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const historyServices = require('../services/fullTestHistory.services');

const find = async (req, res) => {
  const { filter, options } = getQueryParams(req);
  const userId = req.state.user.id;

  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  filter.user = userId;
  const resultPage = await historyServices.findPage(filter, options);
  return res.json(resultPage);
};

const findOne = async (req, res) => {
  const { id: testId } = req.params;
  let history = await historyServices.findOne(
    {
      test: testId,
    },
    {
      sort: {
        createdAt: -1,
      },
    }
  );

  if (!history) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No history found');
  }

  return res.json(history);
};

const create = async (req, res) => {
  const { correctSentences, test: testId } = req.body;
  const userId = req.state.user.id;

  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  const params = {
    correctSentences,
    score: {
      listening: historyServices.calcListeningScore(correctSentences.listening),
      reading: historyServices.calcReadingScore(correctSentences.reading),
    },
    user: userId,
    test: testId,
  }
  params.totalScore = params.score.listening + params.score.reading;

  const history = await historyServices.create(params);
  return res.status(httpStatus.CREATED).json(history.toJSON());
};

const count = async (req, res) => {
  const count = await historyServices.count(req.query);
  return res.json(count);
};

module.exports = {
  find,
  findOne,
  create,
  count,
};

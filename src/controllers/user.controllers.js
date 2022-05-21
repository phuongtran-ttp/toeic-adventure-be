const getQueryParams = require('../utils/getQueryParams');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const userServices = require('../services/user.services');
const fullTestHistoryServices = require('../services/fullTestHistory.services');
const skillTestHistoryServices = require('../services/skillTestHistory.services');

const find = async (req, res) => {
  const { filter, options } = getQueryParams(req);
  options.populate = 'role';
  const resultPage = await userServices.findPage(filter, options);
  return res.json(resultPage);
};

const findOne = async (req, res) => {
  const { id } = req.params;
  let user = await userServices.findById(id, {
    populate: 'role',
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  return res.json(user.toJSON());
};

const create = async (req, res) => {
  const user = await userServices.create(req.body, {
    populate: 'role',
  });
  return res.status(httpStatus.CREATED).json(user.toJSON());
};

const update = async (req, res) => {
  const { id } = req.params;
  const user = await userServices.updateById(id, req.body, {
    populate: 'role',
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  
  return res.json(user.toJSON());
};

const deleteOne = async (req, res) => {
  const { id } = req.params;
  const deletedUser = await userServices.deleteById(id);
  if (!deletedUser) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  return res.json(true);
};

const count = async (req, res) => {
  const count = await userServices.count(req.query);
  return res.json(count);
};

const updateProfile = async (req, res) => {
  const userId = req.state.user.id;

  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }
  
  const user = await userServices.updateById(userId, req.body, {
    populate: 'role avatar',
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  
  return res.json(user.toJSON());
};

const getProfile = async (req, res) => {
  const userId = req.state.user.id;

  if (!userId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }

  const [user, fullTestCount, skillTestCount, predictedScore] = await Promise.all([
    userServices.findById(userId, {
      populate: 'role avatar',
    }),
    fullTestHistoryServices.countDoneTest(userId),
    skillTestHistoryServices.countDoneTest(userId),
    fullTestHistoryServices.predictScore(userId),
  ]);

  const joinDate = user.createAt;
  const profile = {
    ...user.toJSON(),
    joinDate,
    done: {
      skillTest: skillTestCount,
      fullTest: fullTestCount,
    },
    predictedScore,
  };

  return res.json(profile);
};

module.exports = {
  find,
  findOne,
  create,
  update,
  deleteOne,
  count,
  updateProfile,
  getProfile,
};

const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const logger = require('../utils/logger');
const jwtUtils = require('../utils/jwt');
const userServices = require('../services/user.services');

const auth = (...allowedRoles) => async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    next(new ApiError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
  }

  const token = authHeader.split(' ')[1];
  const { id } = await jwtUtils.verify(token);
  const user = await userServices.findById(id, {
    populate: 'role',
  });
  
  if (!user) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'User not found'));
  }

  if (!user.isEmailVerified) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Email not verified'));
  }

  if (!allowedRoles.includes(user.role.name)) {
    return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
  }

  req.state = {};
  req.state.user = user;
  next();
};

module.exports = auth;

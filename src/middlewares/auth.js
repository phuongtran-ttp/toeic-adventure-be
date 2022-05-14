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
  try {
    const user = await userServices.findById(id, {
      populate: 'role',
    });
    if (!user) {
      throw new Error('User not found');
    }

    if (!user.isEmailVerified) {
      throw new Error('Email not verified');
    }

    if (!allowedRoles.includes(user.role.name)) {
      throw new Error('Forbidden');
    }

    req.state = {};
    req.state.user = user;
    await next();
  } catch (error) {
    logger.error(error);
    next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden'));
  }
};

module.exports = auth;

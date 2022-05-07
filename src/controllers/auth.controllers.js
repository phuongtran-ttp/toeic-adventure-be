const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const userServices = require('../services/user.services');
const authServices = require('../services/auth.services');
const emailServices = require('../services/email.services');
const jwtUtils = require('../utils/jwt');

const register = async (req, res) => {
  const user = await userServices.create(req.body);
  const token = jwtUtils.issue({ id: user.id });
  authServices.sendVerificationEmail(user);
  res.status(httpStatus.CREATED).send({ user: user.toJSON(), token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await authServices.loginUserWithEmailAndPassword(email, password);
  const token = jwtUtils.issue({ id: user.id });
  res.send({ user, token });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await userServices.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email not found');
  }

  await authServices.sendResetPasswordEmail(user);
  return res.json(true);
};

const resetPassword = async (req, res) => {
  const { code, email, newPassword } = req.body;
  await authServices.resetPassword(code, email, newPassword);
  return res.json(true);
};

const sendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  const user = await userServices.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email not found');
  }

  if (user.isEmailVerified) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already verified');
  }

  await authServices.sendVerificationEmail(user);
  return res.json(true);
};

const verifyEmail = async (req, res) => {
  const { email, code } = req.body;
  await authServices.verifyEmail(email, code);
  return res.json(true);
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};

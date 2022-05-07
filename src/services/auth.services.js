const httpStatus = require('http-status');
const userServices = require('./user.services');
const emailServices = require('./email.services');
const codeServices = require('./code.services');
const ApiError = require('../utils/ApiError');
const { randomCode } = require('../utils/random');
const { nanoid } = require('nanoid');

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await userServices.findOne({ email });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  if (!user.isEmailVerified) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email not verified');
  }

  return user;
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (code, email, newPassword) => {
  const codeDoc = await codeServices.findOne({ code, type: 'RESET_PASSWORD' }, {
    populate: 'user',
  });
  if (!codeDoc || codeDoc.user.email !== email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid code');
  }

  // check whether code expired or not
  if (codeDoc.expires.getTime() < Date.now()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Expired code');
  }
  
  console.log(newPassword)
  await userServices.updateById(codeDoc.user.id, { password: newPassword });
  await codeServices.deleteById(codeDoc.id);
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (email, code) => {
  const codeDoc = await codeServices.findOne({ code, type: 'VERIFY_EMAIL' }, {
    populate: 'user',
  });
  if (!codeDoc || codeDoc.user.email !== email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid code');
  }

  // check whether code expired or not
  if (codeDoc.expires.getTime() < Date.now()) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Expired code');
  }
  
  await userServices.updateById(codeDoc.user.id, { 
    isEmailVerified: true,
  });
  await codeServices.deleteById(codeDoc.id);
};

const sendVerificationEmail = async (user) => {
  let existedCode = await codeServices.findOne({ user: user.id, type: 'VERIFY_EMAIL' });
  if (existedCode) {
    const now = Date.now();
    const expires = existedCode.expires.getTime();
    // stop if code still can be use
    if (expires > now) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Wait in ${Math.ceil((expires - now) / 1000)} seconds`);
    }

    // delete existedCode if it expired
    await codeServices.deleteById(existedCode.id);
  }

  const { code } = await codeServices.create({
    code: randomCode(),
    user: user.id,
    type: 'VERIFY_EMAIL',
    expires: new Date(new Date().getTime() + 5*60000),
  });

  return await emailServices.sendVerificationEmail(user.email, code);
};

const sendResetPasswordEmail = async (user) => {
  let existedCode = await codeServices.findOne({ user: user.id, type: 'RESET_PASSWORD' });
  if (existedCode) {
    const now = Date.now();
    const expires = existedCode.expires.getTime();
    // stop if code still can be use
    if (expires > now) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Wait in ${Math.ceil((expires - now) / 1000)} seconds`);
    }

    // delete existedCode if it expired
    await codeServices.deleteById(existedCode.id);
  }

  const { code } = await codeServices.create({
    code: randomCode(),
    user: user.id,
    type: 'RESET_PASSWORD',
    expires: new Date(new Date().getTime() + 5*60000),
  });

  return await emailServices.sendResetPasswordEmail(user.email, code);
}

module.exports = {
  loginUserWithEmailAndPassword,
  resetPassword,
  verifyEmail,
  sendVerificationEmail,
  sendResetPasswordEmail,
};

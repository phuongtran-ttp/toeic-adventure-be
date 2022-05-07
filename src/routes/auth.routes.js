const authControllers = require('../controllers/auth.controllers');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const authValidation = require('../validations/auth.validation');

module.exports = {
  prefix: '/auth',
  routes: [
    {
      method: 'POST',
      path: '/login',
      handler: authControllers.login,
      middlewares: [validate(authValidation.login)],
    },
    {
      method: 'POST',
      path: '/register',
      handler: authControllers.register,
      middlewares: [validate(authValidation.register)],
    },
    {
      method: 'POST',
      path: '/verify-email',
      handler: authControllers.verifyEmail,
      middlewares: [],
    },
    {
      method: 'POST',
      path: '/send-verification-email',
      handler: authControllers.sendVerificationEmail,
      middlewares: [],
    },
    {
      method: 'POST',
      path: '/forgot-password',
      handler: authControllers.forgotPassword,
      middlewares: [],
    },
    {
      method: 'POST',
      path: '/reset-password',
      handler: authControllers.resetPassword,
      middlewares: [],
    },
  ],
};
const questionControllers = require('../controllers/question.controllers');
const validate = require('../middlewares/validate');
const questionValidation = require('../validations/question.validation');
const auth = require('../middlewares/auth');

module.exports = {
  prefix: '/questions',
  routes: [
    {
      method: 'GET',
      path: '/count',
      handler: questionControllers.count,
      middlewares: [],
    },
    {
      method: 'GET',
      path: '/:id',
      handler: questionControllers.findOne,
      middlewares: [],
    },
    {
      method: 'GET',
      path: '/',
      handler: questionControllers.find,
      middlewares: [],
    },
    {
      method: 'POST',
      path: '/',
      handler: questionControllers.create,
      middlewares: [auth('Admin'), validate(questionValidation.create)],
    },
    {
      method: 'PUT',
      path: '/:id',
      handler: questionControllers.update,
      middlewares: [auth('Admin'), validate(questionValidation.update)],
    },
    {
      method: 'DELETE',
      path: '/:id',
      handler: questionControllers.deleteOne,
      middlewares: [auth('Admin')],
    },
  ],
};
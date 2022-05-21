const fullTestControllers = require('../controllers/fullTest.controllers');
const historyControllers = require('../controllers/fullTestHistory.controllers');
const validate = require('../middlewares/validate');
const fullTestValidation = require('../validations/fullTest.validation');
const auth = require('../middlewares/auth');

module.exports = {
  prefix: '/full-tests',
  routes: [
    {
      method: 'GET',
      path: '/count',
      handler: fullTestControllers.count,
      middlewares: [],
    },
    {
      method: 'GET',
      path: '/:id/history',
      handler: historyControllers.findOne,
      middlewares: [],
    },
    {
      method: 'GET',
      path: '/:id',
      handler: fullTestControllers.findOne,
      middlewares: [],
    },
    {
      method: 'GET',
      path: '/',
      handler: fullTestControllers.find,
      middlewares: [],
    },
    {
      method: 'POST',
      path: '/',
      handler: fullTestControllers.create,
      middlewares: [auth('Admin'), validate(fullTestValidation.create)],
    },
    {
      method: 'PUT',
      path: '/:id',
      handler: fullTestControllers.update,
      middlewares: [auth('Admin'), validate(fullTestValidation.update)],
    },
    {
      method: 'DELETE',
      path: '/:id',
      handler: fullTestControllers.deleteOne,
      middlewares: [auth('Admin')],
    },
  ],
};
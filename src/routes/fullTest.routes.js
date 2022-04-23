const fullTestControllers = require('../controllers/fullTest.controllers');
const validate = require('../middlewares/validate');
const fullTestValidation = require('../validations/fullTest.validation');

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
      middlewares: [validate(fullTestValidation.create)],
    },
    {
      method: 'PUT',
      path: '/:id',
      handler: fullTestControllers.update,
      middlewares: [validate(fullTestValidation.update)],
    },
    {
      method: 'DELETE',
      path: '/:id',
      handler: fullTestControllers.deleteOne,
      middlewares: [],
    },
  ],
};
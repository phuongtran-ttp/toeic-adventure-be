const userControllers = require('../controllers/user.controllers');
const validate = require('../middlewares/validate');
const userValidation = require('../validations/user.validation');
const auth = require('../middlewares/auth');

module.exports = {
  prefix: '/users',
  routes: [
    {
      method: 'GET',
      path: '/count',
      handler: userControllers.count,
      middlewares: [],
    },
    {
      method: 'GET',
      path: '/:id',
      handler: userControllers.findOne,
      middlewares: [],
    },
    {
      method: 'GET',
      path: '/',
      handler: userControllers.find,
      middlewares: [],
    },
    {
      method: 'POST',
      path: '/',
      handler: userControllers.create,
      middlewares: [auth('Admin'), validate(userValidation.create)],
    },
    {
      method: 'PUT',
      path: '/:id',
      handler: userControllers.update,
      middlewares: [auth('Admin'), validate(userValidation.update)],
    },
    {
      method: 'DELETE',
      path: '/:id',
      handler: userControllers.deleteOne,
      middlewares: [auth('Admin')],
    },
  ],
};
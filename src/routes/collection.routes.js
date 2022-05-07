const collectionControllers = require('../controllers/collection.controllers');
const validate = require('../middlewares/validate');
const collectionValidation = require('../validations/collection.validation');
const auth = require('../middlewares/auth');

module.exports = {
  prefix: '/collections',
  routes: [
    {
      method: 'GET',
      path: '/count',
      handler: collectionControllers.count,
      middlewares: [],
    },
    {
      method: 'GET',
      path: '/:id',
      handler: collectionControllers.findOne,
      middlewares: [],
    },
    {
      method: 'GET',
      path: '/',
      handler: collectionControllers.find,
      middlewares: [],
    },
    {
      method: 'POST',
      path: '/',
      handler: collectionControllers.create,
      middlewares: [auth('Admin'), validate(collectionValidation.create)],
    },
    {
      method: 'PUT',
      path: '/:id',
      handler: collectionControllers.update,
      middlewares: [auth('Admin'), validate(collectionValidation.update)],
    },
    {
      method: 'DELETE',
      path: '/:id',
      handler: collectionControllers.deleteOne,
      middlewares: [auth('Admin')],
    },
  ],
};
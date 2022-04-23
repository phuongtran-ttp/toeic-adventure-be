const collectionControllers = require('../controllers/collection.controllers');
const validate = require('../middlewares/validate');
const collectionValidation = require('../validations/collection.validation');

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
      middlewares: [validate(collectionValidation.create)],
    },
    {
      method: 'PUT',
      path: '/:id',
      handler: collectionControllers.update,
      middlewares: [validate(collectionValidation.update)],
    },
    {
      method: 'DELETE',
      path: '/:id',
      handler: collectionControllers.deleteOne,
      middlewares: [],
    },
  ],
};
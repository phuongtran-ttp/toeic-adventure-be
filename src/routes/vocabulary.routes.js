const vocabularyControllers = require('../controllers/vocabulary.controllers');
const validate = require('../middlewares/validate');
const vocabularyValidation = require('../validations/vocabulary.validation');
const auth = require('../middlewares/auth');

module.exports = {
  prefix: '/vocabulary',
  routes: [
    {
      method: 'GET',
      path: '/count',
      handler: vocabularyControllers.count,
      middlewares: [],
    },
    {
      method: 'GET',
      path: '/:id',
      handler: vocabularyControllers.findOne,
      middlewares: [],
    },
    {
      method: 'GET',
      path: '/',
      handler: vocabularyControllers.find,
      middlewares: [],
    },
    {
      method: 'POST',
      path: '/',
      handler: vocabularyControllers.create,
      middlewares: [auth('Admin'), validate(vocabularyValidation.create)],
    },
    {
      method: 'PUT',
      path: '/:id',
      handler: vocabularyControllers.update,
      middlewares: [auth('Admin'), validate(vocabularyValidation.update)],
    },
    {
      method: 'DELETE',
      path: '/:id',
      handler: vocabularyControllers.deleteOne,
      middlewares: [auth('Admin')],
    },
  ],
};
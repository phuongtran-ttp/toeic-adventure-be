const vocabularyThemeControllers = require('../controllers/vocabularyTheme.controllers');
const validate = require('../middlewares/validate');
const vocabularyThemeValidation = require('../validations/vocabularyTheme.validation');
const auth = require('../middlewares/auth');

module.exports = {
  prefix: '/vocabulary-themes',
  routes: [
    {
      method: 'GET',
      path: '/count',
      handler: vocabularyThemeControllers.count,
      middlewares: [],
    },
    {
      method: 'GET',
      path: '/:id',
      handler: vocabularyThemeControllers.findOne,
      middlewares: [],
    },
    {
      method: 'GET',
      path: '/',
      handler: vocabularyThemeControllers.find,
      middlewares: [],
    },
    {
      method: 'POST',
      path: '/',
      handler: vocabularyThemeControllers.create,
      middlewares: [auth('Admin'), validate(vocabularyThemeValidation.create)],
    },
    {
      method: 'PUT',
      path: '/:id',
      handler: vocabularyThemeControllers.update,
      middlewares: [auth('Admin'), validate(vocabularyThemeValidation.update)],
    },
    {
      method: 'DELETE',
      path: '/:id',
      handler: vocabularyThemeControllers.deleteOne,
      middlewares: [auth('Admin')],
    },
  ],
};
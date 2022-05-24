const lessonControllers = require('../controllers/lesson.controllers');
const validate = require('../middlewares/validate');
const lessonValidation = require('../validations/lesson.validation');
const auth = require('../middlewares/auth');

module.exports = {
  prefix: '/lessons',
  routes: [
    {
      method: 'GET',
      path: '/count',
      handler: lessonControllers.count,
      middlewares: [],
    },
    {
      method: 'GET',
      path: '/:id',
      handler: lessonControllers.findOne,
      middlewares: [],
    },
    {
      method: 'GET',
      path: '/',
      handler: lessonControllers.find,
      middlewares: [],
    },
    {
      method: 'POST',
      path: '/',
      handler: lessonControllers.create,
      middlewares: [auth('Admin'), validate(lessonValidation.create)],
    },
    {
      method: 'PUT',
      path: '/:id',
      handler: lessonControllers.update,
      middlewares: [auth('Admin'), validate(lessonValidation.update)],
    },
    {
      method: 'DELETE',
      path: '/:id',
      handler: lessonControllers.deleteOne,
      middlewares: [auth('Admin')],
    },
  ],
};
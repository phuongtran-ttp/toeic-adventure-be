const lessonTopicControllers = require('../controllers/lessonTopic.controllers');
const validate = require('../middlewares/validate');
const lessonTopicValidation = require('../validations/lessonTopic.validation');
const auth = require('../middlewares/auth');

module.exports = {
  prefix: '/lesson-topics',
  routes: [
    {
      method: 'GET',
      path: '/count',
      handler: lessonTopicControllers.count,
      middlewares: [],
    },
    {
      method: 'GET',
      path: '/:id',
      handler: lessonTopicControllers.findOne,
      middlewares: [],
    },
    {
      method: 'GET',
      path: '/',
      handler: lessonTopicControllers.find,
      middlewares: [],
    },
    {
      method: 'POST',
      path: '/',
      handler: lessonTopicControllers.create,
      middlewares: [auth('Admin'), validate(lessonTopicValidation.create)],
    },
    {
      method: 'PUT',
      path: '/:id',
      handler: lessonTopicControllers.update,
      middlewares: [auth('Admin'), validate(lessonTopicValidation.update)],
    },
    {
      method: 'DELETE',
      path: '/:id',
      handler: lessonTopicControllers.deleteOne,
      middlewares: [auth('Admin')],
    },
  ],
};
const skillTestControllers = require('../controllers/skillTest.controllers');
const historyControllers = require('../controllers/skillTestHistory.controllers');
const validate = require('../middlewares/validate');
const skillTestValidation = require('../validations/skillTest.validation');
const auth = require('../middlewares/auth');

module.exports = {
  prefix: '/skill-tests',
  routes: [
    {
      method: 'GET',
      path: '/count-by-parts',
      handler: skillTestControllers.countByPart,
      middlewares: [],
    },
    {
      method: 'GET',
      path: '/count',
      handler: skillTestControllers.count,
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
      handler: skillTestControllers.findOne,
      middlewares: [],
    },
    {
      method: 'GET',
      path: '/',
      handler: skillTestControllers.find,
      middlewares: [auth('Authenticated')],
    },
    {
      method: 'POST',
      path: '/',
      handler: skillTestControllers.create,
      middlewares: [auth('Admin'), validate(skillTestValidation.create)],
    },
    {
      method: 'PUT',
      path: '/:id',
      handler: skillTestControllers.update,
      middlewares: [auth('Admin'), validate(skillTestValidation.updateSkillTest)],
    },
    {
      method: 'DELETE',
      path: '/:id',
      handler: skillTestControllers.deleteOne,
      middlewares: [auth('Admin')],
    },
  ],
};
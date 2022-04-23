const skillTestControllers = require('../controllers/skillTest.controllers');
const validate = require('../middlewares/validate');
const skillTestValidation = require('../validations/skillTest.validation');

module.exports = {
  prefix: '/skill-tests',
  routes: [
    {
      method: 'GET',
      path: '/count',
      handler: skillTestControllers.count,
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
      middlewares: [],
    },
    {
      method: 'POST',
      path: '/',
      handler: skillTestControllers.create,
      middlewares: [validate(skillTestValidation.create)],
    },
    {
      method: 'PUT',
      path: '/:id',
      handler: skillTestControllers.update,
      middlewares: [validate(skillTestValidation.updateSkillTest)],
    },
    {
      method: 'DELETE',
      path: '/:id',
      handler: skillTestControllers.deleteOne,
      middlewares: [],
    },
  ],
};
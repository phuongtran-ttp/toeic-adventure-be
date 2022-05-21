const fullTestHistoryControllers = require('../controllers/fullTestHistory.controllers');
const skillTestHistoryControllers = require('../controllers/skillTestHistory.controllers');
const validate = require('../middlewares/validate');
const historyValidation = require('../validations/history.validation');
const auth = require('../middlewares/auth');

module.exports = {
  prefix: '/histories',
  routes: [
    {
      method: 'GET',
      path: '/full-test',
      handler: fullTestHistoryControllers.find,
      middlewares: [auth('Authenticated')],
    },
    {
      method: 'POST',
      path: '/full-test',
      handler: fullTestHistoryControllers.create,
      middlewares: [auth('Authenticated'), validate(historyValidation.createFullTestHistory)],
    },
    {
      method: 'GET',
      path: '/skill-test',
      handler: skillTestHistoryControllers.find,
      middlewares: [auth('Authenticated')],
    },
    {
      method: 'POST',
      path: '/skill-test',
      handler: skillTestHistoryControllers.create,
      middlewares: [auth('Authenticated'), validate(historyValidation.createSkillTestHistory)],
    },
  ],
};
const fileControllers = require('../controllers/file.controllers');
const uploadMiddlewares = require('../middlewares/upload');
const auth = require('../middlewares/auth');

module.exports = {
  prefix: '/upload',
  routes: [
    {
      method: 'GET',
      path: '/files/:id',
      handler: fileControllers.findOne,
      middlewares: [],
    },
    {
      method: 'GET',
      path: '/files',
      handler: fileControllers.find,
      middlewares: [],
    },
    {
      method: 'POST',
      path: '/',
      handler: fileControllers.uploads,
      middlewares: [auth('Admin'), uploadMiddlewares],
    },
    {
      method: 'DELETE',
      path: '/files/:id',
      handler: fileControllers.deleteOne,
      middlewares: [auth('Admin')],
    }
  ],
};
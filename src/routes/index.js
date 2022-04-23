const express = require('express');
const { basename } = require('path');
const logger = require('../utils/logger');
// const authRoute = require('./auth.route');
// const userRoute = require('./user.route');
const httpStatus = require('http-status');
const { errorConverter, errorHandler } = require('../middlewares/error');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

const router = express.Router();

const defaultRoutes = [
  // {
  //   path: '/auth',
  //   route: authRoute,
  // },
  // {
  //   path: '/users',
  //   route: userRoute,
  // },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

const glob = require('glob');

const initRoutes = (app) => {
  glob("**/*.routes.js", { nonull: true }, function (er, filesPath) {
    filesPath = filesPath.map(e => './' + basename(e));
    filesPath.forEach((path) => {
      const { routes, prefix } = require(path);

      routes.forEach((route) => {
        const method = route.method.toUpperCase();
        let path = route.path === '/' ? '' : route.path;
        path = prefix ? prefix + path : path;

        switch (method) {
          case 'GET':
            router.get(path, ...route.middlewares, catchAsync(route.handler));
            break;

          case 'POST':
            router.post(path, ...route.middlewares,catchAsync(route.handler));
            break;

          case 'PUT':
            router.put(path, ...route.middlewares,catchAsync(route.handler));
            break;
          
          case 'DELETE':
            router.delete(path, ...route.middlewares,catchAsync(route.handler));
            break;
        }
      });

      app.use('/', router);
      
      // send back a 404 error for any unknown api request
      app.use((req, res, next) => {
        next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
      });

      // convert error to ApiError, if needed
      app.use(errorConverter);

      // handle error
      app.use(errorHandler);
    });
  })
};

module.exports = (app) => initRoutes(app);

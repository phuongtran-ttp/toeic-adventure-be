const mongoose = require('mongoose');
const config = require('./config');
const logger = require('./utils/logger');
const app = require('./app');
const bootstrapFn = require('./config/functions/bootstrap');

const mongoDbConfig = config.db.mongoose;

mongoose
  .connect(mongoDbConfig.url, mongoDbConfig.options)
  .then(() => {
    logger.info('Connected to MongoDB');
    return bootstrapFn();
  })
  .then(() => {
    server = app.listen(config.server.port, () => {
      logger.info(`Listening to port ${config.server.port}`);
    });
  });

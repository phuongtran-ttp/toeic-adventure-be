const mongoose = require('mongoose');
const config = require('../src/config');
const logger = require('../src/utils/logger');
const seedSkillTest = require('./seedSkillTest');
const seedFullTest = require('./seedFullTest');
const createFullTest = require('./createFullTest');

const mongoDbConfig = config.db.mongoose;

const seedData = async () => {
  const promises = [];
  for (let i = 0; i < 30; i ++) {
    promises.push(createFullTest())
  }

  await Promise.all(promises);
};

mongoose
  .connect(mongoDbConfig.url, mongoDbConfig.options)
  .then(() => {
    logger.info('✅ Connected to MongoDB');
    logger.info('🚀 Start seeding...')
    return seedData();
  })
  .then(() => {
    logger.info('✅ Seeding data successfully');
    process.exit();
  });
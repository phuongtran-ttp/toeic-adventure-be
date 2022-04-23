const mongoose = require('mongoose');
const config = require('../src/config');
const logger = require('../src/utils/logger');
const seedSkillTest = require('./seedSkillTest');
const seedFullTest = require('./seedFullTest');

const mongoDbConfig = config.db.mongoose;

const seedData = async () => {
  await seedSkillTest();
  await seedFullTest();
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
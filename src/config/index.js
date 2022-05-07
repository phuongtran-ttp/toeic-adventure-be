require('dotenv').config();
const dbConfig = require('./database');
const serverConfig = require('./server');
const emailConfig = require('./email');

module.exports = {
  server: serverConfig,
  db: dbConfig,
  email: emailConfig,
  env: process.env.NODE_ENV || 'development',
}

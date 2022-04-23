require('dotenv').config();
const db = require('./database');
const server = require('./server');

module.exports = {
  server,
  db,
  env: process.env.NODE_ENV || 'development',
}

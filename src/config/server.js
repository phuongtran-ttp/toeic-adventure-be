const { HOST = 'localhost', PORT = 8080 } = process.env;

module.exports = {
  host: process.env.NODE_ENV === 'development' ? 'localhost' : HOST,
  port: PORT,
};
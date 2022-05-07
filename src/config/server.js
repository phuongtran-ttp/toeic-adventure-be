const { HOST = 'localhost', PORT = 8080, DOMAIN } = process.env;

module.exports = {
  host: process.env.NODE_ENV === 'development' ? 'localhost' : HOST,
  port: PORT,
  domain: DOMAIN || `${HOST}:${PORT}`
};
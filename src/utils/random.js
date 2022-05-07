const { nanoid } = require('nanoid');

const randomCode = () => {
  return nanoid(6).toUpperCase();
};

module.exports = {
  randomCode,
};
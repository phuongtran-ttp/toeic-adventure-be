const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'S123AHDBbd4fg4NcmMm9gY39n6Sd2S';

const issue = (payload, options) => {
  return jwt.sign(payload, JWT_SECRET_KEY, options);
};

const verify = (token) => {
  return new Promise(function(resolve, reject) {
    jwt.verify(token, JWT_SECRET_KEY, {}, function(
      err,
      tokenPayload = {}
    ) {
      if (err) {
        return reject(new Error('Invalid token.'));
      }
      resolve(tokenPayload);
    });
  });
};

module.exports = {
  issue,
  verify,
};
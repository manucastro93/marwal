const crypto = require('crypto');

const generateLink = (length = 2) => {
  return crypto.randomBytes(length).toString('hex');
};

module.exports = generateLink;
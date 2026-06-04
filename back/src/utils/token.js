const jwt = require('jsonwebtoken');

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET || 'dev-secret-change-me', {
    expiresIn: '7d',
  });

module.exports = signToken;

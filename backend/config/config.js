require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
  sessionSecret: process.env.SESSION_SECRET || 'your_session_secret',
};
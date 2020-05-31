const rateLimit = require('express-rate-limit');
module.exports = rateLimiterUsingThirdParty = rateLimit({
  windowMs: 1 * 60 * 60 * 1000, // 24 hrs in milliseconds
  max: 5,
  message: {
    message: 'Too many requests, please try again later.'
  },
  headers: true
});

const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.APP_PORT;
const apiRateLimit = require('./middlerware/rateLimiter');
const getAccessToken = require('./accessToken');
const errorHandler = require('./middlerware/errorHandler');
const authorizationMiddleware = require('./middlerware/authorization');
app.use(apiRateLimit);

app.get('/', (req, res, next) => {
  throw new Error('Error');
});
app.get('/access-token/:userId', authorizationMiddleware, getAccessToken);

app.use(errorHandler);

app.listen(port, () => console.log(`App is listening at http://localhost:${port}`));

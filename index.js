const express = require('express');
const app = express();
const port = 8080;
const fetch = require('node-fetch');
require('dotenv').config();
const apiRateLimit = require('./middlerware/rateLimiter');

app.use(apiRateLimit);

app.get('/access-token/:userId', (req, res) => {
  const { AUTH0_API_CLIENT_ID, AUTH0_API_CLIENT_SECRET, AUTH0_API_AUDIENCE, AUTH0_API_GRANT_TYPE, AUTH0_DOMAIN } = process.env;
  var options = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      client_id: AUTH0_API_CLIENT_ID,
      client_secret: AUTH0_API_CLIENT_SECRET,
      audience: AUTH0_API_AUDIENCE,
      grant_type: AUTH0_API_GRANT_TYPE
    })
  };

  fetch(`${AUTH0_DOMAIN}/oauth/token`, options)
    .then(response => {
      response
        .json()
        .then(jwt => {
          fetch(`${AUTH0_DOMAIN}/api/v2/users/${req.params.userId}`, {
            method: 'GET',
            headers: { authorization: `Bearer ${jwt.access_token}` }
          })
            .then(response => {
              response
                .json()
                .then(data => {
                  if (data.statusCode === 404) {
                    res.status(404).send({
                      message: 'The user does not exist.'
                    });
                  } else {
                    const githubAccessToken = data.identities[0].access_token;
                    res.send({
                      githubAccessToken
                    });
                  }
                })
                .catch(err => {
                  res.status(500).send({ message: 'Something went wrong.' });
                });
            })
            .catch(() => {
              res.status(500).send({ message: 'Something went wrong.' });
            });
        })
        .catch(() => {
          res.status(500).send({ message: 'Something went wrong.' });
        });
    })
    .catch(() => {
      res.status(500).send({ message: 'Something went wrong.' });
    });
});

app.listen(port, () => console.log(`App is listening at http://localhost:${port}`));

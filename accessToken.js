const fetch = require('node-fetch');
const redis = require('./database/redis');

async function getAccessToken(req, res, next) {
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
  const { userId } = req.params;

  const access_token = await redis.hget(userId);
  if (access_token) {
    return res.send({
      githubAccessToken: access_token
    });
  }

  fetch(`${AUTH0_DOMAIN}/oauth/token`, options)
    .then(response => {
      response
        .json()
        .then(jwt => {
          fetch(`${AUTH0_DOMAIN}/api/v2/users/${userId}`, {
            method: 'GET',
            headers: { authorization: `Bearer ${jwt.access_token}` }
          })
            .then(response => {
              response
                .json()
                .then(async data => {
                  if (data.statusCode === 404) {
                    res.status(404).send({
                      message: data.message
                    });
                  } else {
                    const { access_token } = data.identities[0];
                    redis.hset(userId, access_token);
                    res.send({
                      githubAccessToken: access_token
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
}

module.exports = getAccessToken;

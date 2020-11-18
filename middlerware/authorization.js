const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

const { AUTH0_ALGORITHM, AUTH0_DOMAIN } = process.env;

// Authorization middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `${AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  // audience: '${AUTH0_DOMAIN}/api/v2/',
  issuer: `${AUTH0_DOMAIN}/`,
  algorithms: [AUTH0_ALGORITHM]
});

module.exports = checkJwt;

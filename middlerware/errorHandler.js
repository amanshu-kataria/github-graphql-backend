const defaultErrorMessage = 'Something went wrong!';

function baseError(error, req, res, next) {
  if (error) {
    res.status(error.status || 500).send({ message: error.message || defaultErrorMessage });
  } else {
    res.status(500).send({ message: defaultErrorMessage });
  }
}

module.exports = baseError;

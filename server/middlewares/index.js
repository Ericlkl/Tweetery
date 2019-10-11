const createError = require('http-errors');
const { check, validationResult } = require('express-validator');

// Check require Parameter is provided
// Otherwise, it will reject the request
// And return error message to client
const validateParams = (req, res, next) => {
  // Check the URL params
  const errors = validationResult(req);

  // If there is error detected by checker
  if (!errors.isEmpty()) {
    // Return errors message to client
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

const analyseEndPointValidator = [
  check('queries', 'queries is required')
    .not()
    .isEmpty(),
  check('queries', 'queries is required to be an array').isArray(),
  validateParams
];

// catch 404 and forward to error handler
const pageNotFoundHandler = (req, res, next) => {
  next(createError(404));
};

// error handler
const errorHandler = (err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
};

module.exports = {
  validateParams,
  analyseEndPointValidator,
  pageNotFoundHandler,
  errorHandler
};

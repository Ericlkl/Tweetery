const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');

const indexRouter = require('./routes/index');

const app = express();

// Server Set Up
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, '../', 'client', 'build')));

// API Routes
app.use('/api/tweets/', indexRouter);

// Serving Front End Website
// Making the unused HTTP routes for returning webpage
// The Server will not get any 404 for unused website, it will return the website instead
// Don't move it to other place at the moment
// *** Must Plug it after others API routes , otherwise the API will not works ***
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../', 'client', 'build', 'index.html'));
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;

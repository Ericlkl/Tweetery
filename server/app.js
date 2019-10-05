const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');

// Load the enviroment variables
require('dotenv').config();

const app = express();

// Server Set Up
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, '../', 'client', 'build')));

// Connect to DB
mongoose.connect('mongodb+srv://' + process.env.MONGO_USERNAME +
                ':' + process.env.MONGO_PASSWORD + 
                '@cab432-7yz8m.mongodb.net/CAB432?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', function(){
  console.log("Connection to MongoDB successful");
});

mongoose.connection.on('error', function(err){
  console.log("Error occured during Mongoose connection");
});

mongoose.connection.on('disconnected', function(){
  console.log("MongoDB disconnected");
});

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

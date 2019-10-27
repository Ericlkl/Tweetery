const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');

const indexRouter = require('./routes/index');
const { pageNotFoundHandler, errorHandler } = require('./middlewares');
// Load the enviroment variables
require('dotenv').config();

const app = express();

// Server Set Up
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve(__dirname, '../', 'client', 'build')));

try {
  // Connect to DB
  mongoose.connect(
    'mongodb+srv://' +
      process.env.MONGO_USERNAME +
      ':' +
      process.env.MONGO_PASSWORD +
      '@cab432-7yz8m.mongodb.net/CAB432?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  );

  mongoose.connection.on('connected', function() {
    console.log('Connection to MongoDB successful');
  });
} catch (err) {
  console.log('Mongoose connection error: ', err);
}

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
app.use(pageNotFoundHandler);

// error handler
app.use(errorHandler);

module.exports = app;

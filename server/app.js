const path = require('path');
const express = require('express');
const morgan = require('morgan');
const app = express();

// Server Logs
app.use(morgan('dev'));

// allow server receiving json data
app.use(express.json());
// make client/build folder as default static files location
app.use(express.static(path.resolve(__dirname, '../', 'client', 'build')));

// Plug API router in
require('./routes')(app);

// The others route makes it default as return webpage
// *** Must Plug it after the API routes , otherwise the API will not works ***
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../', 'client', 'build', 'index.html'));
});

module.exports = app;

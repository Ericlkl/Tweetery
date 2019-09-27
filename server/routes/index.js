const test = require('./test');

module.exports = app => {
  app.use('/api/test', test);
};

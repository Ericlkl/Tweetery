const test = require('./test');
const tweets = require('./twitter');

module.exports = app => {
  app.use('/api/test', test);
  app.use('/analyse', tweets);
};

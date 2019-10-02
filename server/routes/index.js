const express = require('express');
const processTweets = require('../scripts/processTweets');
const processAnalysis = require('../scripts/processAnalysis');

var router = express.Router();

router.get('/test', function(req, res, next) {
  res.send('hello world');
});

// The others route makes it default as return webpage
// *** Must Plug it after the API routes , otherwise the API will not works ***
router.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../', 'client', 'build', 'index.html'));
});

router.post('/analyse', function(req, res, next) {

  // store the search query
  let query = req.body.query;

  // Obtain all the tweets
  processTweets.getTweets(query).then((response) => {
    res.json(response);
  })
  .catch((err) => {
    res.send("Error occured getting tweets");
  });

});

module.exports = router;
const express = require('express');
const { getTrends, getTweets } = require('../scripts/processTweets');
const processAnalysis = require('../scripts/processAnalysis');

var router = express.Router();

// @route  GET api/tweets/trends
// @desc   GET Tweets trend
// @access Public
router.get('/trends', async (req, res) => {
  // To John:
  // It is a simple example how to use async await for dealing with Promise code
  // It makes the code clean and easier to read
  // I suggest we do it in this way :( If we use promise
  // we will face callback hell .then().then().then() when we implement redis
  try {
    // Inside the try block, is like writing code in "then" block of the Promise

    // This variable will receive the data which cames back from resolve function in Promise
    const trends = await getTrends();

    // Send Trends back to client
    res.json(trends[0].trends);
  } catch (err) {
    // Catch Block / Fail Case
    res.status(404).json({
      error: err
    });
  }
});

// @route  GET api/tweets/analyse
// @desc   GET specfic movies information
// @access Public
router.post('/analyse', async (req, res) => {
  
  // store the search query
  let query = req.body.query;

  try {

    // Obtain tweets from given query
    const tweets = await getTweets(query);

    // send json data
    res.json(tweets);
  } catch (err) {
    res.status(404).json({
      error: err
    });
  }
});

module.exports = router;

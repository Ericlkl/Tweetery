const express = require('express');
const { getTrends, getTweets } = require('../scripts/processTweets');
const { extractTweets } = require('../scripts/extract');
const { analyseTweets } = require('../scripts/processAnalysis');

var router = express.Router();

// @route  GET api/tweets/trends
// @desc   GET Tweets trend
// @access Public
router.get('/trends', async (req, res) => {
  try {

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

    // extract the tweets from the received JSON object 
    var statuses = extractTweets(tweets.data.statuses);

    // Analyse the tweets
    const emotions = await analyseTweets(statuses);

    // send json data
    res.json(emotions.emotion.document.emotion);
  } catch (err) {
    res.status(404).json({
      error: err
    });
  }
});

module.exports = router;

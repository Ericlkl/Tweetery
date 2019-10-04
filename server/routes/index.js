const express = require('express');
const moment = require('moment');
const { getPassSevenDays } = require('../scripts/date');
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
  const { query } = req.body;

  try {
    const dates = getPassSevenDays();

    const results = {
      [query]: {}
    };

    for (let i = 0; i < dates.length - 1; i++) {
      // Obtain tweets from given query
      const tweets = await getTweets(query, dates[i]);
      // extract the tweets from the received JSON object
      var statuses = extractTweets(tweets.data.statuses);
      // Analyse the tweets
      const emotions = await analyseTweets(statuses);

      // Convert date from YYYY-MM-DD to MMMDD As JsonKey
      // YYYY-MM-DD = '2019-10-04'
      // MMMDD = 'Oct04'
      const JSONkey = moment(dates[i]).format('MMMDD');

      results[query][JSONkey] = emotions.emotion.document.emotion;
    }

    // send json data
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(404).json({
      error: err
    });
  }
});

module.exports = router;

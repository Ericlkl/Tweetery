const express = require('express');
const moment = require('moment');
const { getPassSevenDays } = require('../scripts/date');
const { getTrends, getTweets } = require('../scripts/processTweets');
const { extractTweets } = require('../scripts/extract');
const { analyseTweets } = require('../scripts/processAnalysis');
const { getDataFromCache, saveDataToCache } = require('../services/cache');

const router = express.Router();

// @route  GET api/tweets/trends
// @desc   GET Tweets trend
// @access Public
router.get('/trends', async (req, res) => {
  try {
    const trendsInCache = await getDataFromCache('T:trends');

    // If there are trends information saved in Cache
    // Return it to client
    if (trendsInCache) return res.json(trendsInCache);

    // Get trends data from Twitter
    const trends = await getTrends();

    // Only Save Trends data in 5 minutes
    saveDataToCache('T:trends', 300, trends[0].trends);

    // Send Trends back to client
    res.json(trends[0].trends);
  } catch (err) {
    // Catch Block / Fail Case
    res.status(404).json({
      error: err
    });
  }
});

// @route  POST api/tweets/analyse
// @desc   Sending Query to get emotion data related to keyword in pass seven days
// @access Public
router.post('/analyse', async (req, res) => {
  // store the search query
  const { query } = req.body;

  try {
    const dates = getPassSevenDays();

    const results = {
      [query]: {}
    };

    for (let i = 0; i < dates.length; i++) {
      // Convert date from YYYY-MM-DD to MMMDD As DateKey
      // YYYY-MM-DD = '2019-10-04'
      // MMMDD = 'Oct04'
      const Datekey = moment(dates[i]).format('MMMDD');
      const redisKey = `${query}:${Datekey}`;

      const redisCacheData = await getDataFromCache(redisKey);

      if (redisCacheData) {
        results[query][Datekey] = redisCacheData;
      } else {
        // Obtain tweets from given query
        const tweets = await getTweets(query, dates[i]);
        // extract the tweets from the received JSON object
        var statuses = extractTweets(tweets.data.statuses);
        // Analyse the tweets
        const emotion = await analyseTweets(statuses);

        saveDataToCache(redisKey, 3600, emotion);

        results[query][Datekey] = emotion;
      }
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

const express = require('express');
const { forEach } = require('p-iteration');

// Scripts
const { getPastSevenDays } = require('../scripts/date');
const { getTrends, getTweets } = require('../scripts/processTweets');
const { extractTweets } = require('../scripts/extract');
const { analyseTweets } = require('../scripts/processAnalysis');
const { sortData } = require('../scripts/sort');

// Storage services
const { getDataFromCache, saveDataToCache } = require('../services/cache');
const { getEmotions, getTrending } = require('../services/searchDatabase');

const { analyseEndPointValidator } = require('../middlewares');

const router = express.Router();

// DB models
var trendingModel = require('../services/storeTrends');
var emotionModel = require('../services/storeEmotion');

// @route  GET api/tweets/trends
// @desc   GET Tweets trend
// @access Public
router.get('/trends', async (req, res) => {
  try {

    // Check if trends are stored on the cache
    const trendsInCache = await getDataFromCache('T:trends');

    // Check if trends are stored on the db
    const trendsInDb = await getTrending();

    // If trends is in the cache or db
    if (trendsInCache) {
      return res.json(trendsInCache);
    } else if (trendsInDb){
      // store in cache for 5 minutes
      saveDataToCache('T:trends', 300, trendsInDb.trending[0].trends);
      return res.json(trendsInDb);
    } else {
      // Get trends data from Twitter
      const trends = await getTrends();

      // Save Trending data for five minutes
      saveDataToCache('T:trends', 300, trends[0].trends);

      // store trends data in db
      let t = new trendingModel();

      var datetime = new Date(Date.now());
      t.time = datetime;
      t.trending = trends;
      t.save(function(err) {
        if (err) {
          console.log('Error saving trend to DB: ', err);
        } else {
          console.log('Saved Trends to DB');
        }
      });

      // Send Trends back to client
      res.json(trends[0].trends);
    }
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
// @body   { queries: [] }
router.post('/analyse', analyseEndPointValidator, async (req, res) => {
  // store the search query
  const { queries } = req.body;
  console.log(queries);

  var results = [];

  try {
    await forEach(getPastSevenDays(), async date => {
      await forEach(queries, async query => {
        const redisKey = `${query}:${date}`;

        // Find emotions on redis
        const redisCacheData = await getDataFromCache(redisKey);

        // Find emotions on mongoDB
        const db_emotions = await getEmotions(date, query);

        if (redisCacheData) {
          console.log('Data exists on redis cache');
          results.push({
            date,
            query,
            emotions: redisCacheData
          });
        } else if (db_emotions) {
          console.log('Data exists on mongodb');
          results.push(db_emotions);

          // save to redis cache for future access
          saveDataToCache(redisKey, 3600, db_emotions.emotions);
        } else {
          console.log('Fetch The Raw data and save to cache and db');
          // Obtain tweets from given query
          const tweets = await getTweets(query, date);

          // extract the tweets from the received JSON object
          const statuses = extractTweets(tweets.data.statuses);
          
          // Analyse the tweets
          const emotions = await analyseTweets(statuses);

          saveDataToCache(redisKey, 3600, emotions);

          // Save to MongoDB
          await new emotionModel({ date, query, emotions }).save();

          results.push({ date, query, emotions });
        }
      });
    });

    // sort json data from oldest to newest (Data not in order when retrieving from cache/db)
    var sorted = sortData(results);

    // send json data
    res.json(sorted);
  } catch (err) {
    res.status(404).json({
      error: err
    });
  }
});

module.exports = router;

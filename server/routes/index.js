const express = require('express');
const { forEach } = require('p-iteration');
const { getPassSevenDays } = require('../scripts/date');
const { getTrends, getTweets } = require('../scripts/processTweets');
const { extractTweets } = require('../scripts/extract');
const { analyseTweets } = require('../scripts/processAnalysis');
const { getDataFromCache, saveDataToCache } = require('../services/cache');
const { getEmotions } = require('../services/searchDatabase');
const { analyseEndPointValidator } = require('../middlewares');

const router = express.Router();

// DB models
var Trending = require('../services/storeTrends');
var emotionModel = require('../services/storeEmotion');

// @route  GET api/tweets/trends
// @desc   GET Tweets trend
// @access Public
router.get('/trends', async (req, res) => {
  try {
    const trendsInCache = await getDataFromCache('T:trends');

    // If there are trends information saved in Cache
    // Return it to client
    // if (trendsInCache) return res.json(trendsInCache);

    // Get trends data from Twitter
    const trends = await getTrends();

    // Only Save Trends data in 5 minutes
    // saveDataToCache('T:trends', 300, trends[0].trends);

    // get today's date
    // var today = new Date();
    // var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    // // store trends data in db
    // let t = new Trending();
    // t.tag.date = date;
    // t.trending = trends;
    // t.save(function(err) {
    //   if (err) {
    //     console.log('Error saving trend to DB: ', err);
    //   } else {
    //     console.log('Saved Trends to DB');
    //   }
    // })

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
// @body   { queries: [] }
router.post('/analyse', analyseEndPointValidator, async (req, res) => {
  // store the search query
  const { queries } = req.body;

  var results = [];

  try {
    await forEach(getPassSevenDays(), async date => {
      await forEach(queries, async query => {
        const redisKey = `${query}:${date}`;

        // Find emotions on redis
        const redisCacheData = await getDataFromCache(redisKey);

        // Find emotions on mongoDB
        const db_emotions = await getEmotions(date);

        if (redisCacheData) {
          console.log('Data exists on redis cache');
          results.push({
            date,
            query,
            emotions: redisCacheData
          });
          // To John:
          // Disable this else if block to fix the analyse function
        } else if (db_emotions) {
          // MongoDB is always return true
          // Because the find method always find the emotion data by Date
          // The Trump data is always be selected, because it exist a date it match pass7days
          // Therefore, Raw data will never be analyse. it will always be using trump data
          // But don't worry, I can fix it very quickly once the raw analyse function be fixed
          console.log('Data exists on mongodb');
          results.push(db_emotions);

          // save to redis cache for future access
          saveDataToCache(redisKey, 3600, db_emotions.emotions);
        } else {
          console.log('Fetch The Raw data');
          // Obtain tweets from given query
          const tweets = await getTweets(query, date);

          // The problem starts from the next line
          // tweets.data.statuses always return empty array
          // I don't know how to fix it :(

          // extract the tweets from the received JSON object
          const statuses = extractTweets(tweets.data.statuses);
          // Analyse the tweets
          const emotions = await analyseTweets(statuses);

          saveDataToCache(redisKey, 3600, emotion);

          // Save to MongoDB
          // If error happens, it will automatically run catch block

          // JS Tips ---
          // { date, query, emotions } is a short cut form
          // === { date:date, query:query, emotions:emotions } it is exact same
          await new emotionModel({ date, query, emotions }).save();

          results.push({ date, query, emotions });
        }
      });
    });

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

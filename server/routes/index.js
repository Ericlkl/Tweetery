const express = require('express');
const moment = require('moment');
const { getPassSevenDays } = require('../scripts/date');
const { getTrends, getTweets } = require('../scripts/processTweets');
const { extractTweets } = require('../scripts/extract');
const { analyseTweets } = require('../scripts/processAnalysis');
const { getDataFromCache, saveDataToCache } = require('../services/cache');
const { getEmotions } = require('../services/searchDatabase');

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
router.post('/analyse', async (req, res) => {
  // store the search query
  const { query } = req.body;

  try {
    const dates = getPassSevenDays();

    var results = [];

    for (let i = 0; i < dates.length; i++) {
      // Convert date from YYYY-MM-DD to MMMDD As DateKey
      // YYYY-MM-DD = '2019-10-04'
      // MMMDD = 'Oct04'
      const Datekey = moment(dates[i]).format('MMMDD');
      const redisKey = `${query}:${Datekey}`;

      // Find emotions on redis
      // const redisCacheData = await getDataFromCache(redisKey);
      const redisCacheData = false;

      // Find emotions on mongoDB
      const db_emotions = await getEmotions(Datekey);

      if (redisCacheData) {
        console.log("Data exists on redis cache");
        results.push({
          "date": Datekey,
          "query": query,
          "emotions": redisCacheData
        });

      } else if (db_emotions){
        console.log("Data exists on mongodb");
        results = db_emotions;

        // save to redis cache for future access
        saveDataToCache(redisKey, 3600, db_emotions[0].emotions);
        // console.log(db_emotions[0].emotions);

      } else {
        // Obtain tweets from given query
        const tweets = await getTweets(query, dates[i]);
        // extract the tweets from the received JSON object
        var statuses = extractTweets(tweets.data.statuses);
        // Analyse the tweets
        const emotion = await analyseTweets(statuses);

        saveDataToCache(redisKey, 3600, emotion);

        // Save to MongoDB
        let t = new emotionModel();
        t.date = Datekey;
        t.query = query;
        t.emotions = emotion;
        t.save(function(err) {
          if (err) {
            console.log('Error saving trend to DB: ', err);
          } else {
            console.log('Saved Trends to DB');
          }
        })

        results.push({
          "date": Datekey,
          "query": query,
          "emotions": db_emotions
        });
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

// Helper function for Socket.io
const _ = require('lodash');
const moment = require('moment');

const nlp = require('compromise');
const { getTweets } = require('../scripts/processTweets');
const { extractTweets } = require('../scripts/extract');
const { analyseTweets } = require('../scripts/processAnalysis');
// Live Server Setting
// Default - Broadcast time = 10Sec / REMOVE_UNUSED_QUERY_TIME = 10Sec
//
//
const BROADCAST_TIME = 10000;
const REMOVE_UNUSED_QUERY_TIME = 10000;

module.exports = (io, analysis) => {
  // Broadcasting Query message to each subscribtion
  setInterval(() => {
    analysis.forEach(async query => {
      const date = moment(Date.now()).format('YYYY-MM-DD');
      // Obtain tweets from given query
      const tweets = await getTweets(query, date);

      // extract the tweets from the received JSON object
      const statuses = extractTweets(tweets.data.statuses);

      // handle looseness & variety of random text
      var doc = nlp(statuses)
        .normalize()
        .out('text');

      // Analyse the tweets
      const emotions = await analyseTweets(doc);

      io.of('/analysis')
        .to(query)
        .emit('dataFromServer', {
          [query]: emotions
        });
    });
  }, BROADCAST_TIME);

  // Remove Query Tracking if no one using
  setInterval(() => {
    analysis.forEach(query => {
      // If there no one user in the room(Socket.io terms)
      // It means no one tracking this query
      // Remove it from the update list
      io.of('/analysis')
        .in(query)
        .clients((error, clients) => {
          if (error) throw error;
          console.log(`User Number for ${query} : ${clients.length}`);
          if (clients.length === 0) {
            analysis = _.without(analysis, query);
          }
        });
    });
    console.log('------------- Socket.io -----------------');
    console.log('Tracking Items : ');
    console.log(analysis);
  }, REMOVE_UNUSED_QUERY_TIME);
};

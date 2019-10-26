let analysis = [];

const _ = require('lodash');
const moment = require('moment');

const nlp = require('compromise');
const { getTweets } = require('../scripts/processTweets');
const { extractTweets } = require('../scripts/extract');
const { analyseTweets } = require('../scripts/processAnalysis');

// Live Server Setting
// BROADCAST_TIME = The Period of time sending the emotion data to the client
// REMOVE_UNUSED_QUERY_TIME = How many sec do the server wait and check the query
// wheither subscribed by user or not. If the users is no-one used and be detected, remove immidiately
// Default Broadcast time = 5Sec / REMOVE_UNUSED_QUERY_TIME = 60Min

const BROADCAST_TIME = 5000;
const REMOVE_UNUSED_QUERY_TIME = 60000;

module.exports = expressServer => {
  const io = require('socket.io')(expressServer);
  // NameSpace
  io.of('/analysis').on('connection', socket => {
    // Connect Successfully
    io.of('/analysis').emit('serverMsg', 'Server Connect Successfully');

    socket.on('subscribe', queries => {
      // Looping through all the queries
      queries.forEach(query => {
        // If the real time analysis is tracking this query already
        if (analysis.includes(query)) {
          io.of('/analysis').emit('serverMsg', `New Memeber Joined ${query}`);
          // Join the susbscribion for query
          socket.join(query);
        } else {
          // Put the new query keyword into analysis list
          analysis.push(query);
          // Client Subscribe to this query
          socket.join(query);
          io.of('/analysis').emit('serverMsg', `A new Member created ${query}`);
        }
      });
    });

    // Trigger when client side say disconnect
    socket.on('unsubscribe', queries => {
      // Looping through all the queries
      queries.forEach(query => {
        socket.leave(query);
      });
    });
  });

  // Socket.io Helper functions
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
      const currentTime = moment(Date.now()).format('HH:mm:ss');

      console.log(`Sending Broadcast for ${query}`);

      io.of('/analysis')
        .to(query)
        .emit('subscriptionData', {
          [query]: {
            [currentTime]: emotions
          }
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

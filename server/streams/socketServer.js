let analysis;
let stream;
var data = '';

const _ = require('lodash');
const moment = require('moment');
const Twit = require('twit');

const nlp = require('compromise');
const { getTweets } = require('../scripts/processTweets');
const { extractTweets } = require('../scripts/extract');
const { analyseTweets } = require('../scripts/processAnalysis');

var T = new Twit({
  consumer_key: process.env.T_CONSUMER_KEY,
  consumer_secret: process.env.T_CONSUMER_SECRET,
  access_token: process.env.T_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.T_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true // optional - requires SSL certificates to be valid.
});

// Live Server Setting
// BROADCAST_TIME = The Period of time sending the emotion data to the client
// REMOVE_UNUSED_QUERY_TIME = How many sec do the server wait and check the query
// wheither subscribed by user or not. If the users is no-one used and be detected, remove immidiately
// Default Broadcast time = 5Sec / REMOVE_UNUSED_QUERY_TIME = 60Min

const BROADCAST_TIME = 10000;
const REMOVE_UNUSED_QUERY_TIME = 60000;

async function startStream(queries) {

  try {
    var toSearch = {
      track: queries,
      language: 'en'
    };

    stream = T.stream('statuses/filter', toSearch);
    console.log('Tracking: ' + toSearch.track);
    // turn on stream
    stream.on('message', function (message) {
      // console.log(message.created_at, message.text + '\n');
      data += message.text + '\n';
    });

    //Check limit
    stream.on('limit', function (message) {
      console.log('Limit Reached: ' + message);
    });

    stream.on('disconnect', function (message) {
      console.log('Stream Disconnected: ' + message);
      closeSocket = true;
      stream.stop();
    });

    stream.on('error', function (message) {
      console.log('Stream error: ' + message);
    });

    stream.on('reconnect', function (request, response, connectInterval) {
      console.log('Attempting to reconnect');
      if (response) {
        console.log('Connection result: ' + response);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

module.exports = expressServer => {
  const io = require('socket.io')(expressServer);
  // NameSpace
  io.of('/analysis').on('connection', socket => {
    // Connect Successfully
    io.of('/analysis').emit('serverMsg', 'Server Connect Successfully');

    socket.on('subscribe', queries => {
      startStream(queries);

        analysis = queries;
        console.log(analysis, queries);
        // Client Subscribe to this query
        socket.join(queries);
        io.of('/analysis').emit('serverMsg', `A new Member created ${queries}`);
      // }
      // });
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
  setInterval(async () => {


    // handle looseness & variety of random text
    var doc = await nlp(data)
      .normalize()
      .out('text');
    // console.log(doc);

    // Analyse the tweets
    const emotions = await analyseTweets(doc);
    let currentTime = moment(Date.now()).format('HH:mm:ss');
    currentTime = currentTime.slice(0, -1) + '0';

    // console.log(`Sending Broadcast`, emotions);

    io.of('/analysis')
      .to(analysis)
      .emit('subscriptionData', {
        [analysis]: {
          [currentTime]: emotions
        }
      });

    data = '';
  }, BROADCAST_TIME);

// Remove Query Tracking if no one using
  setInterval(() => {
    // analysis.forEach(query => {
      // If there no one user in the room(Socket.io terms)
      // It means no one tracking this query
      // Remove it from the update list
    io.of('/analysis')
      .in(analysis)
      .clients((error, clients) => {
        if (error) throw error;
        console.log(`User Number for ${analysis} : ${clients.length}`);
        data = '';
        stream.stop();
        if (clients.length === 0) {
          analysis = _.without(analysis, analysis);
          data = '';
          stream.stop();
        }
      });
    // });
    console.log('------------- Socket.io -----------------');
    console.log('Tracking Items : ');
    console.log(analysis);
  }, REMOVE_UNUSED_QUERY_TIME);
}
// };

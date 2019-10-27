var channels = [];

const _ = require('lodash');
const moment = require('moment');
const nlp = require('compromise');

const { analyseTweets } = require('../scripts/processAnalysis');
const TwitStream = require('../model/TwitStream');

// Live Server Setting
// BROADCAST_TIME = The Period of time sending the emotion data to the client
// REMOVE_UNUSED_QUERY_TIME = How many sec do the server wait and check the query
// wheither subscribed by user or not. If the users is no-one used and be detected, remove immidiately
// Default Broadcast time = 5Sec / REMOVE_UNUSED_QUERY_TIME = 60Min

const BROADCAST_TIME = 10000;
const REMOVE_UNUSED_QUERY_TIME = 40000;

module.exports = expressServer => {
  try {
  } catch (err) {
    console.log(err);
  }
  // Initialize Socket.io Apps
  const io = require('socket.io')(expressServer);
  io.set('origins', '*:*');

  // Create new namespace for emotion analysis
  io.of('/analysis').on('connection', socket => {
    // Connect Successfully
    io.of('/analysis').emit('serverMsg', 'Server Connect Successfully');

    socket.on('subscribe', queries => {
      let newChannel = { name: '' };
      queries.forEach(query => (newChannel.name += _.trim(query) + ' '));

      const isExist = channels.some(channel => {
        console.log(`Checking channels name ${channel.name}`);
        if (channel.name === newChannel.name) {
          socket.join(channel.name);
          io.of('/analysis').emit(
            'serverMsg',
            `A Member joined existed channel ${channel.name}`
          );
        }
        return channel.name === newChannel.name;
      });

      // If there is no channel do the samething like this one
      if (!isExist) {
        // Create new Twit Stream for new channels
        newChannel.stream = new TwitStream(queries, newChannel.name);
        // Put new channel information to channels array
        channels.push(newChannel);
        // Assign user into the new Channel
        socket.join(newChannel.name);

        // Client Subscribe to this query
        io.of('/analysis').emit(
          'serverMsg',
          `A new Member created ${newChannel.name}`
        );
      }
    });

    // Trigger when client side say disconnect
    socket.on('unsubscribe', queries => {
      let channelName = '';
      queries.forEach(query => (channelName += _.trim(query) + ' '));

      socket.leave(channelName);
      // Client unSubscribe to this query
      io.of('/analysis').emit('serverMsg', `A Member leaved ${channelName}`);
    });
  });

  // Socket.io Helper functions
  // Broadcasting Query message to subscribtion
  setInterval(() => {
    channels.forEach(async channel => {
      try {
        // handle looseness & variety of random text
        var doc = await nlp(channel.stream.data)
          .normalize()
          .out('text');

        // Analyse the tweets
        if (doc !== undefined) {
          const emotions = await analyseTweets(doc);
          let currentTime = moment(Date.now()).format('HH:mm:ss');
          currentTime = currentTime.slice(0, -1) + '0';

          // console.log(`Sending Broadcast`, emotions);

          io.of('/analysis')
            .to(channel.name)
            .emit('subscriptionData', {
              [channel.name]: {
                [currentTime]: emotions
              }
            });
        }

        channel.stream.data = '';
      } catch (err) {
        console.log('Error Msg');
        console.log(err);
        console.log(`No data for ${channel.name}`);
        io.of('/analysis')
          .to(channel.name)
          .emit('serverMsg', `No data for ${channel.name}`);
      }
    });
  }, BROADCAST_TIME);

  // Check if no one is connected for the stream
  // if no one is connected, close the stream and socket
  setInterval(async () => {
    let channelRemoveList = [];
    await _.forEach(channels, channel => {
      // inside Removes Channels method
      io.of('/analysis')
        .in(channel.name)
        .clients((error, clients) => {
          if (error) throw error;
          console.log(
            `${clients.length} Connected Users searching: ${channel.name}`
          );
          if (clients.length === 0) {
            channel.stream.stop();
            channelRemoveList.push(channel.name);
          }
        });
    });

    channels = await channels.filter(
      channel => !channelRemoveList.includes(channel.name)
    );

    console.log('------------- Socket.io -----------------');
    console.log('Tracking Items : ');
    console.log(channels.map(channel => channel.name));
  }, REMOVE_UNUSED_QUERY_TIME);
};

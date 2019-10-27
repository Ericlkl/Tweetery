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
const REMOVE_UNUSED_QUERY_TIME = 60000;

// Dont rename this variable
// This variable plays a big role in the socket io
// It saved all the channels running at the socket io server
// We used it to broasdcast the emotion data to users
var channels = [];

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
      // Checking every query from the user provied
      queries.forEach(query => {
        // If the query already generated as a channel
        const isExist = channels.some(channel => {
          console.log(`Checking channels name ${query}`);
          if (channel.name === query) {
            // assign the user in the same channel like the previous user
            // So that they can recevie the same real time data
            // Each channel is related to one specific topic by the query name
            socket.join(channel.name);
            // Broadcast the message, so that People knows they entered to the room
            io.of('/analysis')
              .to(channel.name)
              .emit(
                'serverMsg',
                `A Member joined existed channel ${channel.name}`
              );
          }
          return channel.name === query;
        });

        // If there is no channel , create a new one to user
        if (!isExist) {
          // Put new channel information to channels array
          channels.push({
            name: query,
            stream: new TwitStream(query)
          });
          // Assign user into the new Channel
          socket.join(query);

          // Client Subscribe to this query
          io.of('/analysis').emit('serverMsg', `A new Member created ${query}`);
        }
      });
    });

    // Trigger when client want to unsubscribe the previous queries
    socket.on('unsubscribe', queries => {
      queries.forEach(query => {
        // Unsubscribe
        socket.leave(query);
        // Client unSubscribe to this query
        io.of('/analysis').emit('serverMsg', `A Member leaved ${query}`);
      });
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
          const currentTime =
            moment(Date.now())
              .format('HH:mm:ss')
              .slice(0, -1) + '0';

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
            // If no one subscribe the channel anymore
            // Stop the Twit stream
            channel.stream.stop();
            // Push this channel into remove list
            channelRemoveList.push(channel.name);
          }
        });
    });

    // Remove the channels according the filter list generated above
    channels = await channels.filter(
      channel => !channelRemoveList.includes(channel.name)
    );

    // Print the Tracking Channels
    console.log('------------- Socket.io -----------------');
    console.log('Tracking Items : ');
    console.log(channels.map(channel => channel.name));
  }, REMOVE_UNUSED_QUERY_TIME);
};

let analysis = [];

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
  require('./helper.js')(io, analysis);
};

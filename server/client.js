const io = require('socket.io-client');

let analysis = io.connect('http://localhost:5000/analysis');

// Function That Server Send back
analysis.on('welcome', data => {
  console.log('Received : ', data);
});

analysis.on('dataFromServer', res => console.log(res));

// Function that send data for server
analysis.emit('subscribe', ['Pikachu', 'Trump']);

// analysis.emit('unsubscribe', ['Pikachu']);

// setTimeout(() => {
//   console.log("Kill connection")
//   analysis.disconnect();
// }, 10000)

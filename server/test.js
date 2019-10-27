const TwitStream = require('./model/TwitStream');

const twitStream = new TwitStream(['trump'], 'trump');

setInterval(() => {
  console.log('New Data');
  console.log(twitStream.data);
}, 5000);

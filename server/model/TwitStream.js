const Twit = require('twit');
const path = require('path');

// Load the enviroment variables
require('dotenv').config(path.resolve(__dirname, '../'));

const T = new Twit({
  consumer_key: process.env.T_CONSUMER_KEY,
  consumer_secret: process.env.T_CONSUMER_SECRET,
  access_token: process.env.T_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.T_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true // optional - requires SSL certificates to be valid.
});

class TwitStream {
  constructor(query) {
    this.data = '';
    this.query = query;
    this.stream = T.stream('statuses/filter', {
      track: query,
      language: 'en'
    });

    try {
      // Start stream

      console.log('Tracking: ' + query);

      // If new tweets found
      this.stream.on('message', message => {
        this.data += message.text + '\n';
      });

      // If limitation Reached
      this.stream.on('limit', message =>
        console.log('Limit Reached: ' + message)
      );

      // If Stream Disconnected
      this.stream.on('disconnect', message => {
        console.log('Stream Disconnected: ' + message);
        closeSocket = true;
        this.stream.stop();
      });

      // If there is Error for this stream
      this.stream.on('error', message =>
        console.log('Stream error: ' + message)
      );

      this.stream.on('reconnect', (request, response, connectInterval) => {
        console.log('Attempting to reconnect');
        if (response) {
          console.log('Connection result: ' + response);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  stop() {
    this.stream.stop();
    console.log(`${this.query} Stream stoped`);
  }
}

module.exports = TwitStream;

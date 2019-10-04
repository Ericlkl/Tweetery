// Load the enviroment variables
require('dotenv').config();

// Import twit library
var Twit = require('twit');

var T = new Twit({
  consumer_key: process.env.T_CONSUMER_KEY,
  consumer_secret: process.env.T_CONSUMER_SECRET,
  access_token: process.env.T_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.T_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
  strictSSL: true // optional - requires SSL certificates to be valid.
});

async function getTweets(query, day) {
  return new Promise((resolve, reject) => {
    // Construct the search params
    const params = {
      q: query,
      count: 10,
      result_type: 'recent',
      lang: 'en',
      until: day
    };

    // search twitter for all tweets containing the query
    T.get('search/tweets', params).then(response => {
      // articles found for the search query
      if (response.totalResults !== 0) {
        resolve(response);
      }

      // No tweets found
      else if (response.length === 0) {
        reject('We could not find any articles for: ' + query);
      }

      // Promise rejected
      else {
        reject(response);
      }
    });
  });
}

const getTrends = async () => {
  return new Promise((resolve, reject) => {
    const params = {
      // New York = 2459115
      // Australia = 23424748
      id: '23424748'
    };
    // Getting Trends
    T.get('trends/place', params, (err, data) => {
      if (err) {
        reject('Could not find Trends');
      }

      resolve(data);
    });
  });
};

module.exports = {
  getTweets,
  getTrends
};

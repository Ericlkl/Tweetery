// Import Modules
const path = require('path');
// Load the enviroment variables
require('dotenv').config(path.resolve(__dirname, '../'));

// Use IBM library for processing analysis
const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1.js');
const nlu = new NaturalLanguageUnderstandingV1({
  // Use API key
  iam_apikey: process.env.IBM_KEY,
  version: '2018-04-05',

  // API endpoint
  url: 'https://gateway.watsonplatform.net/natural-language-understanding/api/'
});

/**
 * Analyse the emotion of the given tweets
 *
 * @param {*} tweets - A string of tweets
 */
async function analyseTweets(tweets) {
  return new Promise((resolve, reject) => {
    // create object with values
    var params = {
      text: tweets,
      features: {
        emotion: {}
      }
    };

    nlu
      .analyze(params)
      .then(result => {
        // console.log(result);
        resolve(result.emotion.document.emotion);
      })
      .catch(err => {
        reject(err);
      });
  });
}

/**
 * Analyse the sentiment of the given tweets
 *
 * @param {*} tweets - A string of tweets
 */
async function analyseSentiment(tweets) {
  return new Promise((resolve, reject) => {
    // create object with values
    var params = {
      text: tweets,
      features: {
        sentiment: {}
      }
    };

    nlu
      .analyze(params)
      .then(result => {
        resolve(result.sentiment.document);
      })
      .catch(err => {
        reject(err);
      });
  });
}

module.exports = { analyseTweets, analyseSentiment };

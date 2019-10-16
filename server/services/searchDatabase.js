var emotionModel = require('./storeEmotion');
var trendingModel = require('./storeTrends');

async function getEmotions(Datekey, queried) {
  return new Promise((resolve, reject) => {
    // let emotions = [];
    emotionModel
      .findOne({ date: Datekey, query: queried })
      .then(response => {
        if (response.length == 0) {
          return resolve(false);
        }
        resolve(response);
      })
      .catch(err => {
        resolve(false);
      });
  });
}

async function getTrending() {
  // Get start and end time, 15 minutes in between
  var startDate = new Date(Date.now() - 900000 * 60);
  var endDate = new Date(Date.now());

  return new Promise((resolve, reject) => {
    trendingModel
      .findOne({ time: {'$gte': startDate, '$lte': endDate}})
      .then(response => {
        if (response.length == 0) {
          resolve(false);
        }
        // console.log(response);
        resolve(response);
      })
      .catch(err => {
        resolve(false);
      });
  });
}

module.exports = { getEmotions, getTrending };

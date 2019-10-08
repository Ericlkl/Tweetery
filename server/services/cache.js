// Load the enviroment variables
require('dotenv').config();

const redis = require('redis');
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST,
  port: 6379,
  auth_pass: process.env.REDIS_PASS
});

redisClient.on('error', err => {
  console.log('Redis Error : ' + err);
});

async function getDataFromCache(redisKey) {
  return new Promise((resolve, reject) => {
    redisClient.get(redisKey, (err, result) => {
      if (result) {
        resolve(JSON.parse(result));
      } else {
        resolve(false);
      }
    });
  });
}

function saveDataToCache(redisKey, expireInSec, value) {
  redisClient.setex(redisKey, expireInSec, JSON.stringify(value));
}

module.exports = {
  getDataFromCache,
  saveDataToCache
};

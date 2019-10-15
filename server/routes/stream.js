const express = require('express');
var Twit = require('twit');

const router = express.Router();

var T = new Twit({
    consumer_key: process.env.T_CONSUMER_KEY,
    consumer_secret: process.env.T_CONSUMER_SECRET,
    access_token: process.env.T_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.T_ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: true // optional - requires SSL certificates to be valid.
  });  

// Import twit library
var Twit = require('twit');

let stream = undefined;
router.post('/stream', function(req, res, next) {
    // const { queries } = req.body;
    // console.log(queries);

    // try {
    var toSearch = {
        track: ['Syria'],
        language: 'en'
    }
    stream = T.stream('statuses/filter', toSearch );

    console.log("Tracking: " + toSearch.track);
    // turn on stream
    stream.on('message', function(tweet) {
        console.log(tweet);
    })

    //Check limit
    stream.on('limit', function(message) {
        console.log("Limit Reached: " + message);
    });

    stream.on('disconnect', function(message) {
        console.log("Stream Disconnected: " + message);
    });

    stream.on('error', function(message) {
        console.log("Stream error: " + message);
    });

    stream.on('reconnect', function (request, response, connectInterval) {
        console.log("Attempting to reconnect");
        if (response) {
            console.log("Connection result: " + response);
        }
    });

    setTimeout(function() {
        stream.stop(); // stops stream
        console.log("Stream closed");
    }, 900000);
});

router.post('/stop', function(req, res, next){
    stream.stop();
    res.sendStatus(200);
});

module.exports = router;
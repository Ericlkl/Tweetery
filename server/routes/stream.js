const express = require('express');
var Twit = require('twit');

const router = express.Router();

const { analyseSentiment } = require('../scripts/processAnalysis');

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

async function myTimer() {
    try {
        // analyse the tweets
        const emotions = await analyseSentiment(data);
        console.log(emotions);

        // save to db

        // flush data
        data = '';
    } catch (err) {
        return err;
    }
}

let stream;
let myVar;
let data = '';

router.post('/stream', function(req, res, next) {
    const query = req.body.query;
    myVar = setInterval(myTimer, 10000);

    var toSearch = {
        track: [query],
        language: 'en'
    }
    stream = T.stream('statuses/filter', toSearch );

    console.log("Tracking: " + toSearch.track);
    // turn on stream
    stream.on('message', function(message) {
        // console.log(message.created_at, message.text + '\n');
        data += message.text + '\n';
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
    if (stream === undefined){
        res.status(400).send({ Response: "There is no valid stream"})
    } else {
        stream.stop();
        clearInterval(myVar);
        res.sendStatus(200);
    }    
});

module.exports = router;
const express = require('express');
var Twit = require('twit');
var Twit = require('twit');

const router = express.Router();

const { analyseTweets } = require('../scripts/processAnalysis');

var T = new Twit({
    consumer_key: process.env.T_CONSUMER_KEY,
    consumer_secret: process.env.T_CONSUMER_SECRET,
    access_token: process.env.T_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.T_ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
    strictSSL: true // optional - requires SSL certificates to be valid.
  });  

// DB models
var emotionModel = require('../services/storeEmotion');

let stream;
let timer;
let data = '';

router.post('/stream', function(req, res, next) {
    try {
        const query = req.body.query;
        timer = setInterval(sendData, 30000); // sends data every minute

        async function sendData() {
            // analyse the tweets
            const emotions = await analyseTweets(data);
            console.log(emotions);

            // send to client
            res.write(JSON.stringify(emotions));
    
            // save to db
            await new emotionModel({ query, emotions }).save();
    
            // flush data
            data = '';
        }

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
            clearInterval(myVar);
            stream.stop(); // stops stream
            console.log("Stream closed");
            res.end();
        }, 300000); // stops after 5 minutes
    } catch (err) {
        clearInterval(timer);
        console.log("stream error: ", err);
        res.send("Stream error: ", err);
    }
    
});

router.post('/stop', function(req, res, next){
    if (stream === undefined){
        res.status(400).send("No valid stream");
    } else {
        stream.stop();
        clearInterval(timer);
        res.status(200).send("Stream stopped");
    }    
});

module.exports = router;
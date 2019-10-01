// Import Modules
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

// Load the enviroment variables
require('dotenv').config()

// Import twit library
var Twit = require('twit')

var T = new Twit({
    consumer_key:         process.env.T_CONSUMER_KEY,
    consumer_secret:      process.env.T_CONSUMER_SECRET,
    access_token:         process.env.T_ACCESS_TOKEN_KEY,
    access_token_secret:  process.env.T_ACCESS_TOKEN_SECRET,
    timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
    strictSSL:            true,     // optional - requires SSL certificates to be valid.
  })

router.get('/', check('query', 'Invalid query')
    .not()
    .isEmpty(),
    (req, res) => {
        // Check the URL params
        const errors = validationResult(req);

        // If there is error detected by checker
        if (!errors.isEmpty) {
            //return error message
            return res.status(400).json({ errors: errors.array() });
        }

        // Get query string value from URL query
        const { query } = req.query;

        // Construct the search params
        const params = {
            q: query, 
            count: 10,
            result_type: 'recent',
            lang: 'en'
        };

        // search twitter for all tweets containing the query
        T.get('search/tweets', params , function(err, data) {
            if (err){
                console.log(err);
                return res.status(400).send({ msg: 'Error searching tweets'});
            }
            // console.log(data);
            res.json(data);
        });
    });

module.exports = router;
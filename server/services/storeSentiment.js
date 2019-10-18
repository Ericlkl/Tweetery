var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * Sentiment Mongo schema for searching and storing in db
 */
var SentimentSchema = new Schema({
    "query": {
        type: String,
    },
    "sentiment": {
        type: Object
    }
});

module.exports = mongoose.model('sentiment', SentimentSchema);
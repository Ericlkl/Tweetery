var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var SentimentSchema = new Schema({
    "query": {
        type: String,
    },
    "sentiment": {
        type: Object
    }
});

module.exports = mongoose.model('sentiment', SentimentSchema);
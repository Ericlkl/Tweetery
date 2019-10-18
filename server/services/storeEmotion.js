var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * Emotion Mongo schema for searching and storing in db
 */
var EmotionSchema = new Schema({
    "date": {
        type: String,
        default: null
    },
    "query": {
        type: String
    },
    "emotions": {
        type: Object,
        default: null,
    }
});

module.exports = mongoose.model('emotions', EmotionSchema);
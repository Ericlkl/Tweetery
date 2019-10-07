var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EmotionSchema = new Schema({
    "date": {
        type: String
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
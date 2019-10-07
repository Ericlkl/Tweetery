var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TrendingSchema = new Schema({
    "tag": {
        "date": {
            type: String
        }
    },
    "trending": {
        type: Array,
        default: null,
    }
});

module.exports = mongoose.model('trends', TrendingSchema);
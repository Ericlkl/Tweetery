var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * Trending Mongo schema for searching and storing in db
 */
var TrendingSchema = new Schema({
    "time": {
        type: Date
    },
    "trending": {
        type: Array,
        default: null,
    }
});

module.exports = mongoose.model('trends', TrendingSchema);
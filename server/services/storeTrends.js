var mongoose = require('mongoose');

var Schema = mongoose.Schema;

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
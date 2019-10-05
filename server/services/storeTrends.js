var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TrendingSchema = new Schema({
    tag: {
        type: String,
        default: null
    }
});

module.exports = mongoose.model('trends', TrendingSchema);
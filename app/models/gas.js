var mongoose = require('mongoose');

module.exports = mongoose.model('Gas', {
    time: {
        type: Date,
        default: Date.now
    },
    value: {
        type: Number,
        default: 0
    }
});
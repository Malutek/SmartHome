var mongoose = require('mongoose');

module.exports = mongoose.model('Humidity', {
    time: {
        type: Date,
        default: Date.now
    },
    value: {
        type: Number,
        default: 0
    }
});
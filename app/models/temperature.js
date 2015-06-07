var mongoose = require('mongoose');

module.exports = mongoose.model('Temperature', {
    time: {
        type: Date,
        default: Date.now
    },
    value: {
        type: Number,
        default: 0
    }
});
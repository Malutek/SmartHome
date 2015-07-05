var mongoose = require('mongoose');

module.exports = mongoose.model('Device', {
    name: {
        type: String,
        required: true
    },
    pin: {
        type: Number,
        required: true
    },
    state: {
        type: Boolean,
        default: false
    },
    lastTriggered: {
        type: Date
    },
});
var mongoose = require('mongoose');

module.exports = mongoose.model('Alarm', {
    isArmed: {
        type: Boolean,
        required: true
    },
    isTriggered: {
        type: Boolean,
        required: true
    },
    conditions: [{
        sensor: String
    }],
    triggers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device'
    }]
});
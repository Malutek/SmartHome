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
    triggers: [{
        device: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Device'
        },
        isUsed: {
            type: Boolean,
            required: true,
        }
    }],
    annunciators: [{
        device: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Device'
        },
        isUsed: {
            type: Boolean,
            required: true,
        }
    }]
});
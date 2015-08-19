var mongoose = require('mongoose');

module.exports = mongoose.model('Device', {
    name: {
        type: String,
        required: true
    },
    pin: {
        type: Number,
        required: false
    },
    mqtt: {
        topic: {
            type: String,
            required: true
        },
        required: false
    },
    state: {
        type: Boolean,
        default: false
    },
    canBeToggled: {
        type: Boolean,
        default: false
    },
    usedByAlarm: {
        type: Boolean,
        required: false,
        default: false
    },
    alarmTrigger: {
        type: Boolean,
        required: false,
        default: false
    },
    lastTriggered: {
        type: Date
    },
});
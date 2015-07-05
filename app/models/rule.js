var mongoose = require('mongoose');

module.exports = mongoose.model('Rule', {
    name: {
        type: String,
        required: true
    },
    condition: {
        sensor: String,
        operator: String,
        value: String,
    },
    device: {
        type: String,
        default: false
    },
});
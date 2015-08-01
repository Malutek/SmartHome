var mongoose = require('mongoose');

module.exports = mongoose.model('Rule', {
    name: {
        type: String,
        required: true
    },
    conditions: [{
        sensor: String,
        operator: String,
        value: Date,
    }],
    device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device'
    },
});
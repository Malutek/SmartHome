var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    user: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    }
});
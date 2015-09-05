var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    login: {
        type: String,
        default: ''
    },
    password: {
        type: String,
        default: ''
    },
    isHome: {
        type: Boolean,
        default: false
    },
    isSmart: {
        type: Boolean,
        default: true
    }
});
var emitter = require('./../services/emitter');
var logger = require('./../logger');
var alarmOverseer = require('./alarmOverseer');
var User = require('./../models/user');

function performIfIsSmart(action) {
    User.findOne({}).exec(function (req, user) {
        if (user.isSmart) {
            action();
        }
    });
}

function onUserEnteredHome() {
    performIfIsSmart(alarmOverseer.disarm);
    console.log('onUserEnteredHome');
}

function onUserLeftHome() {
    performIfIsSmart(alarmOverseer.arm);
    console.log('onUserLeftHome');
}

function run(onSuccess) {
    emitter.on('userEnteredHome', onUserEnteredHome);
    emitter.on('userLeftHome', onUserLeftHome);
    logger.info('LocationOverseer ready...');
    onSuccess();
}

module.exports.run = run;
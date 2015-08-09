var _ = require('underscore'); // jshint ignore:line
var moment = require('moment');
var Alarm = require('./models/alarm');
var board = require('./board');
var logger = require('./logger').alarm;
var interceptor = require('./services/keyboardInterceptor');
var mailer = require('./services/mailer');

var definition;
console.log(moment().calendar());

function isTriggered() {
    return definition.isTriggered;
}

function doTriggerAlarm() {
    logger.warn('Alarm triggered!');
    board.toggleBuzzer(true);

    mailer.sendMail('Movement Detector (PIR)', moment().calendar());
}

function triggerAlarm() {
    definition.isTriggered = true;
    definition.save(function (err) {
        if (err) {
            logger.error('Error ocurred on triggering an alarm. ' + err);
        } else {
            doTriggerAlarm();
        }
    });
}

function doHaltAlarm() {
    board.toggleBuzzer(false);
}

function haltAlarm() {
    definition.isTriggered = false;
    definition.save(function (err) {
        if (err) {
            logger.error('Error ocurred on halting an alarm. ' + err);
        } else {
            logger.warn('Alarm halted!');
            doHaltAlarm();
        }
    });
}

function doArm() {
    var sec = 1;
    var interval = setInterval(function () {
            logger.warn('Arming in ' + (sec--) + ' seconds..');
            if (sec === 0) {
                clearInterval(interval);
                logger.warn('Alarm is armed!');
                board.readPir(function (err, data) {
                    if (err) {
                        logger.error('Error reading Pir: ' + err);
                    } else if (data) {
                        var pir = board.getDeviceByName('Pir');
                        var pirTrigger = _.filter(definition.triggers, function (trigger) {
                            return trigger.device.pin === pir.pin;
                        });

                        var shouldTrigger = pirTrigger.some(function (triggerDef) {
                            return triggerDef.isUsed;
                        });
                        if (shouldTrigger) {
                            triggerAlarm();
                        } else {
                            logger.debug('Pir will not not trigger, because is not active!');
                        }
                    }
                });
            }
        },
        1000);
}

function arm() {
    logger.silly('arm()');
    if (!definition.isArmed) {
        definition.isArmed = true;
        definition.save(function (err) {
            if (err) {
                logger.error('Error ocurred on arming an alarm. ' + err);
            } else {
                doArm();
            }
        });
    }
}

function doDisarm() {
    logger.warn('Alarm is disarmed!');
    board.readPir(function () {});
}

function disarm() {
    logger.silly('disarm()');
    if (definition.isArmed) {
        definition.isArmed = false;
        definition.save(function (err) {
            if (err) {
                logger.error('Error ocurred on disarming an alarm. ' + err);
            } else {
                doDisarm();
            }
        });
    }
}


function isValidResponse(alarmDef) {
    return alarmDef !== undefined && alarmDef.isArmed !== undefined && alarmDef.isTriggered !== undefined;
}

function oversee(callback) {
    Alarm.findOne({})
        .populate('triggers.device')
        .exec(function (req, alarmDef) {
            //            logger.debug(alarmDef.toObject());
            //logger.silly('Alarm definition updated. (oversee)');
            if (definition !== undefined && isValidResponse(alarmDef)) {
                if (definition.isArmed && !alarmDef.isArmed) {
                    logger.debug('wylaczenie uzbrojenia');
                    doDisarm();
                } else if (!definition.isArmed && alarmDef.isArmed) {
                    logger.debug('wlaczenie uzbrojenia');
                    doArm();
                }
                if (definition.isTriggered && !alarmDef.isTriggered) {
                    logger.debug('wylaczenie alarmu');
                    doHaltAlarm();
                } else if (!definition.isTriggered && alarmDef.isTriggered) {
                    logger.debug('wlaczenie alarmu');
                    doTriggerAlarm();
                }
            }
            definition = alarmDef;

            if (callback) {
                callback();
            }
        });
}

// For debugging puropses
function setupDebugHooks() {
    interceptor.hook('a', arm);
    interceptor.hook('s', disarm);
    interceptor.hook('z', triggerAlarm);
    interceptor.hook('x', haltAlarm);
}

function run(onSuccess) {
    setupDebugHooks();
    oversee(function () {
        setInterval(oversee, 1000);

        if (definition.isArmed) {
            doArm();
        }

        logger.info('AlarmOverseer ready...');
        onSuccess();
    });
}

module.exports.run = run;
module.exports.isTriggered = isTriggered;
module.exports.triggerAlarm = triggerAlarm;
module.exports.haltAlarm = haltAlarm;
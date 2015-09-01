var _ = require('underscore'); // jshint ignore:line
var moment = require('moment');
var emitter = require('./services/emitter');
var Alarm = require('./models/alarm');
var board = require('./board');
var logger = require('./logger').alarm;
var interceptor = require('./services/keyboardInterceptor');
var mailer = require('./services/mailer');

var definition;
var isSnoozed;

function isTriggered() {
    return definition.isTriggered;
}

function isDeviceActive(deviceName, collection, isMqtt) {
    var device = board.getDeviceByName(deviceName);
    var deviceStatus;

    if (isMqtt) {
        deviceStatus = _.filter(collection, function (annunciator) {
            return device.mqtt !== undefined && annunciator.device.mqtt.topic === device.mqtt.topic;
        });
    } else {
        deviceStatus = _.filter(collection, function (annunciator) {
            return device.pin !== undefined && annunciator.device.pin === device.pin;
        });
    }
    return deviceStatus.some(function (ds) {
        return ds.isUsed;
    });
}

function snoozeAnnunciators() {
    logger.silly('Alarm annunciators are set to snooze.');
    isSnoozed = true;
    setTimeout(function () {
        isSnoozed = false;
    }, 30000);
}

function doTriggerAlarm(deviceName) {
    if (isSnoozed) {
        logger.silly('Alarm annunciators snoozed. Leaving..');
        return;
    }
    snoozeAnnunciators();

    logger.warn('Alarm triggered!');
    if (isDeviceActive('Buzzer', definition.annunciators)) {
        board.toggleBuzzer(true);
    } else {
        logger.silly('Buzzer will not not buzz, because it is not active!');
    }
    if (definition.emailSettings.isUsed) {
        mailer.notifyAlarmTrigger(deviceName, moment().calendar());
    } else {
        logger.silly('Email will not be send, because it is not active!');
    }
}

function triggerAlarm(deviceName) {
    definition.isTriggered = true;
    definition.save(function (err) {
        if (err) {
            logger.error('Error ocurred on triggering an alarm. ' + err);
        } else {
            doTriggerAlarm(deviceName);
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

function armPir() {
    board.readPir(function (err, data) {
        if (err) {
            logger.error('Error reading Pir: ' + err);
        } else if (data) {
            if (isDeviceActive('Pir', definition.triggers)) {
                triggerAlarm('Pir');
            } else {
                logger.debug('Pir will not not trigger, because it is not active!');
            }
        }
    });
}

function onDoorOpened() {
    logger.silly('Doors opened.');
    if (isDeviceActive('Doors Sensor', definition.triggers, true)) {
        triggerAlarm('Doors Sensor');
    } else {
        logger.debug('Doors Sensor will not not trigger, because it is not active!');
    }
}

function onDoorClosed() {
    logger.silly('Doors closed.');
    // NYI
}

function armDoors() {
    emitter.on('doorOpened', onDoorOpened);
    emitter.on('doorClosed', onDoorClosed);
}

function doArm() {
    var sec = 1;
    var interval = setInterval(function () {
            logger.warn('Arming in ' + (sec--) + ' seconds..');
            if (sec === 0) {
                clearInterval(interval);
                armPir();
                armDoors();
                logger.warn('Alarm is armed!');
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
    emitter.removeListener('doorOpened', onDoorOpened);
    emitter.removeListener('doorClosed', onDoorClosed);
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
        .populate('annunciators.device')
        .exec(function (req, alarmDef) {
            if (definition !== undefined && isValidResponse(alarmDef)) {
                if (definition.isArmed && !alarmDef.isArmed) {
                    doDisarm();
                } else if (!definition.isArmed && alarmDef.isArmed) {
                    doArm();
                }
                if (definition.isTriggered && !alarmDef.isTriggered) {
                    doHaltAlarm();
                } else if (!definition.isTriggered && alarmDef.isTriggered) {
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
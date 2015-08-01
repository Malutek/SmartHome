var Alarm = require('./models/alarm');
var board = require('./board');
var logger = require('./logger').alarm;

var definition;
var isArmed;

function triggerAlarm() {
    board.toggleBuzzer(true);
}

function oversee() {
    setInterval(function () {
        logger.debug('just running');
    }, 5000);
}

function updateDefinitions(callback) {
    Alarm.findOne({})
        .populate('device')
        .exec(function (req, def) {
            logger.debug(def);
            logger.silly('Alarm definition updated.');
            definition = def;

            if (callback) {
                callback();
            }
        });
}

function setup() {
    setInterval(function () {
        board.read({
            pin: 8
        }, function (data) {
            if (data) {
                triggerAlarm();
            }
        });
    }, 500);
}

function run(onSuccess) {
    setup();
    updateDefinitions(function () {
        setInterval(updateDefinitions, 15000);
        oversee();
        logger.info('AlarmOverseer ready...');
        onSuccess();
    });
}

module.exports.run = run;
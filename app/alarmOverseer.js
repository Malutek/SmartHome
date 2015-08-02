var Alarm = require('./models/alarm');
var board = require('./board');
var logger = require('./logger').alarm;

var definition;
var isArmed;
var device;

function triggerAlarm() {
    board.toggleBuzzer(true);
}

function oversee() {
    setInterval(function () {
        //        board.getDevice(8).emitRead(); // For debuggeing purposes
    }, 5000);
}

function updateDefinitions(callback) {
    Alarm.findOne({})
        .populate('device')
        .exec(function (req, def) {
            //            logger.debug(def);
            logger.silly('Alarm definition updated.');
            definition = def;

            if (callback) {
                callback();
            }
        });
}

function setup() {
    device = board.readPir(function (err, data) {
        if (err) {
            logger.error('Error reading Pir: ' + err);
        } else if (data) {
            logger.silly('pir = ' + data);
            triggerAlarm();
        }
    });
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
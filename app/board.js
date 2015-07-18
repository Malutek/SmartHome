var five = require('johnny-five');
var logger = require('./logger').board;
var Galileo = require("galileo-io");
var GalileoPcEmulator = require('./services/galileoPcEmulator');

var board;
var devs = new Array();
var dev10;
var dev11;
var dev12;
var dev13;

function turnOn(device) {
    logger.info('Turning on ' + device.name + ' (PIN ' + device.pin + ')');
    devs[device.pin].on();
}

function turnOff(device) {
    logger.info('Turning off ' + device.name + ' (PIN ' + device.pin + ')');
    devs[device.pin].off();
}

function run(onSuccess) {
    if (Galileo.isGalileo()) {
        board = new five.Board({
            io: new Galileo()
        });

        board.on('ready', function () {
            dev10 = new five.Pin(10);
            dev11 = new five.Pin(11);
            dev12 = new five.Pin(12);
            dev13 = new five.Pin(13);
            logger.info('Galileo ready...');
            onSuccess();
        });
    } else {
        board = new GalileoPcEmulator();
        devs[10] = board.getDev();
        devs[11] = board.getDev();
        devs[12] = board.getDev();
        devs[13] = board.getDev();

        logger.info('Pc Galileo Emulator ready...');
        onSuccess();
    }
}

module.exports.run = run;
module.exports.turnOn = turnOn;
module.exports.turnOff = turnOff;
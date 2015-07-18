var five = require('johnny-five');
var logger = require('./logger').board;
var Galileo = require("galileo-io");
var GalileoPcEmulator = require('./services/galileoPcEmulator');

var led;
var board;

function turnOn() {
    led.on();
}

function turnOff() {
    led.off();
}

function run(onSuccess) {
    if (Galileo.isGalileo()) {
        board = new five.Board({
            io: new Galileo()
        });

        board.on('ready', function () {
            led = new five.Led(13);
            logger.info('Galileo ready...');
            onSuccess();
        });
    } else {
        board = new GalileoPcEmulator();
        led = board.getLed();
        logger.info('Pc Galileo Emulator ready...');
        onSuccess();
    }
}

module.exports.run = run;
module.exports.turnOn = turnOn;
module.exports.turnOff = turnOff;
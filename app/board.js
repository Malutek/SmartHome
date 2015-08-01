var five = require('johnny-five');
var logger = require('./logger').board;
var Galileo = require('galileo-io');
var GalileoPcEmulator = require('./services/galileoPcEmulator');

var board;
var devs = [];

function isOn(device) {
    var dev = devs[device.pin];
    return dev.isOn();
}

function turnOn(device) {
    logger.info('Turning on ' + device.name + ' (PIN ' + device.pin + ')');
    devs[device.pin].on();
}

function turnOff(device) {
    logger.info('Turning off ' + device.name + ' (PIN ' + device.pin + ')');
    devs[device.pin].off();
}

function read(device, callback) {
    board.digitalRead(device.pin, callback);
}

function toggleBuzzer(shouldTurnOn) {
    if (shouldTurnOn) {
        turnOn(devs[12]);
    } else {
        turnOff(devs[12]);
    }
}

function run(onSuccess) {
    if (Galileo.isGalileo()) {
        board = new five.Board({
            io: new Galileo()
        });

        board.on('ready', function () {
            dev[8] = new five.Pin(8);
            dev[10] = new five.Pin(10);
            dev[11] = new five.Pin(11);
            dev[12] = new five.Pin(12);
            dev[13] = new five.Pin(13);
            logger.info('Galileo ready...');
            onSuccess();
        });
    } else {
        board = new GalileoPcEmulator();
        devs[8] = board.createDev(8);
        devs[10] = board.createDev(10);
        devs[11] = board.createDev(11);
        devs[12] = board.createDev(12, 'Buzzer');
        devs[13] = board.createDev(12);
        board.devs = devs;

        logger.info('Pc Galileo Emulator ready...');
        onSuccess();
    }
}

module.exports.run = run;
module.exports.turnOn = turnOn;
module.exports.turnOff = turnOff;
module.exports.isOn = isOn;
module.exports.read = read;
module.exports.toggleBuzzer = toggleBuzzer;
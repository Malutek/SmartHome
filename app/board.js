var _ = require('underscore'); // jshint ignore:line
var five = require('johnny-five');
var logger = require('./logger').board;
var Galileo = require('galileo-io');
var GalileoPcEmulator = require('./services/galileoPcEmulator');
var sensorsOverseer = require('./overseers/sensorsOverseer');

var board;
var devs = [];

var deviceDefinitions = [{
    name: 'Pir',
    pin: 8
}, {
    name: 'Światło Góra',
    pin: 11
}, {
    name: 'Buzzer',
    pin: 12
}, {
    name: 'Wiatrak',
    pin: 13
}, {
    name: 'Gas Sensor',
    pin: "A0"
}, {
    name: 'Doors Sensor',
    mqtt: {
        topic: 'doors_sensor'
    }
}, {
    name: 'Window Sensor',
    mqtt: {
        topic: 'window_sensor'
    }
}];

function isEmulating() {
    return true;
    //return Galileo.isGalileo();
}

function isOn(deviceDefinition) {
    var device = devs[deviceDefinition.pin];
    return device.value !== undefined ? device.value : device.getState();
}

function turnOn(device) {
    var name = device.name ? device.name : device.id;
    logger.info('Turning on ' + name + ' (PIN ' + device.pin + ')');
    devs[device.pin].high();
}

function turnOff(device) {
    var name = device.name ? device.name : device.id;
    logger.info('Turning off ' + name + ' (PIN ' + device.pin + ')');
    devs[device.pin].low();
}

// For debugging purposes
function getDevice(pin) {
    return devs[pin];
}

function getDeviceByName(name) {
    if (isEmulating()) {
        return _.findWhere(devs, {
            name: name
        });
    } else {
        return _.findWhere(devs, {
            id: name
        });
    }
}

function getDeviceDefinition(name) {
    return _.findWhere(deviceDefinitions, {
        name: name
    });
}

function read(device, callback) {
    device.read(callback);
}

function readPir(callback) {
    var pir = getDeviceDefinition('Pir');
    read(devs[pir.pin], callback);
}

function toggleBuzzer(shouldTurnOn) {
    var buzzer = getDeviceDefinition('Buzzer');
    if (shouldTurnOn) {
        if (!isOn(devs[buzzer.pin])) {
            turnOn(devs[buzzer.pin]);
        }
    } else {
        turnOff(devs[buzzer.pin]);
    }
}

function run(onSuccess) {
    if (!isEmulating()) {
        board = new five.Board({
            io: new Galileo()
        });

        board.on('ready', function () {
            deviceDefinitions.forEach(function (deviceDefinition) {
                if (deviceDefinition.pin) {
                    if (!isNaN(deviceDefinition.pin)) {
                        devs[deviceDefinition.pin] = new five.Pin(deviceDefinition.pin);
                        devs[deviceDefinition.pin].id = deviceDefinition.name;
                    } else {
                        devs[deviceDefinition.pin] = new five.Sensor({
                            pin: deviceDefinition.pin,
                            freq: 1000,
                            threshold: 20,
                            type: "analog"
                        });
                    }
                }
            });
            devs[100 + devs.length] = {
                id: 'Doors Sensor',
                mqtt: {
                    topic: 'doors_sensor'
                }
            };

            board.devs = devs;
            sensorsOverseer.init(devs['A0']);

            logger.info('Galileo ready...');

            onSuccess();
        });
    } else {
        board = new GalileoPcEmulator();
        deviceDefinitions.forEach(function (deviceDefinition) {
            if (deviceDefinition.mqtt) {
                devs[100 + devs.length] = board.createMqttDev(deviceDefinition.mqtt.topic, deviceDefinition.name);
            } else {
                devs[deviceDefinition.pin] = board.createDev(deviceDefinition.pin, deviceDefinition.name);
            }
        });

        var interceptor = require('./services/keyboardInterceptor');
        interceptor.hook('q', function () {
            getDeviceByName('Pir').emitRead(true);
        });

        devs[10] = board.createDev(10);
        devs[11] = board.createDev(11);
        devs[13] = board.createDev(13);

        logger.info('Pc Galileo Emulator ready...');
        onSuccess();
    }
}

module.exports.isEmulating = isEmulating;
module.exports.run = run;
module.exports.turnOn = turnOn;
module.exports.turnOff = turnOff;
module.exports.isOn = isOn;
module.exports.read = read;
module.exports.readPir = readPir;
module.exports.toggleBuzzer = toggleBuzzer;
module.exports.getDevice = getDevice;
module.exports.getDeviceByName = getDeviceByName;
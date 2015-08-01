var logger = require('./../logger').emulator;
var GalileoPcEmulator = function () {};

var Dev = function (pin, name) {
    this.name = name ? name : 'Mock Device';
    this.pin = pin ? pin : -1;
    this.state = false;
};

Dev.prototype.on = function () {
    this.state = true;
    logger.silly('On');
};

Dev.prototype.off = function () {
    this.state = false;
    logger.silly('Off');
};

Dev.prototype.isOn = function () {
    return this.state;
};

Dev.prototype.digitalRead = function (callback) {
    var mockBoolean = Math.random() < 0.5;
    logger.silly(this.name + ' mocks digitalRead = ' + mockBoolean);
    callback(mockBoolean);
};

GalileoPcEmulator.prototype.devs = [];

GalileoPcEmulator.prototype.digitalRead = function (pin, callback) {
    var dev = this.devs[pin];
    dev.digitalRead(callback);
};

GalileoPcEmulator.prototype.createDev = function (pin, name) {
    return new Dev(pin, name);
};

module.exports = GalileoPcEmulator;
var logger = require('./../logger').emulator;
var GalileoPcEmulator = function () {}

var Dev = function () {}

Dev.prototype.state = false;

Dev.prototype.on = function () {
    this.state = true;
    logger.silly('On');
}

Dev.prototype.off = function () {
    this.state = false;
    logger.silly('Off');
}

Dev.prototype.isOn = function () {
    return this.state;
}

GalileoPcEmulator.prototype.getDev = function () {
    return new Dev();
}

module.exports = GalileoPcEmulator;
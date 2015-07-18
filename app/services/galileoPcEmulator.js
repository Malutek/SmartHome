var logger = require('./../logger').emulator;
var GalileoPcEmulator = function () {}

var Dev = function () {}

Dev.prototype.on = function (device) {
    logger.silly('On');
}

Dev.prototype.off = function (device) {
    logger.silly('Off');
}

GalileoPcEmulator.prototype.getDev = function () {
    return new Dev();
}

module.exports = GalileoPcEmulator;
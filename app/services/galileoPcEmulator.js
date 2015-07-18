var logger = require('./../logger').board;
var GalileoPcEmulator = function () {}
var Led = function () {}

GalileoPcEmulator.prototype.getLed = function () {
    return new Led();
}

Led.prototype.on = function () {
    logger.debug('on');
}

Led.prototype.off = function () {
    logger.debug('off');
}

module.exports = GalileoPcEmulator;
var logger = require('./../logger').emulator;
var GalileoPcEmulator = function () {};

var Dev = (function () {

    function Dev(pin, n) {
        this.name = n ? n : 'Mock Device';
        this.pin = pin ? pin : -1;
        this.state = false;
    }

    Dev.prototype.emitRead = function (value) {
        if (this.readCallback !== undefined) {
            if (!value) {
                value = Math.random() < 0.1;
            }
            logger.debug(this.name + ' emits ' + value + '! (Mock)');
            this.readCallback(null, value);
        }
    };

    Dev.prototype.high = function () {
        this.state = true;
        logger.silly(this.name + ' set to high');
    };

    Dev.prototype.low = function () {
        this.state = false;
        logger.silly(this.name + ' set to low');
    };

    Dev.prototype.getState = function () {
        return this.state;
    };

    Dev.prototype.read = function (callback) {
        this.readCallback = callback;
    };

    return Dev;
})();

GalileoPcEmulator.prototype.devs = [];
GalileoPcEmulator.prototype.createDev = function (pin, name) {
    return new Dev(pin, name);
};

module.exports = GalileoPcEmulator;
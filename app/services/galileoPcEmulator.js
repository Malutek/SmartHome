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

var MqttDev = (function () {

    function MqttDev(topic, n) {
        this.name = n ? n : 'Mock Mqtt Device';
        this.mqtt = {
            topic: topic ? topic : 'unkown_topic'
        }
        this.state = false;
    }

    MqttDev.prototype.emitRead = function (value) {
        if (this.readCallback !== undefined) {
            if (!value) {
                value = Math.random() < 0.1;
            }
            logger.debug(this.name + ' emits ' + value + '! (Mock)');
            this.readCallback(null, value);
        }
    };

    MqttDev.prototype.high = function () {
        this.state = true;
        logger.silly(this.name + ' set to high');
    };

    MqttDev.prototype.low = function () {
        this.state = false;
        logger.silly(this.name + ' set to low');
    };

    MqttDev.prototype.getState = function () {
        return this.state;
    };

    MqttDev.prototype.read = function (callback) {
        this.readCallback = callback;
    };

    return MqttDev;
})();

GalileoPcEmulator.prototype.devs = [];
GalileoPcEmulator.prototype.createDev = function (pin, name) {
    return new Dev(pin, name);
};
GalileoPcEmulator.prototype.createMqttDev = function (topic, name) {
    return new MqttDev(topic, name);
};
module.exports = GalileoPcEmulator;
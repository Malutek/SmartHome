var winston = require('winston');

function getNow() {
    var d = new Date();
    d.setTime(d.getTime() + Math.abs(d.getTimezoneOffset()) * 60 * 1000);
    return d;
};

winston.loggers.add('common', {
    console: {
        level: 'debug',
        colorize: true,
        label: 'Common',
        timestamp: function () {
            var d = new Date();
            return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        }
    },
    file: {
        filename: 'log.txt',
        label: 'Common',
        timestamp: function () {
            return getNow();
        }
    }
});

winston.loggers.add('mqtt', {
    console: {
        level: 'debug',
        colorize: true,
        label: 'MQTT',
        timestamp: function () {
            var d = new Date();
            return d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        }
    },
    file: {
        filename: 'log.txt',
        label: 'MQTT',
        timestamp: function () {
            return getNow();
        }
    }
});

module.exports = winston.loggers.get('common');
module.exports.mqtt = winston.loggers.get('mqtt');
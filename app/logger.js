var winston = require('winston');

function getNow() {
    var d = new Date();
    d.setTime(d.getTime() + Math.abs(d.getTimezoneOffset()) * 60 * 1000);
    return d;
}

function getConfig(label, fileLogName, level) {
    return {
        console: {
            level: level ? level : 'debug',
            colorize: true,
            label: label,
            timestamp: function () {
                var d = new Date();
                return d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
            }
        },
        file: {
            filename: fileLogName,
            label: label,
            timestamp: function () {
                return getNow();
            }
        }
    };
}

winston.loggers.add('common', getConfig('Common', 'log.txt'));
winston.loggers.add('mqtt', getConfig('MQTT', 'log_mqtt.txt'));
winston.loggers.add('api', getConfig('Api', 'log_api.txt'));
winston.loggers.add('board', getConfig('Board', 'log_board.txt'));
winston.loggers.add('emulator', getConfig('Emulator', 'log_emulator.txt'));
winston.loggers.add('rules', getConfig('RulesOverseer', 'log_rules.txt', 'silly'));

module.exports = winston.loggers.get('common');
module.exports.mqtt = winston.loggers.get('mqtt');
module.exports.api = winston.loggers.get('api');
module.exports.board = winston.loggers.get('board');
module.exports.emulator = winston.loggers.get('emulator');
module.exports.rules = winston.loggers.get('rules');
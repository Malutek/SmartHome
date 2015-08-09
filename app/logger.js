var winston = require('winston');
var moment = require('moment');

function getConfig(label, fileLogName, level) {
    return {
        console: {
            level: level ? level : 'debug',
            colorize: true,
            label: label,
            prettyPrint: true,
            timestamp: function () {
                return moment().format('HH:mm:ss').toString();
            }
        },
        file: {
            filename: fileLogName,
            label: label,
            timestamp: function () {
                return moment().format('HH:mm:ss').toString();
            }
        }
    };
}

winston.loggers.add('common', getConfig('Common', 'log.txt'));
winston.loggers.add('mqtt', getConfig('MQTT', 'log_mqtt.txt', 'info'));
winston.loggers.add('api', getConfig('Api', 'log_api.txt'));
winston.loggers.add('board', getConfig('Board', 'log_board.txt'));
winston.loggers.add('emulator', getConfig('Emulator', 'log_emulator.txt'));
winston.loggers.add('rules', getConfig('RulesOverseer', 'log_rules.txt'));
winston.loggers.add('alarm', getConfig('AlarmOverseer', 'log_alarm.txt', 'silly'));

module.exports = winston.loggers.get('common');
module.exports.mqtt = winston.loggers.get('mqtt');
module.exports.api = winston.loggers.get('api');
module.exports.board = winston.loggers.get('board');
module.exports.emulator = winston.loggers.get('emulator');
module.exports.rules = winston.loggers.get('rules');
module.exports.alarm = winston.loggers.get('alarm');
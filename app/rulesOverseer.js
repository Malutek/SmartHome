var Humidity = require('./models/humidity');
var Temperature = require('./models/temperature');
var Rule = require('./models/rule');
var async = require('async');
var board = require('./board');
var logger = require('./logger').rules;

var isStarted = false;
var rules;

var operators = {
    'greater': function (a, b) {
        return a > b;
    },
    'lesser': function (a, b) {
        return a < b;
    },
    'equal': function (a, b) {
        return a == b;
    },
};

function handleRule(condition, sensorValue) {
    return operators[condition.operator](sensorValue, condition.value);
}

function handleTemperature(condition) {
    Temperature.findOne({}).sort({
        'time': -1
    }).exec(function (err, temp) {
        return handleRule(condition, temp.value);
    });
}

function handleHumidity(condition) {
    Humidity.findOne({}).sort({
        'time': -1
    }).exec(function (err, humid) {
        return handleRule(condition, humid.value);
    });
}

function oversee() {
    setInterval(function () {
        rules.forEach(function (rule) {
            var isTriggered = rule.conditions.every(function (condition) {
                switch (condition.sensor) {
                case 'Temperature':
                    return handleTemperature(condition);
                case 'Humidity':
                    return handleHumidity(condition);
                }
            });
            if (isTriggered) {
                if (!board.isOn(rule.device)) {
                    board.turnOn(rule.device);
                }
            } else {
                if (board.isOn(rule.device)) {
                    board.turnOff(rule.device);
                }
            }
        });
    }, 5000);
}

function updateRules(callback) {
    Rule.find({})
        .populate('device')
        .sort({
            time: 1
        })
        .exec(function (req, docs) {
            rules = docs;
            if (callback) {
                callback();
            }
        });
}

function run(onSuccess) {
    updateRules(function () {
        setInterval(updateRules, 15000);
        oversee();
        logger.info('RulesOverseer ready...');
        onSuccess();

    });
}

module.exports.run = run;
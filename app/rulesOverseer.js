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

function handleRule(rule, sensorValue) {
    var condition = rule.condition;
    return operators[condition.operator](sensorValue, condition.value);
}

function handleTemperature(rule) {
    Temperature.findOne({}).sort({
        'time': -1
    }).exec(function (err, temp) {
        if (handleRule(rule, temp.value) && !board.isOn(rule.device)) {
            board.turnOn(rule.device);
        } else {
            board.turnOff(rule.device);
        }
    });
}

function handleHumidity(rule) {
    Humidity.findOne({}).sort({
        'time': -1
    }).exec(function (err, humid) {
        if (handleRule(rule, humid.value)) {
            board.turnOn(rule.device);
        } else {
            board.turnOff(rule.device);
        }
    });
}

function oversee() {
    setInterval(function () {
        rules.forEach(function (rule) {
            switch (rule.condition.sensor) {
            case 'Temperature':
                handleTemperature(rule);
                break;
            case 'Humidity':
                handleHumidity(rule);
                break;
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
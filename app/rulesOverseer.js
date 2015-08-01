var _ = require('underscore'); // jshint ignore:line
var Humidity = require('./models/humidity');
var Temperature = require('./models/temperature');
var Rule = require('./models/rule');
var board = require('./board');
var logger = require('./logger').rules;

var rules;

var operators = {
    'greater': function (a, b) {
        return a > b;
    },
    'lesser': function (a, b) {
        return a < b;
    },
    'equal': function (a, b) {
        return a == b; // jshint ignore:line
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

function handleTime(condition) {
    var time = new Date(condition.value);
    var now = new Date();
    var p1 = operators[condition.operator](now.getHours(), time.getHours()); // hours
    var p2 = time.getHours() === now.getHours() && operators[condition.operator](now.getMinutes(), time.getMinutes()); // minutes

    //    logger.silly('Is... ' + now + ' ' + condition.operator + ' than ' + time + '? ' + (p1 || p2));
    //    logger.silly('Op = ' + condition.operator + ', val = ' + (p1 || p2));
    return (p1 || p2);
}

function handleRuleForTime(rule) {
    var timeConditions = _.where(rule.conditions, {
        sensor: 'Time'
    });
    if (timeConditions.length === 1 && timeConditions[0].operator === 'equal') {
        return handleTime(timeConditions[0]);
    } else if (timeConditions.length === 2) {
        return handleTime(timeConditions[0]) && handleTime(timeConditions[1]);
    } else if (timeConditions.length !== 0) {
        logger.error('Invalid rule\'s conditions definition - "' + rule.name + '"');
    }
}

function oversee() {
    setInterval(function () {
        rules.forEach(function (rule) {

            var isTriggeredByTime = handleRuleForTime(rule);
            var isTriggered = rule.conditions.every(function (condition) {
                switch (condition.sensor) {
                case 'Temperature':
                    return handleTemperature(condition);
                case 'Humidity':
                    return handleHumidity(condition);
                }
            });
            if (isTriggered || isTriggeredByTime) {
                logger.silly('Triggered rule - "' + rule.name + '"');
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
            logger.silly('Rules updated.');
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
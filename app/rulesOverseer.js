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
        if (handleRule(rule, temp.value)) {
            board.turnOn();
        } else {
            board.turnOff();
        }
    });
}

function handleHumidity(rule) {
    Humidity.findOne({}).sort({
        'time': -1
    }).exec(function (err, humid) {
        if (handleRule(rule, humid.value)) {
            board.turnOn();
        } else {
            board.turnOff();
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

    // refreshing rules
    setInterval(function () {
        Rule.find({}).sort({
            time: 1
        }).exec(function (req, docs) {
            rules = docs;
        });
    }, 15000);
}

function run(onSuccess) {
    Rule.find({}).sort({
        time: 1
    }).exec(function (req, docs) {
        rules = docs;
        oversee();
        logger.info('RulesOverseer ready...');
        onSuccess();
    });
}

module.exports.run = run;
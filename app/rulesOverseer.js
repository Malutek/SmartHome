var Temperature = require('./models/temperature');
var Rule = require('./models/rule');
var board = require('./board');

var rules;

function handleTemperature(rule) {
    Temperature.findOne({}).sort({
        'time': -1
    }).exec(function (err, temp) {
        if (temp.value > rule.condition.value) {
            board.turnOn();
            console.log('Turn on!');
        } else {
            board.turnOff();
            console.log('Turn off!');
        }
    });
    //console.log('Should handle temp -' + rule);
}

function handleHumidity(rule) {
    //console.log('Should handle humid -' + rule);
}

function oversee() {
    setInterval(function () {
        rules.forEach(function (rule) {
            switch (rule.condition.sensor) {
            case 'Temperature':
                handleTemperature(rule);
                break;
            case 'Humidity':
                //handleHumidity(rule);
                break;
            }
        });
    }, 5000);
}

function init() {
    Rule.find({}).sort({
        time: 1
    }).exec(function (req, docs) {
        rules = docs;
        oversee();
    });
}

module.exports = function () {
    init();
};
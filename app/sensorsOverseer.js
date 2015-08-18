var moment = require('moment');
var Gas = require('./models/gas');
var logger = require('./logger').sensor;
var mailer = require('./services/mailer');

function oversee(value) {
    if (value > 40) {
        mailer.notifyGasLeakage(moment().calendar());
    }
}

function init(sensor) {
    sensor.scale(0, 100).on("change", function () {
        var val = this.value;
        oversee(val);
        Gas.create({
            value: Math.round(val * 100) / 100,
        }, function (err) {
            if (err) {
                logger.error('Error ocurred on sending gas to database. ' + err);
            } else {
                logger.info('Gas added - ' + val + '%');
            }
        });
    });
}

module.exports.init = init;
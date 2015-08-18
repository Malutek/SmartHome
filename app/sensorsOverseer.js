var Gas = require('./models/gas');
var logger = require('./logger').sensor;

function init(sensor) {
    sensor.scale(0, 100).on("change", function () {
        var val = this.value;
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
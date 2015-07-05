var Temperature = require('./models/temperature');
var Humidity = require('./models/humidity');
var logger = require('./logger').mqtt;

var DHT_22_TOPIC = 'dht22_sensor';

module.exports = function (client) {
    client.on('message', function (topic, message) {
        if (topic === DHT_22_TOPIC) {
            var msg = JSON.parse(message.toString());

            Temperature.create({
                value: Number(msg.temperature),
            }, function (err) {
                if (err) {
                    logger.error('Error ocurred on sending temperature to database. ' + err);
                } else {
                    logger.info('Temperature added - ' + msg.temperature + 'C');
                }
            });

            Humidity.create({
                value: Number(msg.humidity),
            }, function (err) {
                if (err) {
                    logger.error('Error ocurred on sending humidity to database. ' + err);
                } else {
                    logger.info('Humidity added - ' + msg.humidity + '%');
                }
            });
        }
    });
};
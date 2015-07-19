var config = require('./config');
var mqtt = require('mqtt');
var Temperature = require('./models/temperature');
var Humidity = require('./models/humidity');
var logger = require('./logger').mqtt;

var DHT_22_TOPIC = 'dht22_sensor';

var client;
var isStarted;
var isConnected = false;
var onFirstStart;

function getMockTemp(min, max) {
    return Math.random() * (28 - 22) + 22;
}

function listen() {
    logger.info('MQTT Client listening...');
    client.subscribe(DHT_22_TOPIC);
    client.on('message', function (topic, message) {
        if (topic === DHT_22_TOPIC) {
            var msg = JSON.parse(message.toString());

            var temperature = Number(msg.temperature);
            Temperature.create({
                value: temperature,
            }, function (err) {
                if (err) {
                    logger.error('Error ocurred on sending temperature to database. ' + err);
                } else {
                    logger.info('Temperature added - ' + temperature + 'C');
                }
            });

            var humidity = Number(msg.humidity);
            Humidity.create({
                value: humidity,
            }, function (err) {
                if (err) {
                    logger.error('Error ocurred on sending humidity to database. ' + err);
                } else {
                    logger.info('Humidity added - ' + humidity + '%');
                }
            });
        }
    });
}

function connect() {
    logger.debug('connect()');
    client = mqtt.connect(config.mqttConnectionString);
    client.on('connect', function () {
        isConnected = true;
        logger.info('MQTT Client ready...');

        listen();
        if (!isStarted) {
            isStarted = true;
            onFirstStart();
        }
    });
    client.on('reconnect', function () {
        logger.debug('reconnect event()');
    });
    client.on('close', function () {
        if (isConnected) {
            logger.info('MQTT Client closed, will try to reconnect..');
            client.unsubscribe(DHT_22_TOPIC);
            client.end(true);
            isConnected = false;
        }
    });
}

function run(onSuccess) {
    logger.debug('run()');
    onFirstStart = onSuccess;

    connect();
    setInterval(function () {
        logger.debug('monitor loop()');
        if (!isConnected) {
            connect();
        }
    }, 60000);
}

module.exports.run = run;
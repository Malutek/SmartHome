/// <reference path="typings/node/node.d.ts"/>
/// <reference path="typings/node/winston.d.ts"/>

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var mqtt = require('mqtt')
var port = process.env.PORT || 8080;

var config = require('./app/config');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var favicon = require('serve-favicon');
var logger = require('./app/logger');

app.use(express.static(__dirname + '/public'));
app.use(favicon(__dirname + '/public/assets/img/favicon.ico'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    'extended': 'true'
}));
app.use(bodyParser.json());
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
}));
app.use(methodOverride('X-HTTP-Method-Override'));

mongoose.connect(config.mongoConnectionString);
var mqttClient = mqtt.connect(config.mqttConnectionString);
require('./app/mqtt')(mqttClient);

mqttClient.on('connect', function () {
    logger.info('MQTT Client connected.');
    mqttClient.subscribe('dht22_sensor');
});
    
require('./app/api.js')(app);

app.listen(port, function () {
    logger.info('App listening on port', this.address().port);
});

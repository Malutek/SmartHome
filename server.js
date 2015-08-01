/// <reference path="typings/node/node.d.ts"/>
/// <reference path="typings/node/winston.d.ts"/>

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var board = require('./app/board');
var mqtt = require('./app/mqtt');
var rulesOverseer = require('./app/rulesOverseer.js');
var alarmOverseer = require('./app/alarmOverseer.js');
var port = process.env.PORT || 8080;

var config = require('./app/config');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var favicon = require('serve-favicon');
var async = require('async');
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
require('./app/api.js')(app);

async.series([
    function (onSuccess) {
            mqtt.run(onSuccess);
    },
    function (onSuccess) {
            board.run(onSuccess);
    },
    function (onSuccess) {
            app.listen(port, function () {
                logger.info('Server is listening on port', this.address().port);
                onSuccess();
            });
    },
    function (onSuccess) {
            rulesOverseer.run(onSuccess);
    },
    function (onSuccess) {
            alarmOverseer.run(onSuccess);
    }],
    function (err) {
        if (err) {
            logger.error('Smart failed to start!');
        } else {
            logger.info('\n\n >>> SmartHome is ready.. <<< \n');
        }
    }
);
//var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var async = require('async');
var config = require('./config');
var path = require('path');
var emitter = require('./services/emitter');

var Temperature = require('./models/temperature');
var Humidity = require('./models/humidity');
var Gas = require('./models/gas');
var Device = require('./models/device');
var Rule = require('./models/rule');
var Alarm = require('./models/alarm');
var User = require('./models/user');

var logger = require('./logger').api;
var serviceOverseer = require('./services/serviceOverseer');

module.exports = function (app) {
    //    app.use('/api', expressJwt({
    //        secret: config.jwtSecretToken
    //    }));

    // --- API ---
    app.post('/authenticate', function (req, res) {
        var credentials = req.body;
        User.findOne(credentials, function (err, user) {
            if (err) {
                // TODO Obsługa błędów
            } else {
                if (!user) {
                    res.send(401, 'Wrong user or password');
                    return;
                } else {
                    var token = jwt.sign(user, config.jwtSecretToken, {
                        expiresInMinutes: 60 * 5
                    });

                    res.json({
                        token: token,
                        mongo: config.mongoLab
                    });
                }
            }
        });
    });

    app.post('/api/devices/', function (req, res) {
        Device.create({
            name: req.body.name,
            pin: req.body.pin,
            lastTriggered: Date.now()
        }, function (err) {
            if (err) {
                logger.error('Error ocurred on sending device to database. ' + err);
                res.send(err);
            } else {
                var msg = 'Device added - ' + req.body.name;
                logger.info(msg);
                res.send({
                    msg: msg
                });
            }
        });
    });

    app.post('/api/rules/', function (req, res) {
        Rule.create(req.body, function (err) {
            if (err) {
                logger.error('Error ocurred on sending rule to database. ' + err);
                res.send(err);
            } else {
                var msg = 'Rule added - ' + req.body.name;
                logger.info(msg);
                res.send({
                    msg: msg
                });
            }
        });
    });

    app.put('/api/devices/', function (req, res) {
        var device = req.body;
        device.lastTriggered = Date.now();
        Device.update({
            _id: device._id,
        }, device, function (err) {
            var msg = err ? err : 'Ok';
            res.send({
                msg: msg
            });
        });
    });

    app.put('/api/alarms/', function (req, res) {
        var alarmDef = req.body;
        Alarm.update({
            _id: alarmDef._id
        }, alarmDef, function (err) {
            logger.silly('Alarm status updated: ' + alarmDef);
            var msg = err ? err : 'Ok';
            res.send({
                msg: msg
            });
        });
    });

    app.put('/api/users/', function (req, res) {
        var user = req.body;
        User.update({
            _id: user._id
        }, user, function (err) {
            logger.silly('User status updated: ' + user);
            if (!err) {
                if (user.isHome) {
                    emitter.emit('userEnteredHome');
                } else {
                    emitter.emit('userLeftHome');
                }
            }
            var msg = err ? err : 'Ok';
            res.send({
                msg: msg
            });
        });
    });

    app.get('/api/devices/', function (req, res) {
        Device.find({})
            .exec(function (req, docs) {
                res.json(docs);
            });
    });

    app.get('/api/devices/:type', function (req, res) {
        var type = req.params.type;
        if (type !== 'alarm') {
            res.status(404).send('Unknown filter type');
        } else {
            Device.find({
                    alarmTrigger: true
                })
                .exec(function (req, docs) {
                    res.json(docs);
                });
        }
    });

    app.get('/api/sensors/', function (req, res) {
        async.parallel([
                function (callback) {
                    Temperature.findOne({}).sort({
                        'time': -1
                    }).exec(function (err, temp) {
                        var res = temp.toObject();
                        res.name = 'Temperature';
                        callback(err, res);
                    });
                },
                function (callback) {
                    Humidity.findOne({}).sort({
                        'time': -1
                    }).exec(function (err, humidity) {
                        var res = humidity.toObject();
                        res.name = 'Humidity';
                        callback(err, res);
                    });
                },
                function (callback) {
                    Gas.findOne({}).sort({
                        'time': -1
                    }).exec(function (err, gas) {
                        var res = gas.toObject();
                        res.name = 'Gas';
                        callback(err, res);
                    });
                }
            ],
            function (err, results) {
                res.json(results);
            });
    });

    app.get('/api/temperatures/', function (req, res) {
        Temperature.find({}).sort({
            time: 1
        }).exec(function (req, docs) {
            res.json(docs);
        });
    });

    app.get('/api/humidities/', function (req, res) {
        Humidity.find({}).sort({
            time: 1
        }).exec(function (req, docs) {
            res.json(docs);
        });
    });

    app.get('/api/gases/', function (req, res) {
        Gas.find({}).sort({
            time: 1
        }).exec(function (req, docs) {
            res.json(docs);
        });
    });

    app.get('/api/rules/', function (req, res) {
        Rule.find({})
            .populate('device')
            .sort({
                time: 1
            }).exec(function (req, docs) {
                res.json(docs);
            });
    });

    app.get('/api/alarms/', function (req, res) {
        Alarm.findOne({})
            .populate('triggers.device')
            .populate('annunciators.device')
            .exec(function (req, alarmDef) {
                res.json(alarmDef);
            });
    });

    app.get('/api/status/', function (req, res) {
        res.json(serviceOverseer.serviceStatus());
    });

    app.get('/api/users/', function (req, res) {
        User.findOne({}).exec(function (req, docs) {
            res.json(docs);
        });
    });

    // Setting home location 
    app.use(function (req, res) {
        res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    });
};
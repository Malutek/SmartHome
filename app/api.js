var expressJwt = require('express-jwt');
var jwt = require('jsonwebtoken');
var config = require('./config');
var path = require("path");

var Temperature = require('./models/temperature');
var Humidity = require('./models/humidity');
var User = require('./models/user');

module.exports = function (app) {
    app.use('/api', expressJwt({
        secret: config.jwtSecretToken
    }));

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
                        token: token
                    });
                }
            }
        });
    });

    app.get('/api/temperatures/', function (req, res) {
        Temperature.find({}).sort({time: 1}).exec(function (req, docs) {
            res.json(docs);
        });

    });

    app.get('/api/humidities/', function (req, res) {
        Humidity.find({}).sort({time: 1}).exec(function (req, docs) {
            res.json(docs);
        });
    });

    // Setting home location 
    app.use(function (req, res) {
        res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
    });
};
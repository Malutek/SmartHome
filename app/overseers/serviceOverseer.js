var mqtt = require('./../mqtt');

function serviceStatus() {
    return [{
        name: 'mqtt',
        status: mqtt.isRunning()
    }];
}

module.exports.serviceStatus = serviceStatus;
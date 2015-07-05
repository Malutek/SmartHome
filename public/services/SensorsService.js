app.service('SensorsService', function (ApiService) {
    return {
        getSensors: function () {
            return ApiService.getSensors()
                .then(function (sensors) {
                    sensors.forEach(function (sensor) {
                        var diff = new Date() - new Date(sensor.time);
                        var diffMins = Math.round(((diff % 86400000) % 3600000) / 60000); // minutes

                        if (diffMins <= 2) {
                            sensor.state = 'operational';
                        } else if (diffMins >= 2 && diffMins <= 10) {
                            sensor.state = 'delayed';
                        } else {
                            sensor.state = 'offline';
                        }
                    });
                    return sensors;
                });
        }
    };
});
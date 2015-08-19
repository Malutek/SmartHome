app.controller('DashboardController', function ($scope, ApiService, AlarmService, SensorsService) {

    function getSensor(sensorName, sensors) {
        return _.find(sensors, function (sensor) {
            return sensor.name === sensorName;
        });
    }

    (function () {
        ApiService.getDevices()
            .then(function (devices) {
                $scope.devices = devices;
            });
        ApiService.getRules()
            .then(function (rules) {
                $scope.rules = rules;
            });
        ApiService.getServiceStatus()
            .then(function (statuses) {
                $scope.statuses = statuses;
                $scope.isOk = statuses.every(function (element) {
                    return element.status;
                });
            });
        AlarmService.isArmed()
            .then(function (isArmed) {
                $scope.isArmed = isArmed;
            });
        SensorsService.getSensors().then(function (sensors) {
            $scope.sensors = sensors;
            $scope.tempSensor = getSensor('Temperature', sensors);
            $scope.humSensor = getSensor('Humidity', sensors);
            $scope.gasSensor = getSensor('Gas', sensors);
        });
    }());
});
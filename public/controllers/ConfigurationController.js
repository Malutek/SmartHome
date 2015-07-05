app.controller('ConfigurationController', function ($scope, ApiService, SensorsService) {

    $scope.toggleDeviceState = function (device) {
        device.state = !device.state;
        device.lastTriggered = Date.now();
        ApiService.updateDevice(device);
    };

    (function () {
        ApiService.getDevices()
            .then(function (devices) {
                $scope.devices = devices;
            });

        SensorsService.getSensors().then(function (sensors) {
            $scope.sensors = sensors;
        });
    }());
});
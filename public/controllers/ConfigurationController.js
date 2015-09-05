app.controller('ConfigurationController', function ($scope, ApiService, SensorsService) {

    $scope.toggleDeviceState = function (device) {
        device.state = !device.state;
        device.lastTriggered = Date.now();
        ApiService.updateDevice(device);
    };

    $scope.toggleIsSmartState = function () {
        $scope.user.isSmart = !$scope.user.isSmart;
        ApiService.updateUser($scope.user);
    };

    (function () {
        ApiService.getDevices().then(function (devices) {
            $scope.devices = devices;
        });

        SensorsService.getSensors().then(function (sensors) {
            $scope.sensors = sensors;
        });
        ApiService.getUser().then(function (user) {
            $scope.user = user;
        });
    }());
});
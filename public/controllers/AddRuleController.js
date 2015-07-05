app.controller('AddRuleController', function ($scope, $modal, $controller, ApiService, SensorsService, $modalInstance) {

    $controller('ModalInstanceController', {
        $modalInstance: $modalInstance,
        $scope: $scope
    });

    $scope.operators = [{
            displayName: 'greater',
            value: '>'
    },
        {
            displayName: 'equal',
            value: '='
    }, {
            displayName: 'lesser',
            value: '<'
    }];

    $scope.rule = {
        name: '',
        condition: {
            sensor: '',
            operator: '',
            value: '',
        },
        device: ''
    };

    $scope.add = function () {
        ApiService.createRule($scope.rule).then(function () {
            $scope.ok();
        });
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
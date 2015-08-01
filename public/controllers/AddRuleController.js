app.controller('AddRuleController', function ($scope, $modal, $controller, ApiService, SensorsService, $modalInstance, moment) {

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

    function validate() {
        return $scope.rule.name && $scope.rule.device && $scope.rule.conditions.every(function (condition) {
            return condition.sensor && condition.operator && condition.value;
        });
    }

    $scope.$watch('rule', function () {
        $scope.isValid = validate();
    }, true);

    $scope.rule = {
        name: '',
        conditions: [{
            sensor: '',
            operator: '',
            value: 0,
        }],
        device: ''
    };

    $scope.reset = function (condition) {
        condition.value = '';
    };

    $scope.addCondition = function () {
        $scope.rule.conditions.push({
            condition: {
                sensor: '',
                operator: '',
                value: 0
            }
        });
    };

    $scope.add = function () {

        var device = _.find($scope.devices, function (device) {
            return device.name === $scope.rule.device;
        });
        $scope.rule.device = device;

        $scope.rule.conditions.forEach(function (condition) {
            if (condition.value instanceof Date) {
                condition.value = moment(condition.value).toDate();
            }
        });

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
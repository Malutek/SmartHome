app.controller('AlarmController', function ($scope, $rootScope, AlarmService) {

    function arm() {
        AlarmService.arm();
    }

    function disarm() {
        AlarmService.disarm();
    }

    function trigger() {
        AlarmService.trigger();
    }

    function halt() {
        AlarmService.halt();
    }

    $scope.toggleArmState = function () {
        if ($scope.isArmed) {
            disarm();
        } else {
            arm();
        }
    };

    $scope.toggleAlarmState = function () {
        if ($scope.isTriggered) {
            halt();
        } else {
            trigger();
        }
    };

    $scope.updateTriggers = function () {
        AlarmService.updateTriggers($scope.triggers);
    };

    (function () {
        AlarmService.isArmed().then(function (isArmed) {
            $scope.isArmed = isArmed;
        });
        AlarmService.isTriggered().then(function (isTriggered) {
            $scope.isTriggered = isTriggered;
        });
        AlarmService.getTriggers().then(function (triggers) {
            $scope.triggers = triggers;
        });

        $rootScope.$on('isArmed', function (events, isArmed) {
            $scope.isArmed = isArmed;
        });
        $rootScope.$on('isTriggered', function (events, isTriggered) {
            $scope.isTriggered = isTriggered;
        });
    })();
});
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

    (function () {
        $scope.isArmed = AlarmService.isArmed();
        $scope.isTriggered = AlarmService.isTriggered();

        $rootScope.$on('isArmed', function (events, isArmed) {
            $scope.isArmed = isArmed;
        });
        $rootScope.$on('isTriggered', function (events, isTriggered) {
            $scope.isTriggered = isTriggered;
        });
    })();
});
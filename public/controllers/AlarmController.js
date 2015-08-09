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

    $scope.updateAnnunciators = function () {
        AlarmService.updateAnnunciators($scope.annunciators);
    };

    $scope.updateEmailSettings = function () {
        AlarmService.updateEmailSettings($scope.emailSettings);
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
        AlarmService.getAnnunciators().then(function (annunciators) {
            $scope.annunciators = annunciators;
        });
        AlarmService.getEmailSettings().then(function (emailSettings) {
            $scope.emailSettings = emailSettings;
        });
        $rootScope.$on('isArmed', function (events, isArmed) {
            $scope.isArmed = isArmed;
        });
        $rootScope.$on('isTriggered', function (events, isTriggered) {
            $scope.isTriggered = isTriggered;
        });
    })();
});
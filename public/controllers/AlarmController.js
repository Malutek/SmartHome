app.controller('AlarmController', function ($scope, AlarmService) {

    function arm() {
        AlarmService.arm();
    }

    function disarm() {
        AlarmService.disarm();
    }

    $scope.toggle = function () {
        console.log($scope.isArmed);
        if ($scope.isArmed) {
            disarm();
        } else {
            arm();
        }
        $scope.updateState();
    };

    $scope.updateState = function () {
        $scope.isArmed = AlarmService.isArmed();
    };

    (function () {
        $scope.updateState();
    })();
});
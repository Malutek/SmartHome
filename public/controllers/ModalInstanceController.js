app.controller('ModalInstanceController', function ($scope, $modalInstance) {
    $scope.ok = function (result) {
        $modalInstance.close(result);
    };

    $scope.dismiss = function () {
        $modalInstance.dismiss('cancel');
    };
});
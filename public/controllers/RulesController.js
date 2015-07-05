app.controller('RulesController', function ($scope, $modal, ApiService, SensorsService) {

    $scope.addRule = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'views/addRuleModalTemplate.html',
            controller: 'AddRuleController',
        });
        modalInstance.result.then(function (result) {
            refresh();
        });
    };

    function refresh() {
        ApiService.getRules().then(function (rules) {
            $scope.rules = rules;
            console.log(rules);
        });
    };

    refresh();
});
app.controller('LoginController', function ($scope, $state, $location, AuthService) {

    // Turned off for dev 
    //    if (AuthService.isAuthenticated()) {
    //        $location.path('dashboard');
    //    }

    $scope.isError = false;

    $scope.closeAlert = function () {
        $scope.isError = false;
    };

    $scope.submit = function () {
        AuthService.authenticate($scope.login, $scope.password)
            .then(function () {
                if (AuthService.isAuthenticated()) {
                    $state.go('dashboard');
                } else {
                    $scope.isError = true;
                }
            });
    };

    $scope.logout = function () {
        AuthService.logout();
        $state.go('login');
    };
});
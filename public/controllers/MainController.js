app.controller('MainController', function ($scope, $state, $window, AuthService) {

    $scope.isAuthenticated = function () {
        return AuthService.isAuthenticated();
    };

    $scope.logout = function () {
        AuthService.logout();
        $state.go('login');
    };
});
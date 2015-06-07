app.controller('MainController', function ($scope, $state, $window, AuthService) {

    $scope.isAuthenticated = AuthService.isAuthenticated;

    $scope.logout = function () {
        AuthService.logout();
        $state.go('login');
    };
});
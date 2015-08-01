app.service('AuthService', function ($window, localStorageService, ApiService) {
    return {
        isAuthenticated: function () {
            return $window.sessionStorage.token !== undefined;
        },
        authenticate: function (user, password) {
            return ApiService.authenticate(user, password)
                .then(function (data) {
                    $window.sessionStorage.token = data.token;
                    localStorageService.set('mongoCredentials', data.mongo);
                }, function () {
                    delete $window.sessionStorage.token;
                    localStorageService.clearAll();
                });
        },
        logout: function () {
            $window.sessionStorage.token = '';
            delete $window.sessionStorage.token;
            localStorageService.clearAll();
        }
    };
});
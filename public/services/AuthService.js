app.service('AuthService', function ($window, localStorageService, ApiService) {
    var isAuth = false;

    return {
        isAuthenticated: function () {
            return $window.sessionStorage.token !== undefined;
        },
        authenticate: function (user, password) {
            return ApiService.authenticate(user, password)
                .then(function (data) {
                    isAuth = true;
                    $window.sessionStorage.token = data.token;
                    localStorageService.set('mongoCredentials', data.mongo);
                }, function () {
                    isAuth = false;
                    delete $window.sessionStorage.token;
                    localStorageService.clearAll();
                });
        },
        logout: function () {
            isAuth = false;
            $window.sessionStorage.token = '';
            delete $window.sessionStorage.token;
            localStorageService.clearAll();
        }
    };
});
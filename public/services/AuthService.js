app.service('AuthService', function ($window, ApiService) {
    var isAuth = false;

    return {
        isAuthenticated: function () {
            return $window.sessionStorage.token !== undefined;
        },

        authenticate: function (user, password) {
            return ApiService.authenticate(user, password)
                .then(function (response) {
                    isAuth = true;
                    $window.sessionStorage.token = response.data.token;
                }, function () {
                    delete $window.sessionStorage.token;
                });
        },
        logout: function () {
            isAuth = false;
            $window.sessionStorage.token = '';
            delete $window.sessionStorage.token;
        }
    };
});
app.service('ApiService', function ($http) {

    return {
        authenticate: function (login, password) {
            return $http.post('/authenticate', {
                login: login,
                password: password
            });
        },
        getTemperatures: function () {
            return $http.get('/api/temperatures')
                .then(function (res) {
                return res.data;
            });
        },
        getHumidities: function () {
            return $http.get('/api/humidities')
                .then(function (res) {
                return res.data;
            });
        }
    };
});
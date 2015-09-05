app.service('ApiService', function ($http, localStorageService) {
    var mongo = localStorageService.get('mongoCredentials');
    var documentLimit = 10000;

    function extractResponse(response) {
        return response.data;
    }

    function get(url) {
        return $http.get(url).then(extractResponse);
    }

    return {
        authenticate: function (login, password) {
            return $http.post('/authenticate', {
                login: login,
                password: password
            }).then(extractResponse).then(function (data) {
                mongo = data.mongo;
                return data;
            });
        },
        createRule: function (rule) {
            return $http.post('/api/rules', rule).then(extractResponse);
        },
        updateDevice: function (device) {
            return $http.put('api/devices', device);
        },
        updateAlarm: function (alarm) {
            return $http.put('api/alarms', alarm);
        },
        updateUser: function (user) {
            return $http.put('api/users', user);
        },
        getTemperatures: function () {
            return $http.get(mongo.url + '/temperatures', {
                    params: {
                        l: documentLimit,
                        s: {
                            time: 1
                        },
                        apiKey: mongo.apiKey
                    }
                })
                .then(function (res) {
                    return res.data;
                });
        },
        getHumidities: function () {
            return $http.get(mongo.url + '/humidities', {
                    params: {
                        l: documentLimit,
                        s: {
                            time: 1
                        },
                        apiKey: mongo.apiKey
                    }
                })
                .then(function (res) {
                    return res.data;
                });
        },
        getGases: function () {
            return $http.get(mongo.url + '/gas', {
                    params: {
                        l: documentLimit,
                        s: {
                            time: 1
                        },
                        apiKey: mongo.apiKey
                    }
                })
                .then(function (res) {
                    return res.data;
                });
        },
        getDevices: function () {
            return get('/api/devices');
        },
        getSensors: function () {
            return get('/api/sensors');
        },
        getRules: function () {
            return get('/api/rules');
        },
        getAlarmDefinition: function () {
            return get('/api/alarms');
        },
        getServiceStatus: function () {
            return get('/api/status');
        },
        getUser: function () {
            return get('/api/users');
        }
    };
});
/// <reference path="../typings/angularjs/angular.d.ts"/>

var app = angular.module('app', ['ui.router', 'ui.bootstrap', "highcharts-ng"]);

app.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'views/loginTemplate.html',
            controller: 'LoginController',
            authenticate: false
        })
        .state('dashboard', {
            url: '/dashboard',
            templateUrl: 'views/dashboardTemplate.html',
            controller: 'LoginController',
            authenticate: true
        })
        .state('diagnosticDashboard', {
            //        .state('dashboard.diagnostic', {
            url: '/dashboard/diagnostic',
            templateUrl: 'views/diagnosticDashboardTemplate.html',
            controller: 'DiagnosticController',
            authenticate: true
        });

    $urlRouterProvider.otherwise(function ($injector) {
        $injector.get('$state').go('dashboard');
    });

    $locationProvider.html5Mode(true);
});

app.run(function ($rootScope, $state, AuthService) {
    $rootScope.$on('$stateChangeStart', function (event, toState) {
        if (toState.authenticate && !AuthService.isAuthenticated()) {
            event.preventDefault();
            $state.go('login');
        }
    });
});

app.factory('authInterceptor', function ($rootScope, $q, $window) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
            }
            return config;
        },
        response: function (response) {
            if (response.status === 401) {
                // handle the case where the user is not authenticated
            }
            return response || $q.when(response);
        }
    };
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
});
app.controller('DiagnosticController', function ($scope, ApiService, localStorageService, ChartConfiguratorService) {
    $scope.tempChartConfig = ChartConfiguratorService.getTemperatureChartConfig();
    $scope.humChartConfig = ChartConfiguratorService.getHumidityChartConfig();

    (function () {
        ApiService.getTemperatures()
            .then(function (temperatures) {
                var arr = [];
                temperatures.forEach(function (temperature) {
                    arr.push([Date.parse(temperature.time.$date), temperature.value]);
                });
                $scope.tempChartConfig.series.push({
                    name: 'ESP8266 Temperature',
                    data: arr,
                    selected: 2
                });
            });

        ApiService.getHumidities()
            .then(function (humidities) {
                var arr = [];
                humidities.forEach(function (humidity) {
                    arr.push([Date.parse(humidity.time.$date), humidity.value]);
                });
                $scope.humChartConfig.series.push({
                    name: 'ESP8266 Humidity',
                    data: arr,
                    selected: 2
                });
            });
    })();
});
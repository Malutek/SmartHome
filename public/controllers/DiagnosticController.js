app.controller('DiagnosticController', function ($scope, ApiService, ChartConfiguratorService) {
    $scope.tempChartConfig = ChartConfiguratorService.getTemperatureChartConfig();
    $scope.humChartConfig = ChartConfiguratorService.getHumidityChartConfig();
    
    (function () {
        ApiService.getTemperatures()
            .then(function (temperatures) {
                var arr = [];
                var counter = 0;
                temperatures.forEach(function (temperature) {
                    if((counter++)%100 == 1)
                        console.log( counter + '/' + temperatures.length);
                    arr.push([Date.parse(temperature.time), Number(temperature.value)]);
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
                    arr.push([Date.parse(humidity.time), Number(humidity.value)]);
                });
                $scope.humChartConfig.series.push({
                    name: 'ESP8266 Humidity',
                    data: arr,
                    selected: 2
                });
            });
    })();
});
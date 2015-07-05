app.service('ChartConfiguratorService', function ($http) {

    var config = {
        options: {
            chart: {
                zoomType: 'x',
                renderTo: 'container'
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled: true
                    }
                }
            },
            rangeSelector: {
                enabled: true,
                selected: 3,
                buttons: [{
                    type: 'day',
                    count: 7,
                    text: '7d'
                        }, {
                    type: 'day',
                    count: 1,
                    text: '1d'
                        }, {
                    type: 'minute',
                    count: 360,
                    text: '6h'
                        }, {
                    type: 'minute',
                    count: 60,
                    text: '1h'
                        }, {
                    type: 'minute',
                    count: 15,
                    text: '15min'
                        }, {
                    type: 'all',
                    text: 'All'
                        }],
                inputEnabled: true,
            },
            navigator: {
                adaptToUpdatedData: false,
                enabled: true
            }
        },
        series: [],
        yAxis: [{
            opposite: false,
            labels: {
                align: 'right',
                x: -5
            }
        }],
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                hour: '%I %p',
                minute: '%I:%M %p'
            },
            title: {
                text: 'Date!'
            }
        },
        useHighStocks: true,
        loading: false
    };
    return {
        getTemperatureChartConfig: function () {
            return JSON.parse(JSON.stringify(config));;
        },
        getHumidityChartConfig: function () {
            return JSON.parse(JSON.stringify(config));;
        }
    };
});
angular.module('UnitFilters', []).filter('sensorUnit', function () {
    return function (input, args) {
        switch (args) {
        case 'Temperature':
            return input + ' °C';
        case 'Humidity':
            return input + ' %';
        case 'Gas':
            return input + ' %';
        default:
            return input;
        }
    };
});
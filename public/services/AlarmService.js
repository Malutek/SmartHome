app.factory('AlarmService', function (ApiService) {
    var isArmedState = false;
    return {
        isArmed: function () {
            return isArmedState;
        },
        arm: function () {
            isArmedState = true;
        },
        disarm: function () {
            isArmedState = false;
        }
    };
});
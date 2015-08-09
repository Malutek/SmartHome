app.factory('AlarmService', function ($rootScope, $timeout, ApiService) {
    var alarmDefinition;
    var isLoaded;

    (function oversee() {
        ApiService.getAlarmDefinition().then(function (alarmDef) {
            alarmDefinition = alarmDef;

            if (!isLoaded) {
                isLoaded = true;
                $rootScope.$watch(function () {
                    return alarmDefinition;
                }, function (newVal, oldVal) {
                    if (oldVal === newVal) {
                        return;
                    }

                    if (oldVal.isArmed !== newVal.isArmed) {
                        $rootScope.$emit('isArmed', newVal.isArmed);
                    }
                    if (oldVal.isTriggered !== newVal.isTriggered) {
                        $rootScope.$emit('isTriggered', newVal.isTriggered);
                    }
                }, true);
            }
            $timeout(oversee, 1000);
        });
    })();

    return {
        isArmed: function () {
            return alarmDefinition !== undefined ? alarmDefinition.isArmed : ApiService.getAlarmDefinition().then(function (alarmDef) {
                return alarmDef.isArmed;
            });
        },
        isTriggered: function () {
            return alarmDefinition !== undefined ? alarmDefinition.isArmed : ApiService.getAlarmDefinition().then(function (alarmDef) {
                return alarmDef.isTriggered;
            });
        },
        getTriggers: function () {
            return alarmDefinition !== undefined ? alarmDefinition.triggers : ApiService.getAlarmDefinition().then(function (alarmDef) {
                return alarmDef.triggers;
            });
        },
        updateTriggers: function (triggers) {
            alarmDefinition.triggers = triggers;
            ApiService.updateAlarm(alarmDefinition);
        },
        arm: function () {
            alarmDefinition.isArmed = true;
            ApiService.updateAlarm(alarmDefinition);
        },
        disarm: function () {
            alarmDefinition.isArmed = false;
            ApiService.updateAlarm(alarmDefinition);
        },
        trigger: function () {
            alarmDefinition.isTriggered = true;
            ApiService.updateAlarm(alarmDefinition);
        },
        halt: function () {
            alarmDefinition.isTriggered = false;
            ApiService.updateAlarm(alarmDefinition);
        }
    };
});
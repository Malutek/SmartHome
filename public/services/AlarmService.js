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
            return alarmDefinition !== undefined ? alarmDefinition.isTriggered : ApiService.getAlarmDefinition().then(function (alarmDef) {
                return alarmDef.isTriggered;
            });
        },
        getTriggers: function () {
            return alarmDefinition !== undefined ? alarmDefinition.triggers : ApiService.getAlarmDefinition().then(function (alarmDef) {
                return alarmDef.triggers;
            });
        },
        getAnnunciators: function () {
            return alarmDefinition !== undefined ? alarmDefinition.annunciators : ApiService.getAlarmDefinition().then(function (alarmDef) {
                return alarmDef.annunciators;
            });
        },
        getEmailSettings: function () {
            return alarmDefinition !== undefined ? alarmDefinition.emailSettings : ApiService.getAlarmDefinition().then(function (alarmDef) {
                return alarmDef.emailSettings;
            });
        },
        updateTriggers: function (triggers) {
            alarmDefinition.triggers = triggers;
            ApiService.updateAlarm(alarmDefinition);
        },
        updateAnnunciators: function (annunciators) {
            alarmDefinition.annunciators = annunciators;
            ApiService.updateAlarm(alarmDefinition);
        },
        updateEmailSettings: function (emailSettings) {
            alarmDefinition.emailSettings = emailSettings;
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
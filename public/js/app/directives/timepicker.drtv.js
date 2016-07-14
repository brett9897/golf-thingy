/**
 * Created by brettkoenig on 5/11/16.
 */
(function() {
    'use strict';

    angular
        .module('timepicker.directive', [])
        .directive('timepicker', timepicker)
    ;

    timepicker.$inject = [];

    function timepicker() {
        return {
            restrict: 'E',
            templateUrl: 'templates/angular-templates/directive-templates/timepicker.html',
            require: 'ngModel',
            link: link
        };

        function link(scope, elem, attr, ctrl) {
            scope.hour = 12;
            scope.hourError = false;
            scope.minute = 0;
            scope.minuteError = false;
            scope.period = 'AM';
            scope.isAM = true;

            scope.onHourChanged = function() {
                var stringVersion = scope.hour.toString();
                var date = moment();
                scope.hourError = false;

                if(stringVersion === '') {
                    scope.hourError = true;

                    return;
                }

                if(isNaN(scope.hour)) {
                    scope.hourError = true;

                    return;
                }

                stringVersion = stringVersion.replace('.', '');
                scope.hour = parseInt(stringVersion);

                if(scope.hour < 1 || scope.hour > 12) {
                    scope.hourError = true;

                    return;
                }

                ctrl.$setViewValue(date.hours(scope.hour).minutes(scope.minute));
            };
        }
    }
})();

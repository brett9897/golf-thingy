(function() {
    'use strict';

    angular
        .module('app.multiLaunchCreate', [
        ])
        .controller('indexController', indexController)
    ;

    indexController.$inject = ['$timeout', '$http', '$state', 'notifications', 'timeService'];

    function multiLaunchCreateController($timeout, $http, $state, notifications, timeService) {
        var vm = this; // jshint ignore:line

        init();

        function init() {
            var m = moment();
        }
    }
})();

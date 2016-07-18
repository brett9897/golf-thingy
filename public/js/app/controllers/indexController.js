(function() {
    'use strict';

    angular
        .module('app.indexController', [
        ])
        .controller('indexController', indexController)
    ;

    indexController.$inject = ['$timeout', '$http', '$state', 'notifications', 'timeService'];

    function indexController($timeout, $http, $state, notifications, timeService) {
        var vm = this; // jshint ignore:line

        init();
        vm.printShit = 'PRINT THIS CRAP';
        function init() {
            var m = moment();
        }
    }
})();

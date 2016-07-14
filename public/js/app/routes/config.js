(function() {
    'use strict';

    angular
        .module('app.routing', [])
        .config(routes)
        ;

    function routes($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: '../../views/index.jade',
                controller: 'indexController',
                controllerAs: 'ic'
            })
        ;
    }

    routes.$inject = ['$stateProvider', '$urlRouterProvider'];
})();

(function() {
    'use strict';

    angular.module('dgeApp', [
        'ui.router',
        'app.routing',
        'app.dashboard',
        'app.constants.events',
        'ui.bootstrap',
        'app.common.directives',
        'ngMessages',
        'time.service',
    ]);
})();

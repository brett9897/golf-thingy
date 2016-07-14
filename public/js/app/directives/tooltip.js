/**
 * Created by brettkoenig on 5/9/16.
 */
(function() {
    'use strict';

    angular
        .module('tooltip', [])
        .directive('tooltip', tooltip)
    ;

    tooltip.$inject = ['$timeout'];

    function tooltip($timeout) {
        var isolatedScope = {
            tooltipTitle: '='
        };

        return {
            restrict: 'A',
            scope: isolatedScope,
            link: link
        };

        function link(scope, elem, attr) {
            var jqueryElem = $(elem);

            if(scope.tooltipTitle) {
                attr.$set('title', scope.tooltipTitle);
            }

            jqueryElem.tooltip();

            jqueryElem.on('click', function(evt) {
                $timeout(function() {
                    if(jqueryElem.hasClass('disabled')) {
                        jqueryElem.tooltip('destroy');
                        jqueryElem.off('click');
                    }
                }, 250);
            });
        }
    }
})();

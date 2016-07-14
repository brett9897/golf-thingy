(function() {
        'use strict';

        angular
            .module('selectDeliveryGroup.directive', [])
            .directive('selectDeliveryGroup', selectDeliveryGroup)
        ;

        function selectDeliveryGroup() {
            selectDeliveryGroupController.$inject = ['$scope', '$element', '$timeout', 'multiLaunchService'];

            return {
                restrict: 'E',
                replace: true,
                scope: {
                    isVisible: '='
                },
                controller: selectDeliveryGroupController,
                controllerAs: 'sdgc',
                templateUrl: '/templates/angular-templates/directive-templates/selectDeliveryGroups.html'
            };

            function selectDeliveryGroupController($scope, $element, $timeout, multiLaunchService) {
                var vm = this; // jshint ignore:line

                vm.selectedDeliveryGroups = [];
                vm.deliveryGroupStatus = '';
                vm.onSaveClick = onSaveClick;

                init();

                function init() {
                    $scope.$watch('isVisible', showModal);

                    $element.bind('hide.bs.modal', function(e) {
                        $scope.isVisible = false;
                        $timeout(function() {
                            $scope.$apply();
                        });
                    });
                }

                function showModal(isVisible) {
                    if(isVisible) {
                        $element.modal('show');
                    }
                    else {
                        $element.modal('hide');
                    }
                }

                function onSaveClick() {
                    if(vm.deliveryGroupStatus !== '') {
                        vm.selectedDeliveryGroups.push({status: vm.deliveryGroupStatus});
                        vm.deliveryGroupStatus = '';
                    }

                    multiLaunchService.setSelectedDeliveryGroups(vm.selectedDeliveryGroups);
                    $scope.isVisible = false;
                }
            }
        }
    })();

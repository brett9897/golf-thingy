(function() {
    'use strict';

    angular
        .module('targetMultiLaunch.directive', [])
        .directive('targetMultiLaunch', selectTargetMultiLaunch)
    ;

    function selectTargetMultiLaunch() {
        selectTargetMultiLaunchController.$inject = ['$scope', '$http', 'multiLaunchService', 'notifications', 'EVENTS'];

        return {
            restrict: 'E',
            transclude: true,
            controller: selectTargetMultiLaunchController,
            controllerAs: 'tmlc',
            templateUrl: '/templates/angular-templates/directive-templates/targetMultiLaunch.html'
        };

        function selectTargetMultiLaunchController($scope, $http, multiLaunchService, notifications, EVENTS) {
            var vm = this; // jshint ignore:line

            vm.selectedTarget = {};
            vm.selectedClient = {};
            vm.clientTargets = [];
            vm.targets = [];
            vm.getTargets = getTargets;
            vm.getClients = getClients;
            vm.onSelectClient = onSelectClient;
            vm.onSelectTarget = onSelectTarget;
            vm.onRemoveClick = onRemoveClick;
            vm.targetSearchDisabled = true;
            vm.clientNameChanged = clientNameChanged;
            vm.onQuantityChanged = onQuantityChanged;
            vm.onQuantityBlur = onQuantityBlur;

            init();

            function init() {
                $scope.$on(EVENTS.targetsEmptied, onTargetsEmptied);
            }

            function clientNameChanged(event) {
                if(vm.selectedClient) {
                    vm.target = null;
                    vm.targetSearchDisabled = true;
                }
            }

            function onRemoveClick(clientTarget) {
                _.remove(vm.clientTargets, function(ct) {
                    return ct.target.targetId === clientTarget.target.targetId;
                });
                multiLaunchService.removeTarget(clientTarget.target.targetId);
            }

            function addClientTarget() {
                var ct = _.find(vm.clientTargets, function(ct) {
                    return ct.target.targetId === vm.selectedTarget.targetId;
                });

                if(ct === undefined) {
                    vm.selectedTarget.clientId = vm.selectedClient.clientId;
                    vm.clientTargets.push({client: vm.selectedClient, target: vm.selectedTarget});
                    multiLaunchService.addTarget(vm.selectedTarget);
                }
                else {
                    notifications.showWarning({message: 'Already added target : ' + ct.target.targetName});
                }

                vm.client = null;
                vm.target = null;
                vm.targetSearchDisabled = true;
            }

            function onSelectClient($item) {
                vm.selectedClient = $item;
                vm.targetSearchDisabled = false;
                getTargets($item.clientId);
            }

            function onSelectTarget($item) {
                vm.selectedTarget = $item;
                addClientTarget();
            }

            function onQuantityChanged(clientTarget) {
                if(!clientTarget.target.updatedQuantityErrors) {
                    clientTarget.target.updatedQuantityErrors = {};
                }

                if(clientTarget.target.updatedQuantity !== null && clientTarget.target.updatedQuantity !== undefined) {
                    clientTarget.target.updatedQuantityErrors.required = false;
                }
                else {
                    clientTarget.target.updatedQuantityErrors.required = true;
                }

                if(clientTarget.target.updatedQuantity < 0 || clientTarget.target.updatedQuantity > 10000000
                    || clientTarget.target.updatedQuantity > (clientTarget.target.quantity * 2)) {
                    clientTarget.target.updatedQuantityErrors.valueRange = true;
                }
                else {
                    clientTarget.target.updatedQuantityErrors.valueRange = false;
                }

                setValidity(clientTarget.target.updatedQuantityErrors);
            }

            function setValidity(errors) {
                var foundErrors;

                errors.invalid = false;

                foundErrors = _.find(errors, function(err) {
                    return err;
                });

                if(foundErrors) {
                    errors.invalid = true;
                }
                else {
                    errors.invalid = false;
                }
            }

            function onQuantityBlur(clientTarget) {
                clientTarget.target.updatedQuantityTouched = true;
            }

            function getTargets(clientId) {
                $http({
                    method: 'GET',
                    url: '/api/multilaunch/targets',
                    params: {
                        clientId: clientId
                    }
                })
                .then(function successCallback(resp) {
                    vm.targets = resp.data;
                }, function errorCallback(resp) {
                    notifications.showError({message: resp.data});
                });
            }

            function getClients(name) {
                if(name !== null) {
                    vm.clientSearch = name;
                }

                return $http({
                    method: 'GET',
                    url: '/api/multilaunch/clients',
                    params: {
                        clientName: vm.clientSearch
                    }
                })
                .then(function successCallback(resp) {
                    vm.clients = resp.data;

                    return resp.data.splice(0, 10);
                }, function errorCallback(resp) {
                    notifications.showError({message: resp.data});
                });
            }

            function onTargetsEmptied() {
                vm.clientTargets = [];
                vm.targets = multiLaunchService.getTargets();
            }
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('app.constants.events', [])
        .constant('EVENTS', {
        })
    ;
})();

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

(function() {
    'use strict';

    angular
        .module('app.common.directives', [
            'tooltip',
            'timepicker.directive'
        ])
    ;
})();

/**
 * Created by brettkoenig on 5/26/16.
 */
(function() {
    'use strict';

    angular
        .module('dualListbox.directive', [])
        .directive('dualListbox', dualListbox)
    ;

    dualListbox.$inject = ['$timeout'];

    function dualListbox($timeout) {
        var isolatedScope = {
            listItems: '=',
            selectedItems: '=',
            displayField: '@',
            idField: '@',
            onChange: '&'
        };

        return {
            restrict: 'E',
            scope: isolatedScope,
            link: link,
            templateUrl: 'templates/angular-templates/directive-templates/dualListbox.html'
        };

        function link(scope) {
            scope.isComplexObject = false;
            scope.availableItems = [];
            scope.itemsChosen = [];

            scope.availableItemClick = availableItemClick;
            scope.selectedItemClick = selectedItemClick;
            scope.moveAllRightClick = moveAllRightClick;
            scope.moveAllLeftClick = moveAllLeftClick;

            init();

            scope.$watch('listItems', function() {
                setAndSortAvailableItems();
            });

            scope.$watch('selectedItems', function() {
                setAndSortItemsChosen();
            }, true);

            function init() {
                scope.isComplexObject = checkIfComplexObject(scope.listItems);
                setAndSortAvailableItems();
                setAndSortItemsChosen();
            }

            function availableItemClick(item) {
                if(scope.isComplexObject) {
                    moveItemToSelectedAsObject(item);
                }
                else {
                    moveItemToSelected(item);
                }

                scope.selectedItems = angular.copy(scope.itemsChosen);

                if(scope.onChange) {
                    $timeout(function() {
                        scope.$apply();
                        scope.onChange();
                    });
                }
            }

            function selectedItemClick(item) {
                if(scope.isComplexObject) {
                    moveItemToAvailableAsObject(item);
                }
                else {
                    moveItemToAvailable(item);
                }

                scope.selectedItems = angular.copy(scope.itemsChosen);

                if(scope.onChange) {
                    $timeout(function() {
                        scope.$apply();
                        scope.onChange();
                    });
                }
            }

            function moveAllRightClick(event) {
                event.preventDefault();
                scope.itemsChosen = _.concat(scope.selectedItems, scope.availableItems);
                scope.availableItems = [];

                scope.selectedItems = angular.copy(scope.itemsChosen);

                if(scope.onChange) {
                    $timeout(function() {
                        scope.$apply();
                        scope.onChange();
                    });
                }
            }

            function moveAllLeftClick(event) {
                event.preventDefault();

                if(scope.isComplexObject) {
                    _.each(scope.itemsChosen, function(item) {
                        var found = _.find(scope.listItems, function(i) {
                            return i[scope.idField] === item[scope.idField];
                        });

                        if(found) {
                            scope.availableItems = insertSorted(scope.availableItems, item, scope.displayField);
                        }
                    });
                }
                else {
                    _.each(scope.itemsChosen, function(item) {
                        var index = _.indexOf(scope.listItems, item);

                        if(index >= 0) {
                            scope.availableItems = insertSorted(scope.availableItems, item);
                        }
                    });
                }

                scope.itemsChosen = [];
                scope.selectedItems = angular.copy(scope.itemsChosen);

                if(scope.onChange) {
                    $timeout(function() {
                        scope.$apply();
                        scope.onChange();
                    });
                }
            }

            function moveItemToSelectedAsObject(item) {
                scope.itemsChosen.push(item);
                scope.availableItems = _.filter(scope.availableItems, function(i) {
                    return i[scope.idField] !== item[scope.idField];
                });
            }

            function moveItemToAvailableAsObject(item) {
                scope.availableItems = insertSorted(scope.availableItems, item, scope.displayField);
                scope.itemsChosen = _.filter(scope.itemsChosen, function(i) {
                    return i[scope.idField] !== item[scope.idField];
                });
            }

            function moveItemToSelected(item) {
                scope.itemsChosen.push(item);
                _.pull(scope.availableItems, item);
            }

            function moveItemToAvailable(item) {
                scope.availableItems = insertSorted(scope.availableItems, item);
                _.pull(scope.selectedItems, item);
            }

            function checkIfComplexObject() {
                return !!(scope.displayField && scope.idField);
            }

            function insertSorted(arr, item, field) {
                var insertAt;

                if(field) {
                    insertAt = _.sortedIndexBy(arr, item, field);
                }
                else {
                    insertAt = _.sortedIndex(arr, item);
                }

                var front = _.slice(arr, 0, insertAt);
                var back = _.slice(arr, insertAt);

                return _.concat(front, item, back);
            }

            function setAndSortAvailableItems() {
                scope.availableItems = [];

                if(scope.isComplexObject) {
                    _.each(scope.listItems, function(item) {
                        var found = _.find(scope.itemsChosen, function(i) {
                            return i[scope.idField] === item[scope.idField];
                        });

                        if(!found) {
                            scope.availableItems = insertSorted(scope.availableItems, item, scope.displayField);
                        }
                    });
                }
                else {
                    _.each(scope.listItems, function(item) {
                        var index = _.indexOf(scope.selectedItems, item);

                        if(index < 0) {
                            scope.availableItems = insertSorted(scope.availableItems, item);
                        }
                    });
                }
            }

            function setAndSortItemsChosen() {
                if(scope.isComplexObject) {
                    scope.itemsChosen = _.sortBy(scope.selectedItems, [scope.displayField]);
                }
                else {
                    scope.itemsChosen = [];

                    _.each(scope.selectedItems, function(item) {
                        scope.itemsChosen = insertSorted(scope.selectedItems, item);
                    });
                }
            }
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('editOffersMultiLaunch.directive', [])
        .directive('editOffersMultiLaunch', editOffersMultiLaunch)
    ;

    editOffersMultiLaunch.$inject = ['$timeout', '$sce', 'multiLaunchService'];

    function editOffersMultiLaunch($timeout, $sce, multiLaunchService) {
        return {
            restrict: 'E',
            replace: 'true',
            scope: {
                isVisible: '=',
                froms: '=',
                subjects: '=',
                creatives: '=',
                offerId: '='
            },
            link: linkFn,
            templateUrl: '/templates/angular-templates/directive-templates/editOffersMultiLaunch.html'
        };

        function linkFn(scope, elem) {
            scope.preview = null;
            scope.errorMessage = null;

            scope.onCheckboxClick = onCheckboxClick;
            scope.onRadioClick = onRadioClick;
            scope.onPreviewClick = onPreviewClick;
            scope.onHidePreviewClick = onHidePreviewClick;
            scope.onSaveClick = onSaveClick;
            scope.onDismissErrorClick = onDismissErrorClick;

            init();

            function init() {
                scope.$watch('isVisible', showModal);

                elem.bind('hide.bs.modal', function() {
                    scope.isVisible = false;

                    $timeout(function() {
                        scope.$apply();
                    });
                });
            }

            function onCheckboxClick(item) {
                item.isSelected = !item.isSelected;
            }

            function onRadioClick(item) {
                var selectedItem = _.find(scope.creatives, {isSelected: true});

                if(selectedItem) {
                    selectedItem.isSelected = false;
                }

                item.isSelected = true;
            }

            function onPreviewClick(item) {
                scope.preview = $sce.trustAsHtml(item.email_content);// jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
            }

            function onHidePreviewClick() {
                scope.preview = null;
            }

            function showModal(isVisible) {
                if(isVisible) {
                    var offer = _.find(multiLaunchService.getOffers(), {id: scope.offerId});
                    var creative;

                    scope.preview = null;

                    if(!offer || !offer.froms || offer.length < 1) {
                        addIsSelected(scope.froms, true);
                    }
                    else {
                        addIsSelected(scope.froms, false);
                        setUpSelections(scope.froms, offer.froms);
                    }

                    if(!offer || !offer.subjects || offer.subjects < 1) {
                        addIsSelected(scope.subjects, true);
                    }
                    else {
                        addIsSelected(scope.subjects, false);
                        setUpSelections(scope.subjects, offer.subjects);
                    }

                    addIsSelected(scope.creatives, false);

                    if(offer && offer.creative) {
                        creative = _.find(scope.creatives, {id: offer.creative.id});

                        if(creative) {
                            creative.isSelected = true;
                        }
                    }

                    elem.modal('show');
                }
                else {
                    elem.modal('hide');
                }
            }

            function addIsSelected(list, selected) {
                _.each(list, function(l) {
                    l.isSelected = selected;
                });
            }

            function setUpSelections(view, stored) {
                _.each(view, function(v) {
                    _.each(stored, function(s) {
                        if(v.text === s) {
                            v.isSelected = true;
                        }
                    });
                });
            }

            function onSaveClick() {
                var froms = _.map(_.filter(scope.froms, {isSelected: true}), 'text');
                var subjects = _.map(_.filter(scope.subjects, {isSelected: true}), 'text');
                var creative = _.find(scope.creatives, {isSelected: true});

                if(froms && froms.length < 1) {
                    setErrorMessageWithDelayDismissal('You must select at least one From!');

                    return;
                }

                if(subjects && subjects.length < 1) {
                    setErrorMessageWithDelayDismissal('You must select at least one Subject!');

                    return;
                }

                if(!creative) {
                    setErrorMessageWithDelayDismissal('You must select a Creative!');

                    return;
                }

                var data = {
                    froms: froms,
                    subjects: subjects,
                    creative: creative
                };

                multiLaunchService.updateOffer(scope.offerId, data);

                scope.isVisible = false;
            }

            function onDismissErrorClick() {
                scope.errorMessage = null;
            }

            function setErrorMessageWithDelayDismissal(message) {
                scope.errorMessage = message;

                $timeout(function() {
                    scope.errorMessage = null;
                }, 5000);
            }
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('offerMultiLaunch.directive', ['ui.bootstrap'])
        .directive('offerMultiLaunch', selectOfferMultiLaunch)
    ;

    function selectOfferMultiLaunch() {
        selectOfferMultiLaunchController.$inject = ['$http', '$q', '$scope', 'multiLaunchService', 'EVENTS'];

        return {
            restrict: 'E',
            transclude: true,
            controller: selectOfferMultiLaunchController,
            controllerAs: 'omlc',
            templateUrl: '/templates/angular-templates/directive-templates/offerMultiLaunch.html'
        };

        function selectOfferMultiLaunchController($http, $q, $scope, multiLaunchService, EVENTS) {
            var vm = this; // jshint ignore:line
            var offerDataCache = {};

            vm.selectedOffer = null;
            vm.selectedOfferId = 0;
            vm.loadingOffers = false;
            vm.noResults = false;
            vm.responseOffers = [];
            vm.offers = [];
            vm.showEditOffers = false;
            vm.froms = null;
            vm.subjects = null;
            vm.creatives = null;

            vm.onOfferSelected = onOfferSelected;
            vm.onRemoveClick = onRemoveClick;
            vm.onEditClick = onEditClick;

            init();

            function init() {
                getOffers();

                $scope.$on(EVENTS.offersEmptied, onOffersEmptied);
            }

            function onOfferSelected(item) {
                multiLaunchService.addOffer(item);
                vm.offers = multiLaunchService.getOffers();
                getModalData(item);
                vm.selectedOffer = null;
                item.editLoading = false;
            }

            function onRemoveClick(id) {
                multiLaunchService.removeOffer(id);
            }

            function getModalData(offer) {
                var deferred = $q.defer();

                if(offerDataCache[offer.id]) {
                    var clonedOffer = JSON.parse(JSON.stringify(offerDataCache[offer.id]));
                    deferred.resolve(clonedOffer);

                    return deferred.promise;
                }

                $http({
                    method: 'GET',
                    url: '/api/multilaunch/offerModal',
                    params: {campaignId: offer.id}
                })
                .then(function successCallback(resp) {
                    var rawSubjects = resp.data.marketSubjects.text.split('\n');
                    var rawFroms = resp.data.froms[0].text.split('\n');
                    var creatives = JSON.parse(resp.data.creatives).reply[0].creatives[0].creative;
                    var subjects = [];
                    var froms = [];

                    _.each(rawSubjects, function(s) {
                        subjects.push({text: s});
                    });

                    _.each(rawFroms, function(f) {
                        froms.push({text: f});
                    });

                    offerDataCache[offer.id] = {
                        subjects: subjects,
                        froms: froms,
                        creatives: creatives
                    };

                    deferred.resolve(offerDataCache[offer.id]);
                }, function error() {
                    deferred.reject(null);
                });

                return deferred.promise;
            }

            function getOffers() {
                var responseOffers = [];

                vm.loadingOffers = true;

                $http({
                    method: 'GET',
                    url: '/api/multilaunch/offer',
                    params: {}
                })
                .then(function(resp) {
                    var response = resp.data.reply[0].campaigns[0].campaign;

                    if(!response) {
                        return null;
                    }

                    responseOffers = response.map(function(c) {
                        return c;
                    });

                    vm.responseOffers = _.sortBy(responseOffers, ['name']);
                    vm.loadingOffers = false;

                    return vm.responseOffers;
                });
            }

            function onEditClick(offer) {
                offer.editLoading = true;
                getModalData(offer).then(function(data) {
                    vm.froms = data.froms;
                    vm.subjects = data.subjects;
                    vm.creatives = data.creatives;
                    vm.selectedOfferId =  offer.id;
                    vm.showEditOffers = true;
                    offer.editLoading = false;
                }, function() {
                    offer.editLoading = false;
                });
            }

            function onOffersEmptied() {
                vm.offers = multiLaunchService.getOffers();
            }
        }
    }
})();

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
                templateUrl: '/views/index.jade',
                controller: 'indexController',
                controllerAs: 'ic'
            })
        ;
    }

    routes.$inject = ['$stateProvider', '$urlRouterProvider'];
})();

(function() {
    'use strict';

    angular.module('app', [
         'app.indexController',
         'ui.router',
         'app.routing',
         'app.constants.events',
          //'ui.bootstrap',
         'app.common.directives',
         //'ngMessages',
         //'time.service',
    ]);
})();

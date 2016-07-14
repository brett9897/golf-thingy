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

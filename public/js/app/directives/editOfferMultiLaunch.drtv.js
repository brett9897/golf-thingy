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

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

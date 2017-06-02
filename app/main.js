(function () {
    'use strict';

    angular.module('naturalForce', ['ui.router']).config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function ($stateProvider, $locationProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/artworkList');
        $stateProvider
            .state('artworkList', {
                url: '/artworkList',
                templateUrl: 'views/artworkList.html',
                controller: "artworkListController"
            })
            .state('artworkDesc', {
                url: '/artworkDesc',
                templateUrl: 'views/artworkDesc.html'
            })
        ;
    }]);
})();

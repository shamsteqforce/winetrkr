'use strict';

// Setting up route
angular.module('wines').config(['$stateProvider',
  function ($stateProvider) {
    // wines state routing
    $stateProvider
      .state('wines', {
        abstract: true,
        url: '/wines',
        template: '<ui-view/>'
      })
      .state('wines.list', {
        url: '',
        templateUrl: 'modules/wine/client/views/list-wines.client.view.html'
      })
      .state('wines.create', {
        url: '/create',
        templateUrl: 'modules/wine/client/views/create-wine.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('wines.view', {
        url: '/:wineId',
        templateUrl: 'modules/wine/client/views/view-wine.client.view.html'
      })
      .state('wines.edit', {
        url: '/:wineId/edit',
        templateUrl: 'modules/wine/client/views/edit-wine.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

'use strict';

// Setting up route
angular.module('cellars').config(['$stateProvider',
  function ($stateProvider) {
    // cellers state routing
    $stateProvider
      .state('cellers', {
        abstract: true,
        url: '/cellers',
        template: '<ui-view/>'
      })
      .state('cellers.list', {
        url: '',
        templateUrl: 'modules/cellers/client/views/list-cellers.client.view.html'
      })
      .state('cellers.create', {
        url: '/create',
        templateUrl: 'modules/cellers/client/views/create-celler.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      })
      .state('cellers.view', {
        url: '/:cellerId',
        templateUrl: 'modules/cellers/client/views/view-celler.client.view.html'
      })
      .state('cellers.edit', {
        url: '/:cellerId/edit',
        templateUrl: 'modules/cellers/client/views/edit-celler.client.view.html',
        data: {
          roles: ['user', 'admin']
        }
      });
  }
]);

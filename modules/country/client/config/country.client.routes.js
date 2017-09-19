'use strict';

// Setting up route
angular.module('country').config(['$stateProvider',
  function ($stateProvider) {
    // country state routing
    $stateProvider
    .state('country', {
      abstract: true,
      url: '/country',
      template: '<ui-view/>'
    })
    .state('country.list', {
      url: '',
      templateUrl: 'modules/country/client/views/list-country.client.view.html',
      data: {
        roles: ['user', 'admin']
      }
    })
    .state('country.create', {
      url: '/create',
      templateUrl: 'modules/country/client/views/create-country.client.view.html',
      data: {
        roles: ['user', 'admin']
      }
    })
    .state('country.view', {
      url: '/:countryId',
      templateUrl: 'modules/country/client/views/view-country.client.view.html',
      data: {
        roles: ['user', 'admin']
      }
    })
    .state('country.edit', {
      url: '/:countryId/edit',
      templateUrl: 'modules/country/client/views/edit-country.client.view.html',
      data: {
        roles: ['user', 'admin']
      }
    })
    .state('country.state', {
      url: '/:countryId/state',
      templateUrl: 'modules/country/client/views/list-state.client.view.html',
      data: {
        roles: ['user', 'admin']
      }
    })
    .state('country.state-create', {
      url: '/:countryId/state/create',
      templateUrl: 'modules/country/client/views/create-state.client.view.html',
      data: {
        roles: ['user', 'admin']
      }
    })
    .state('country.state-edit', {
      url: '/:countryId/state/:stateId/edit',
      templateUrl: 'modules/country/client/views/edit-state.client.view.html',
      data: {
        roles: ['user', 'admin']
      }
    });
  }
  ]);

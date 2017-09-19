'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {

    // Redirect to 404 when route not found
    $urlRouterProvider.otherwise(function ($injector, $location) {
      $injector.get('$state').transitionTo('not-found', null, {
        location: false
      });
    });

    // Home state routing
    $stateProvider
    .state('inventory', {
      url: '/inventory',
      templateUrl: 'modules/core/client/views/inventory.client.view.html',
      data: {
        roles: ['user', 'admin']
      }
    })
    .state('cellar', {
      url: '/cellar',
      templateUrl: 'modules/core/client/views/cellar.client.view.html',
      data: {
        roles: ['user', 'admin']
      }
    })
    .state('receipt', {
      url: '/receipt',
      templateUrl: 'modules/core/client/views/receipt.client.view.html',
      data: {
        roles: ['user', 'admin']
      }
    })
    .state('receipt-list', {
      url: '/receipt/list',
      templateUrl: 'modules/core/client/views/receipt_list.client.view.html',
      data: {
        roles: ['user', 'admin']
      }
    })
    .state('home', {
      url: '/',
      templateUrl: 'modules/core/client/views/home.client.view.html'
    })
    .state('graphs', {
      url: '/allStats',
      templateUrl: 'modules/core/client/views/graph.client.view.html'
    })
    .state('not-found', {
      url: '/not-found',
      templateUrl: 'modules/core/client/views/404.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('bad-request', {
      url: '/bad-request',
      templateUrl: 'modules/core/client/views/400.client.view.html',
      data: {
        ignoreState: true
      }
    })
    .state('forbidden', {
      url: '/forbidden',
      templateUrl: 'modules/core/client/views/403.client.view.html',
      data: {
        ignoreState: true
      }
    });
  }
  ]);

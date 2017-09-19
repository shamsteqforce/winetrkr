'use strict';

//cellers service used for communicating with the cellers REST endpoints
angular.module('cellars').factory('Cellars', ['$resource',
  function ($resource) {
    return $resource('api/cellers/:cellerId', {
      cellerId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

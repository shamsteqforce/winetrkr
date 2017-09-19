'use strict';

//wines service used for communicating with the wines REST endpoints
angular.module('wines').factory('Wine', ['$resource',
  function ($resource) {
    return $resource('api/wine/:wineId', {
      wineId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

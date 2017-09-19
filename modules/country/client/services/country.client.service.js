'use strict';

//country service used for communicating with the country REST endpoints
angular.module('country').factory('Country', ['$resource',
  function ($resource) {
    return $resource('api/country/:countryId', {
      countryId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
]);

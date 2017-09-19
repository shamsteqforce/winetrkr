'use strict';
angular.module('country').factory('CustomCountry', function($http, $log){
  return {
    findOneCountryState: function(countryId, stateId){
      var promise = $http({
        method: 'GET',
        url: '/api/country/'+countryId+'/'+stateId,
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },
    updateCountryState: function(data, countryId, stateId){
      var promise = $http({
        method: 'put',
        data: data,
        url: '/api/country/'+countryId+'/'+stateId,
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },
  };
});
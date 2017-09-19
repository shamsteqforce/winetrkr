'use strict';
angular.module('cellars').factory('CustomCellars', function($http, $log){
  return {
    
    getCellarNames: function(){
      var promise = $http({
        method: 'get',
        url: '/api/cellers/find/cellar-names',
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },
     getCellarDetails: function(data){
      var promise = $http({
        method: 'POST',
        data: data,
        url: '/api/cellers/find/cellar-details',        
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },

      getMyCellars: function(data){
      var promise = $http({
        method: 'POST',
        data: data,
        url: '/api/cellers/find/my-cellars',        
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },
  };
});
'use strict';

// Authentication service for user variables
angular.module('core').factory('SetMarketValues', [,
  function () {
    var data = {};
    var MV;
    data.setMarketValue=function(dataToSet){
    	MV=dataToSet;
    }

    data.getMarketValue=function(){
    	return MV;
    }     

    return data;
  }
]);

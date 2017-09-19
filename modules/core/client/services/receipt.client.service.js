'use strict';

angular.module('core').service('ReceiptService', function() {
  var receipt = {};

  var addReceipt = function(newObj) {
      receipt=newObj;
  };

  var getReceipt = function(){
      return receipt;
  };

  return {
    addReceipt: addReceipt,
    getReceipt: getReceipt
  };

});
'use strict';

angular.module('wines').factory('CustomWine', function($http, $log){
  return {
    searchWine: function(q){
      var promise = $http({
        method: 'GET',
        url: '/api/wine/search/'+q,
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },
    getExpenditure: function(){
      var promise = $http({
        method: 'GET',
        url: '/api/get/expenditure',
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    }, 
    getTransactionList: function(){
      var promise = $http({
        method: 'GET',
        url: '/api/get/transaction',
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },
    getPositionbyId: function(wineId){
      var promise = $http({
        method: 'GET',
        url: '/api/position/getPositionbyId/'+wineId,
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },
    postExpenditure: function(data){
      var promise = $http({
        method: 'POST',
        data: data,
        url: '/api/get/fxrate-update',
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },
    getOpenexchangerates: function(){
      var promise = $http({
        method: 'GET',
        url: 'https://openexchangerates.org/api/latest.json?app_id=e1e249e653e648e49dfa903665de755e',
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },
    getFxRates: function(){
      var promise = $http({
        method: 'GET',
        url: '/api/get/fxrate',
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },
    getInventoryQty: function(){
      var promise = $http({
        method: 'GET',
        url: '/api/get/inventoryQty',
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },

    getGrapeVariety: function(q){
      var promise = $http({
        method: 'GET',
        url: '/api/wine/find/grape-variety',
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },
    getSourceSupplier: function(q){
      var promise = $http({
        method: 'GET',
        url: '/api/wine/find/source-supplier',
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },
    getProducerlist: function(q){
      var promise = $http({
        method: 'GET',
        url: '/api/wine/find/unique-producer',
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },

 

    getProducerLocation: function(data){
      var promise = $http({
        method: 'POST',
        data: data,
        url: '/api/wine/find/producer-location',        
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },


    getAverageWinePrice: function(data){
      var promise = $http({
        method: 'POST',
        data:data,
        url: '/api/wine/find/winesAveragePrice',        
      }).then(function successCallback(result) {
        console.log("return avg"+result.data.price);
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },

    getAverageWinePriceMonthWise: function(data){
      var promise = $http({
        method: 'POST',
        data:data,
        url: '/api/wine/get/winesAveragePriceMonthWise',        
      }).then(function successCallback(result) {
         return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },

    getAverageWineBottleMonthWise: function(data){
      var promise = $http({
        method: 'POST',
        data:data,
        url: '/api/wine/get/winesAverageBottlesMonthWise',        
      }).then(function successCallback(result) {
         return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },

    getCountryGraphData: function(data){
      var promise = $http({
        method: 'POST',
        data:data,
        url: '/api/wine/get/countryGraph',        
      }).then(function successCallback(result) {
         return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },

      getVarietalGraphData: function(data){
      var promise = $http({
        method: 'POST',
        data:data,
        url: '/api/wine/get/varietalGraph',        
      }).then(function successCallback(result) {
         return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },
  
   getVerticalGraphData: function(data){
      var promise = $http({
        method: 'POST',
        data:data,
        url: '/api/wine/get/verticalGraph',        
      }).then(function successCallback(result) {
         return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },
    getProducerGraphData: function(data){
      var promise = $http({
        method: 'POST',
        data:data,
        url: '/api/wine/get/producerGraph',        
      }).then(function successCallback(result) {
         return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },
     getLastTransactionData: function(data){
      var promise = $http({
        method: 'POST',
        data:data,
        url: '/api/wine/get/lastTransaction',        
      }).then(function successCallback(result) {
         return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },
     getRegionGraphData: function(data){
      var promise = $http({
        method: 'POST',
        data:data,
        url: '/api/wine/get/regionGraph',        
      }).then(function successCallback(result) {
         return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },

     getVintagesGraphData: function(data){
      var promise = $http({
        method: 'POST',
        data:data,
        url: '/api/wine/get/vintageGraph',        
      }).then(function successCallback(result) {
         return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },

    getWinesByUser: function(data){
      var promise = $http({
        method: 'POST',
        data:data,
        url: '/api/wine/get/wineByUser',        
      }).then(function successCallback(result) {
         return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },


getTopDistributorsData: function(data){
      var promise = $http({
        method: 'POST',
        data:data,
        url: '/api/wine/get/topDistributors',        
      }).then(function successCallback(result) {
         return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },

    getTotalDistributionPrice: function(data){
      var promise = $http({
        method: 'POST',
        data:data,
        url: '/api/wine/get/totalDistributionPrice',        
      }).then(function successCallback(result) {
         return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },

    

  


    getWinelist: function(q){
      var promise = $http({
        method: 'GET',
        url: '/api/wine/find/unique-wine',
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },
    postTransaction: function(data){
      var promise = $http({
        method: 'POST',
        data: data,
        url: '/api/transaction/new',
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },
    postDrTransaction: function(data){
      var promise = $http({
        method: 'POST',
        data: data,
        url: '/api/transaction/remove',
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },
    deleteWineTransaction: function(data){
      var promise = $http({
        method: 'POST',
        data: data,
        url: '/api/transaction/delete',
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },
    postWineUpdate: function(data){
      var promise = $http({
        method: 'put',
        data: data,
        url: '/api/wine',
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    }, postWineScoreUpdate: function(data){
      var promise = $http({
        method: 'put',
        data: data,
        url: '/api/position/score',
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    }, 
    postWineRatingUpdate: function(data){
      var promise = $http({
        method: 'put',
        data: data,
        url: '/api/wine/rating',
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    }
    ,
     getPositionScorebyId: function(data){
     
      var promise = $http({
        method: 'PUT',
        data:data,
        url: '/api/position/getPositionScorebyId/',
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },
     getAvgCommunity: function(data){
     
      var promise = $http({
        method: 'PUT',
        data:data,
        url: '/api/position/getAvgCommunity/',
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    }, 
    postReceipt: function(data){
      var promise = $http({
        method: 'POST',
        data: data,
        url: '/api/receipt/new',
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    }, 
    deleteReceipt: function(data){
      var promise = $http({
        method: 'POST',
        data: data,
        url: '/api/receipt/delete',
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },
     getReceipt: function(q){
      var promise = $http({
        method: 'GET',       
        url: '/api/get/receipt',
      }).then(function successCallback(result) {
        return result.data;
      }, function errorCallback(result) {
        return result;
      });
      return promise;
    },
  }
});

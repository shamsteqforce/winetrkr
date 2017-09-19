'use strict';

angular.module('core').controller('InventoryController', ['$scope', 'Authentication', '$uibModal', 'Wine', '$stateParams', 'Cellars', '$timeout', 'Country', 'CustomWine',
  function ($scope, Authentication, $uibModal, Wine, $stateParams, Cellars, $timeout, Country, CustomWine) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
   
    


  $scope.predicate = 'wine_id.wine_name';
  $scope.reverse = true;
  $scope.order = function(predicate) {
    $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
    $scope.predicate = predicate;
  };





    $scope.addWine = function(countries){
      var dialog = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'addWine.html',
        controller: 'WineAddController',
        resolve: {
         countries: function(){
          return countries;
        }
      }
    });

      dialog.result.then(function () {
        $scope.findWines();
      }, function () {
        $scope.findWines();
      });
    };

    $scope.myFilter = function (item) {
      // console.log(item.quantity);
    return item.quantity > 0; 
};

    $scope.getInventoryQty = function () {
      CustomWine.getInventoryQty().then(function(result){
        $scope.stockQty = result[0];
        // console.log(result[0]);
      })
    };
    $scope.getInventoryQty();



    $scope.getOpenexchangerates = function () {
      CustomWine.getOpenexchangerates().then(function(exchangerates){
        var rates = [];

        for (var key in exchangerates.rates) {
          if (exchangerates.rates.hasOwnProperty(key)) {
            rates.push({currency_code: key, conversion_rate: exchangerates.rates[key]});
          }
        }

        var doc = {
          base: exchangerates.base,
          rates: rates
        }

        CustomWine.postExpenditure(doc).then(function(result){
          // console.log(result);
        });
      })
    };

    // $scope.getOpenexchangerates();





    // $scope.getExpenditure = function () {
    //   CustomWine.getExpenditure().then(function(result){
    //     $scope.expenditure = result[0];
    //     // console.log(result[0])
    //   })
    // };
    // $scope.getExpenditure();

    // Find a list of Country
    $scope.findCountry = function () {
      $scope.countries = Country.query();
    };


    $timeout(function() {
      $scope.findCountry();
    }, 1000);
    

    $scope.showDetails = function(wine){
     var dialog = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'wideDetails.html',
      controller: 'WineTableDetailsController',
      windowClass: 'row-win-details',
      resolve: {
       wine: function(){
        return wine;
      }
    }
  });

     dialog.result.then(function () {
     
      $scope.findWines();
    }, function () {
     
      $scope.findWines();
    });
   };

   // Find a list of Cellers
   $scope.findCellars = function () {
    $scope.cellars = Cellars.query();
  };

  $scope.findCellars();



  $scope.findWines = function () {

    $scope.wines = Wine.query();
   
  };



  $scope.findWine = function () {
    $scope.wine = Wine.get({wineId: $stateParams.wineId});
  };

  // $scope.findWine();

  

}
])
.filter('setDecimal', function ($filter) {
  return function (input, places) {
    if (isNaN(input)) return input;
        // If we want 1 decimal place, we want to mult/div by 10
        // If we want 2 decimal places, we want to mult/div by 100, etc
        // So use the following to create that factor
        var factor = "1" + Array(+(places > 0 && places + 1)).join("0");
        return Math.round(input * factor) / factor;
      };
    });

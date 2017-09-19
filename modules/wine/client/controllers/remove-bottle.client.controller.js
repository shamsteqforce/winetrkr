'use strict';

angular.module('wines').controller('RemoveBottleController', ['$scope', 'Authentication','$uibModal', '$timeout', '$uibModalInstance', 'wine', 'CustomWine', 'toaster','Country',
  function ($scope, Authentication, $uibModal, $timeout, $uibModalInstance, wine, CustomWine, toaster, Country) {
    // Expose view variables
    $scope.authentication = Authentication;
    $scope.user = $scope.authentication.user;
    $scope.wine = wine;

    $scope.close = function(){
      $uibModalInstance.close();
    };



    $scope.wineRemove = {
      currency_code : $scope.user.currency_code
    };
    $scope.countries = Country.query();
  $scope.postDrTransaction = function (isValid) {
    $scope.error = null;

    if (!isValid) {
      $scope.$broadcast('show-errors-check-validity', 'wineBottleForm');
      return false;
    }



    var delivery_status = [];
    var cost_per_bottle = parseFloat(this.cost_per_bottle);
      // var currencyExchange = parseFloat($scope.currencyExchange(countries, this.currency_code));

      delivery_status.push({date: new Date() , status: this.delivery_status});
      console.log($scope.wine, $scope.wineRemove);
        var cellarId=$scope.wine.cellar_id;
        console.log("cellarid "+cellarId);

      var data = {
        wine_id: $scope.wine.wine_id._id,
        fill_level : $scope.wine.bottle_properties.fill_level,
        level_condition : $scope.wine.bottle_properties.level_condition,
        cork_condition : $scope.wine.bottle_properties.cork_condition,
       
       
        // purchase_date : wine.purchase_date,
        // source_supplier:  wine.source_supplier,
        quantity: $scope.wineRemove.quantity,
        details: [{currency:$scope.wineRemove.currency_code, price_usd: 0, price:$scope.wineRemove.price}],
        book_value_usd: 0
        // delivery_status: delivery_status
      }
      if(typeof cellarId != 'undefined')
         data.cellar_id = $scope.wine.cellar_id._id;

      console.log(data);
      CustomWine.postDrTransaction(data).then(function(result) {
        console.log(result);
        toaster.pop('success', 'Remove', result);
        $uibModalInstance.close();
      });
    };

    $scope.setPriceToRemove = function(rType) {
      $scope.wineRemove.price = rType != 'sold' ? $scope.wine.avg_cost_price : 0;
      $scope.wineRemove.currency_code = rType != 'sold' ? "USD" : $scope.user.currency_code;
    }

}
]);




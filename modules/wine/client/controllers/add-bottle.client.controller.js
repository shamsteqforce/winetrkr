'use strict';

angular.module('wines').controller('AddBottleController', ['$scope', 'Authentication','$uibModal', '$timeout', '$uibModalInstance', 'CustomWine', 'Country', 'wineId','toaster',
  function ($scope, Authentication, $uibModal, $timeout, $uibModalInstance, CustomWine, Country, wineId, toaster) {
    // Expose view variables
    $scope.authentication = Authentication;
    $scope.user = Authentication.user;
    $scope.wineId = wineId;
    

    $scope.sourceSupplier=[];
    
    $scope.close = function(){
      $uibModalInstance.close();
    };

    $scope.findCountry = function () {
      //$scope.countries = Country.query();
      $scope.countries= ["AUD","BRL","CAD","CHF","CNY","DKK","EUR","GBP","HKD","HUF","IDR","ILS","INR","ISK","JPY","MXN","MYR","NOK","NZD","PLN","RUB","SEK","SGD","TWD","USD","ZAR"];
    };


    /*
    * date related functions
    */
   
    $scope.purchase_date = new Date();

    $scope.dateOptions = {
      //dateDisabled: disabled,
      formatYear: 'yy',
      maxDate: new Date(),
      minDate: new Date(1800, 1, 1),
      startingDay: 1
    };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
    mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }



  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  $scope.popup2 = {
    opened: false
  };

  /*------------end date function*/


    $scope.sourceSupplierChanged = function(str) {
      // console.log(str);
      $scope.source_supplier = str;
      //alert($scope.source_supplier);
    }



  $scope.getSourceSupplier = function(){
    CustomWine.getSourceSupplier().then(function(result) {

        console.log("suppliers "+result);
      for(var i = 0; i < result.length; i++){
        $scope.sourceSupplier.push({title: result[i]})
      }
      $scope.sourceSupplierSelected = {title:result[0]};
    });

  }
  $scope.getSourceSupplier();


  $scope.postTransaction = function (isValid) {

     //alert($scope.source_supplier);

   // alert("save "+this.quantity+"  cost "+this.cost_per_bottle);
    $scope.error = null;

    if (!isValid) {
      $scope.$broadcast('show-errors-check-validity', 'wineBottleForm');
      return false;
    }

    var delivery_status = [];
    var cost_per_bottle = parseFloat(this.cost_per_bottle);
      // var currencyExchange = parseFloat($scope.currencyExchange(countries, this.currency_code));

      delivery_status.push({date: new Date() , status: this.delivery_status});

      var data = {
        wine_id: $scope.wineId,
        fill_level : this.fill_level,
        level_condition : this.level_condition,
        cork_condition : this.cork_condition,
        cellar_id : this.cellar_id,
        purchase_date : this.purchase_date,
        //source_supplier:  (this.sourceSupplierSelected) ? this.sourceSupplierSelected.title : $scope.source_supplier,
        source_supplier:$scope.source_supplier,
        quantity: this.quantity,
        details: [{qty: this.quantity, price: this.cost_per_bottle, currency:this.currency_code, price_usd: 0}],
        book_value_usd: 0,
        user_currency_code:$scope.user.currency_code,
        delivery_status: delivery_status
      }
      console.log("value updates "+data.quantity+"value "+data.details.qty+" data values"+JSON.stringify(data))

      CustomWine.postTransaction(data).then(function(result) {
        console.log(result);
        toaster.pop('success', 'Update', result);
        $uibModalInstance.close();
      });
 

    };

  }
  ]).directive('decimalPlaces',function(){
    return {
        link:function(scope,ele,attrs){
            ele.bind('keypress',function(e){
                var newVal=$(this).val()+(e.charCode!==0?String.fromCharCode(e.charCode):'');
                if($(this).val().search(/(.*)\.[0-9][0-9]/)===0 && newVal.length>$(this).val().length){
                    e.preventDefault();
                }
            });
        }
    };
});




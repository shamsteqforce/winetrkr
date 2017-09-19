'use strict';

// Wines controller
angular.module('cellars').controller('AddCellarController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Cellars', '$timeout', 'Country', '$uibModalInstance', 'toaster','Wine', 'CustomCellars',
  function ($scope, $state, $stateParams, $location, Authentication, Cellars, $timeout, Country, $uibModalInstance, toaster,Wine, CustomCellars) {
    $scope.authentication = Authentication;

    // Expose view variables
    $scope.cellerData;
    $scope.$state = $state;
    $scope.authentication = Authentication;
    $scope.isDisabled = false;
    $scope.states=[];

    


    $scope.close = function(){
      $uibModalInstance.close();
    };

    $scope.newObject = [{name:'', value: ''}];
    $scope.addNewRow = function(){
      $scope.newObject.push({name:'', value: ''});
    }


    // Find a list of Country
    $scope.findCountry = function () {
      $scope.countries = Country.query();
    };
    
    $scope.findWines = function () {
      $scope.wines = Wine.query();
    };



    $scope.changeCountry = function(countries){
      // console.log(1);
      var countryIndex='';

      // $('#country').on('change', function(){
        console.log(this.country);
        for(var i = 0; i < countries.length; i++){
          if(countries[i].title == this.country){
            $scope.states=[];
            countryIndex = i;
            $.each(countries[i].state, function (index, value) {
              $scope.states.push(value.title);
            });
          }
        }
      // });

    } ;



    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'cellarForm');
        return false;
      }


      var celler = new Cellars({
        cellar_name: this.cellar_name,
        address_line1: this.address_line1,
        address_line2: this.address_line2,
        country: this.country,
        state: this.state,
        city: this.city,
        postcode: this.postcode
      });
      console.log(celler);

      celler.$save(function (response) {
        $scope.cellarData = response;
        $uibModalInstance.close(response);
        toaster.pop('success', 'Add Celler', 'Celler Add successful');
        $scope.isDisabled = true;
      }, function (errorResponse) {
        toaster.pop('warning', 'Error', errorResponse.data.message);
      });
    };


    // Update existing category
    $scope.update = function (isValid, countries) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'cellarForm');
        return false;
      }

      var celler = $scope.cellarData;


      celler.$update(function () {
        toaster.pop('success', 'Update', 'Cellar update successful');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    
    $scope.getCellarsName = function(){
      $scope.callersList = Cellars.query();
      console.log($scope.callersList);
      
    }
    
    $scope.cellarChanged = function(str) {
      console.log(str);
      $scope.cellar_name = str;
    }
    $scope.selectedCellar = function (obj) {
       console.log("cellar selected"+obj.title);
   
      $scope.getCellarDetails(obj.title);

      if(obj && typeof obj != undefined)
        $scope.cellar_name = obj.originalObject.cellar_name;
    }

//find cellar details by cellarname
 $scope.getCellarDetails = function(data){
       
      var data={"cellar_name":data};
      console.log("cellar name "+data.cellar_name);
      CustomCellars.getCellarDetails(data).then(function(result) {
        $scope.uniqueCellarData = result;           

         if($scope.uniqueCellarData){        
         $scope.address_line1=result[0].address_line1;         
         $scope.address_line2=result[0].address_line2;         
         $scope.city=result[0].city;
         $scope.postcode=result[0].postcode;
         $scope.country=result[0].country;
         $scope.state=result[0].state;
         
         }
        
      });
    }



  }
  ]);

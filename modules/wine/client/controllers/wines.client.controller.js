create'use strict';

// Wines controller
angular.module('wines').controller('WineController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', 'Wine', '$timeout', 'Country', '$modalInstance',
  function ($scope, $state, $stateParams, $location, Authentication, Wine, $timeout, Country, $modalInstance) {
    $scope.authentication = Authentication;

    // Expose view variables
    $scope.$state = $state;
    $scope.authentication = Authentication;

    $scope.close = function(){
      $modalInstance.close();
    };

    $scope.userSetting = function(){
      $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'userSetting.html',
        controller: 'userSettingCtrl'
      });
    };

    $scope.userSubscription = function(){
     $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'userSubscription.html',
      controller: 'userSubscriptionCtrl'
    });
   };

  // Find a list of Country
  $scope.findCountry = function () {
    $scope.countries = Country.query();
  };

 



  $scope.dropDown = function(){

    var countryIndex='';

    $('#country').on('change', function(){
      for(var i = 0; i < $scope.countries.length; i++){
        if($scope.countries[i].title == $(this).val()){
          countryIndex = i;
          $('#state').html('<option value="">Select state</option>');
          $.each($scope.countries[i].state, function (index, value) {
            $("#state").append('<option value="'+value.title+'">'+value.title+'</option>');
          });
        }
      }
    });

  } ;



  $timeout(function() {
    $scope.dropDown();
  }, 1000);







  }
  ]);

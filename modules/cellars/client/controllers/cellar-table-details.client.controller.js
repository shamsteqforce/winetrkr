'use strict';

// Wines controller
angular.module('cellars').controller('CellarTableDetailsController', ['$scope', '$state', '$stateParams', '$location', 'Authentication', '$timeout', '$uibModalInstance', '$modal','Cellars',
  function ($scope, $state, $stateParams, $location, Authentication, $timeout, $uibModalInstance, $modal,Cellars) {


    // Expose view variables
    $scope.authentication = Authentication;
    // $scope.cellar = cellar;
    $scope.editTesting = false;

    $scope.close = function(){
      $uibModalInstance.close();
    };

    $scope.invitedUsers = [{"lastName": 'Rajib',email: 'hope.eaktadiur@gmail.com',
"profileImageURL":"modules/users/client/img/profile/default.png"}];
    
 }
 ]);

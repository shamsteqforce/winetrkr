'use strict';

angular.module('wines').controller('MapController', ['$scope', '$state', 'Authentication','$uibModal', '$timeout', '$uibModalInstance', 'wineDetails',
  function ($scope, $state, Authentication, $uibModal, $timeout, $uibModalInstance, wineDetails) {
    // Expose view variables
    $scope.authentication = Authentication;
    $scope.$state = $state;
    $scope.wine = wineDetails;


    $scope.close = function(){
      $uibModalInstance.close();
    };


}
]);




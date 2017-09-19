'use strict';

angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$uibModal',
  function ($scope, Authentication, $uibModal) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

    $scope.showLogin = function(){
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'userSignIn.html',
        controller: 'AuthenticationController',
        windowClass: 'app-modal-window',
        scope: $scope
      });
    };

    $scope.showInvite = function(){
      var modalInstance = $uibModal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'userInvite.html',
        controller: 'UserInviteController',
        windowClass: 'app-modal-window',
        scope: $scope
      });
    };

  }
  ]);

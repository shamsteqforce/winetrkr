'use strict';

// Cellers controller
angular.module('cellars').controller('CellarsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Cellers', 'CustomCellars',
  function ($scope, $stateParams, $location, Authentication, Cellers, CustomCellars) {
    $scope.authentication = Authentication;
    
    // Create new Article
    $scope.create = function (isValid) {
      $scope.error = null;

      console.log(11111);

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      // Create new Article object
      var article = new Cellers({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      article.$save(function (response) {
        $location.path('cellers/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing Article
    $scope.remove = function (article) {
      if (article) {
        article.$remove();

        for (var i in $scope.cellers) {
          if ($scope.cellers[i] === article) {
            $scope.cellers.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function () {
          $location.path('cellers');
        });
      }
    };

    // Update existing Article
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      var article = $scope.article;

      article.$update(function () {
        $location.path('cellers/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Cellers
    $scope.find = function () {
      $scope.cellers = Cellers.query();
    };

    // Find existing Article
    $scope.findOne = function () {
      $scope.article = Cellers.get({
        articleId: $stateParams.articleId
      });
    };

    
  }
]);

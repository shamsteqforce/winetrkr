'use strict';

// Country controller
angular.module('country').controller('CountryController', ['$scope', '$stateParams', '$location', 'Authentication', 'Country', 'CustomCountry',
  function ($scope, $stateParams, $location, Authentication, Country, CustomCountry) {
    $scope.authentication = Authentication;

    $scope.countryId = $stateParams.countryId;
    $scope.stateId = $stateParams.stateId;

    // Create new country
    $scope.create = function (isValid) {
      $scope.error = null;

      console.log(11111);

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'countryForm');

        return false;
      }

      // Create new country object
      var country = new Country({
        title: this.title,
        country_code: this.country_code,
        currency: this.currency,
        currency_code: this.currency_code,
        euro_conv_rate: this.euro_conv_rate,
        _sort: this._sort,
        row_insert_date: new Date()
      });

      // Redirect after save
      country.$save(function (response) {
        $location.path('country/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Remove existing country
    $scope.remove = function (country) {
      console.log(11111);

      if (country) {
        country.$remove();

        for (var i in $scope.country) {
          if ($scope.country[i] === country) {
            $scope.country.splice(i, 1);
          }
        }
        $location.path('country');
      } else {
        $scope.country.$remove(function () {
          $location.path('country');
        });
      }
    };

    // Update existing country
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'countryForm');

        return false;
      }

      var country = $scope.country;

      country.$update(function () {
        $location.path('country/' + country._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Update existing Country
    $scope.createState = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'countryForm');

        return false;
      }

      var country = $scope.country;

      country.state.push({"title":this.title});
      console.log(country);
      console.log($scope.title);

      country.$update(function () {
        $location.path('country/' + country._id+'/state');
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Update existing Country
    $scope.updateState = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'countryForm');

        return false;
      }

      CustomCountry.updateCountryState($scope.state, $stateParams.countryId, $stateParams.stateId).then(function(result) {
        $location.path('country/'+$stateParams.countryId+'/state');
      });
    };

    $scope.findOneCountryState = function() {

      CustomCountry.findOneCountryState($stateParams.countryId, $stateParams.stateId).then(function(result) {
        $scope.state = result;
      });
    }


    // Find a list of Country
    $scope.find = function () {
      $scope.countries = Country.query();
    };

    // Find existing country
    $scope.findOne = function () {
      $scope.country = Country.get({
        countryId: $stateParams.countryId
      });
    };
  }
  ]);

const ALL_COUNTRIES = "ALL";

const app = angular.module("countriesApp", ["ngResource"]);

app
  .controller("CountriesController", [
    "$scope",
    "CountriesService",
    ($scope, CountriesService) => {
      init();

      function init() {
        $scope.selectedCountry = ALL_COUNTRIES;

        CountriesService.getCountries().then(({ geonames: countries }) => {
          $scope.countries = countries;
          $scope.countryNames = [
            ALL_COUNTRIES,
            ...new Set(countries.map(({ countryName }) => countryName).sort())
          ];
        });
      }
    }
  ])
  .factory("CountriesService", [
    "$resource",
    $resource => ({
      getCountries: () => {
        const Country = $resource(
          "http://api.geonames.org/countryInfoJSON",
          {
            formatted: "true",
            username: "hydrane"
          },
          { list: { method: "GET" } }
        );

        return Country.list().$promise;
      }
    })
  ]);

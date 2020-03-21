const ALL = "ALL";

const app = angular.module("countriesApp", ["ngResource"]);

app
  .controller("CountriesController", [
    "$scope",
    "CountriesService",
    ($scope, CountriesService) => {
      $scope.metrics = [ALL, "areaInSqKm", "population"];
      $scope.chartMaxResults = [5, 10, 15, 20];

      $scope.selectedContinent = ALL;
      $scope.selectedMetric = ALL;
      $scope.selectedMaxResults = 5;

      init();

      function init() {
        CountriesService.getCountries().then(({ geonames: countries }) => {
          $scope.countries = countries;
          $scope.continentNames = [
            ALL,
            ...new Set(countries.map(({ continentName }) => continentName).sort())
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

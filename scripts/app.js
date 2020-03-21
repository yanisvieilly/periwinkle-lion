const ALL = "ALL";

const app = angular.module("countriesApp", ["ngResource"]);

app
  .controller("CountriesController", [
    "$scope",
    "CountriesService",
    ($scope, CountriesService) => {
      $scope.countries = [];

      $scope.continentNames = [ALL];
      $scope.metrics = [ALL, "areaInSqKm", "population"];
      $scope.chartMaxResults = [5, 10, 15, 20];

      $scope.selectedContinent = ALL;
      $scope.selectedMetric = ALL;
      $scope.selectedMaxResults = 5;

      $scope.shouldShowColumn = shouldShowColumn;
      $scope.filteredCountries = filteredCountries;
      $scope.totalAreaInSqKm = totalAreaInSqKm;
      $scope.totalPopulation = totalPopulation;

      init();

      function init() {
        CountriesService.getCountries().then(({ geonames: countries }) => {
          $scope.countries = countries.sort((a, b) =>
            a.countryName.localeCompare(b.countryName)
          );
          $scope.continentNames = [
            ALL,
            ...new Set(countries.map(({ continentName }) => continentName))
          ];
        });
      }

      function shouldShowColumn(column) {
        return [ALL, column].includes($scope.selectedMetric);
      }

      function filteredCountries() {
        return $scope.countries.filter(({ continentName }) =>
          [ALL, continentName].includes($scope.selectedContinent)
        );
      }

      function totalAreaInSqKm() {
        return filteredCountries().reduce(
          (total, { areaInSqKm }) => total + parseFloat(areaInSqKm),
          0
        );
      }

      function totalPopulation() {
        return filteredCountries().reduce(
          (total, { population }) => total + parseInt(population, 10),
          0
        );
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

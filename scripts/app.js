const app = angular.module("countriesApp", ["ngResource"]);

app
  .controller("CountriesController", [
    "$scope",
    "CountriesService",
    ($scope, CountriesService) => {
      init();

      function init() {
        CountriesService.getCountries().then(({ geonames }) => {
          console.log(geonames);
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

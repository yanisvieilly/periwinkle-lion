angular.module("countriesApp").factory("CountriesService", [
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

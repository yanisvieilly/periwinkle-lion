const ALL = "ALL";

angular.module("countriesApp").controller("CountriesController", [
  "$scope",
  "CountriesService",
  ($scope, CountriesService) => {
    $scope.countries = [];
    $scope.filteredCountries = [];

    $scope.continentNames = [ALL];
    $scope.metrics = [ALL, "areaInSqKm", "population"];
    $scope.chartMaxResults = [5, 10, 15, 20];

    $scope.selectedContinent = ALL;
    $scope.selectedMetric = ALL;
    $scope.selectedMaxResults = 5;

    $scope.isFirstLaunch = true;

    $scope.areaInSqKmChartConfig = {};
    $scope.populationChartConfig = {};

    $scope.sortProperty = "countryName";
    $scope.sortOrderAsc = true;

    $scope.shouldShowColumn = shouldShowColumn;
    $scope.totalAreaInSqKm = totalAreaInSqKm;
    $scope.totalPopulation = totalPopulation;
    $scope.buildChartConfig = buildChartConfig;
    $scope.selectContinent = selectContinent;
    $scope.changeMaxResults = changeMaxResults;
    $scope.clickGo = clickGo;
    $scope.sortBy = sortBy;

    init();

    function init() {
      return CountriesService.getCountries().then(({ geonames: countries }) => {
        sortCountries(countries);
        filterCountries();

        $scope.continentNames = [
          ALL,
          ...new Set(countries.map(({ continentName }) => continentName))
        ];

        changeMaxResults();
      });
    }

    function clickGo() {
      init().then(() => {
        $scope.isFirstLaunch = false;
      });
    }

    function sortBy(criterion) {
      if ($scope.sortProperty === criterion) {
        $scope.sortOrderAsc = !$scope.sortOrderAsc;
      } else {
        $scope.sortProperty = criterion;
        $scope.sortOrderAsc = true;
      }
    }

    function sortCountries(countries) {
      $scope.countries = countries.sort((a, b) =>
        a.countryName.localeCompare(b.countryName)
      );
    }

    function shouldShowColumn(column) {
      return [ALL, column].includes($scope.selectedMetric);
    }

    function selectContinent() {
      filterCountries();
      changeMaxResults();
    }

    function filterCountries() {
      $scope.filteredCountries = $scope.countries.filter(({ continentName }) =>
        [ALL, continentName].includes($scope.selectedContinent)
      );
    }

    function changeMaxResults() {
      $scope.areaInSqKmChartConfig = buildChartConfig("areaInSqKm");
      $scope.populationChartConfig = buildChartConfig("population");
    }

    function totalAreaInSqKm() {
      return $scope.filteredCountries.reduce(
        (total, { areaInSqKm }) => total + parseFloat(areaInSqKm),
        0
      );
    }

    function totalPopulation() {
      return $scope.filteredCountries.reduce(
        (total, { population }) => total + parseInt(population, 10),
        0
      );
    }

    function buildChartConfig(name) {
      return {
        chart: {
          type: "pie"
        },
        title: {
          text: name
        },
        series: [
          {
            name,
            data: buildSeries(name)
          }
        ]
      };
    }

    function buildSeries(criterion) {
      const sortedCountries = $scope.filteredCountries.sort((a, b) => {
        if (parseFloat(a[criterion]) > parseFloat(b[criterion])) {
          return -1;
        }

        if (parseFloat(a[criterion]) < parseFloat(b[criterion])) {
          return 1;
        }

        return 0;
      });

      const maxResultsCountries = sortedCountries.slice(
        0,
        $scope.selectedMaxResults
      );

      const otherCountries = sortedCountries.slice($scope.selectedMaxResults);

      return [
        ...maxResultsCountries.map(country => ({
          name: country.countryName,
          y: parseFloat(country[criterion])
        })),
        {
          name: "Others",
          y: otherCountries.reduce(
            (total, country) => total + parseFloat(country[criterion]),
            0
          )
        }
      ];
    }
  }
]);

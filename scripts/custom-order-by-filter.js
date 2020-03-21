angular.module("countriesApp").filter("customOrderBy", [
  "orderByFilter",
  orderBy => (countries, sortProperty, sortOrderAsc) => {
    if (["continentName", "countryName"].includes(sortProperty)) {
      return orderBy(countries, sortProperty, !sortOrderAsc);
    }

    return countries.sort((a, b) => {
      if (parseFloat(a[sortProperty]) > parseFloat(b[sortProperty])) {
        return sortOrderAsc ? -1 : 1;
      }

      if (parseFloat(a[sortProperty]) < parseFloat(b[sortProperty])) {
        return sortOrderAsc ? 1 : -1;
      }

      return 0;
    });
  }
]);

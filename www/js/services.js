angular.module('starter.services', [])

.service('DashServices', function($http, Backand){
  var baseUrl = '/1/objects/';

  function getUrl() {
    return Backand.getApiUrl() + baseUrl;
  }
  function getUrlForId(id) {
    return getUrl() + id;
  }
  getCats = function () {
    return $http.get(getUrl()+Categorias);
  };

  return {
    getCats: getCats
  }

});

angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http) {
  $http.get('http://mysafeinfo.com/api/data?list=teamlist_us&format=json').then(function(resp) {
    console.log('Success', resp);
    // For JSON responses, resp.data contains the result
    $scope.subs=resp.data;
    $scope.cats=resp.data;

  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
  })

})

.controller('SolicitudCtrl', function($scope, $http) {
  $http.get('http://mysafeinfo.com/api/data?list=teamlist_us&format=json').then(function(resp) {
    console.log('Success', resp);
    // For JSON responses, resp.data contains the result
    $scope.equipos=resp.data;

  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
  })

})


.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

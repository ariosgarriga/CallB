angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('SolicitudCtrl', function($scope, Chats) {

})


.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});

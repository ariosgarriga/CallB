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


.controller('AccountCtrl', function($scope, $http, $state, $cordovaGeolocation) {
  $http.get('https://api.backand.com:443/1/objects/usuarios/1').then(function(resp) {
    console.log('Success backand', resp);
    // For JSON responses, resp.data contains the result
    $scope.usuario=resp.data;
    console.log(resp.data.data.id);


  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code

  })


    var options = {timeout: 10000, enableHighAccuracy: true};

  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    google.maps.event.addListenerOnce($scope.map, 'idle', function(){

      var marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          position: latLng
      });

      var infoWindow = new google.maps.InfoWindow({
          content: "Here I am!"
      });

      google.maps.event.addListener(marker, 'click', function () {
          infoWindow.open($scope.map, marker);
      });

    });

  }, function(error){
    console.log("Could not get location");
  });

})

.controller('RegisterCtrl', function($scope) {
  $scope.usuario = {Nombre:"", Apellido:"",Correo:"", contra:"", fnac:"", Telefono:"", bobtoggle: false};

  $scope.registrar = function(Nombre, Apellido,Correo, contra, rcontra, fnac, Telefono, bobtoggle){

    if(contra === rcontra){
      $scope.usuario.Nombre = Nombre;
      $scope.usuario.Apellido = Apellido;
      $scope.usuario.Correo = Correo;
      $scope.usuario.contra = contra;
      $scope.usuario.fnac = fnac;
      $scope.usuario.Telefono = Telefono;
      $scope.usuario.bobtoggle = bobtoggle;
      console.log("usuario");



    }else{
      $scope.error = "No coinciden las conraseña";
    }

  }

})

.controller('LoginCtrl', function($scope) {
  $scope.usuario = {Correo:"", contra:""}

  $scope.validar = function(Correo, contra){
    $scope.usuario.Correo = Correo;
    $scope.usuario.contra = contra;
  }


})

.controller('TrabajosCtrl', function($scope, $http) {

  $http.get('http://mysafeinfo.com/api/data?list=teamlist_us&format=json').then(function(resp) {
    console.log('Success', resp);
    // For JSON responses, resp.data contains the result
    $scope.equipos=resp.data;

  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code

  })

})


;

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


.controller('AccountCtrl', function($scope, $http) {
  $http.get('http://callbob.netau.net/prueba3.json').then(function(resp) {
    console.log('Success', resp);
    // For JSON responses, resp.data contains the result
  //  $scope.usuario=resp.data;


  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code

  });
  $scope.usuario =
    {
      "Nombre":"Andres",
      "Apellido":"Rios",
      "Correo":"ariosgarriga@gmail.com",
      "Telefono":"04122551616"
    }


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

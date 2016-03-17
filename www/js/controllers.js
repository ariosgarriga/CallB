angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http, DashServices) {

  $http.get('https://api.backand.com:443/1/objects/Categorias').then(function(resp) {
    console.log('Success', resp);
    $scope.cats=resp.data.data;
  }, function(err) {
    console.error('ERR', err);
  })

  $scope.showSelectValue = function(mySelect) {
    console.log(mySelect);
    $http.get('https://api.backand.com/1/query/data/getSubCats?parameters='+
    '%7B%22nomCat%22:%22'+mySelect+'%22%7D').then(function(resp) {
      console.log('Success', resp);
      // For JSON responses, resp.data contains the result
      $scope.subs=resp.data;
    }, function(err) {
      console.error('ERR', err);
      // err.status will contain the status code
    })
  }

  $scope.sendSolicitud = function(descripcion, catSelect, subcatSelect, ubicacion){
    var usuario = {
    	"Descripcion": descripcion,
    	"Categoria": catSelect,
    	"Subcategoria": subcatSelect,
    	"Ubicacion": ubicacion
    }

    $scope.data = { text: "" };

    $http.post('', usuario).then(function(resp) {
      console.log('Success post Trabajo', resp);
    }, function(err) {
      console.error('ERR', err);
    })


  }

})

.controller('SolicitudCtrl', function($scope, $http) {
  $scope.actualizar = function(busqueda){

    $http.get('https://api.backand.com/1/query/data/getSolicitudes?parameters='+
    '%7B%22usuario%22:%22'+busqueda+'%22%7D').then(function(resp) {
      console.log('Success', resp);
      // For JSON responses, resp.data contains the result
      $scope.Trabajos=resp.data;

    }, function(err) {
      console.error('ERR', err);
      // err.status will contain the status code
    })

  }

})

.controller('AccountCtrl', function($scope, $http, $state, $cordovaGeolocation, $cookieStore) {

    $scope.usuario = $cookieStore.get('Usuario')[0];

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

.controller('RegisterCtrl', function($scope, $http, $location) {

  $scope.registrar = function(Nombre, Apellido,Correo, contra, rcontra,
    fnac, Telefono, bobtoggle, viewLogIn){

    if(contra === rcontra){
      var usuario = {
        	"nombre": Nombre,
        	"apellido": Apellido,
        	"correo": Correo,
        	"contrasena": contra,
        	"telefono": Telefono,
        	"fecha_nac": fnac,
        	"verificado": bobtoggle
        }
      $http.post('https://api.backand.com:443/1/objects/usuarios', usuario).then(function(resp) {
        console.log('Success post Trabajo', resp);
      }, function(err) {
        console.error('ERR', err);
      })

      $location.path(view);

    }else{
      $scope.error = "No coinciden las conraseña";
    }

  }

})

.controller('LoginCtrl', function($scope, $cookieStore, $location, $http) {

  $scope.validar = function(Correo, contra, viewDash){

    var usuario;
    var len = 0;
    $http.get('https://api.backand.com/1/query/data/'+
      'LogIn?parameters=%7B%22user%22:%22'+Correo+'%22,'+
      '%22password%22:%22'+contra+'%22%7D').then(function(resp) {
      console.log('Success Respuesta LogIn', resp);

      usuario=resp.data;

      console.log(JSON.stringify(usuario));

      if(usuario.length === 1){

        $cookieStore.put('Usuario', usuario);
        console.log("Nombre usuario en coockie: "+$cookieStore.get('Usuario')[0].nombre);
        $location.path(viewDash);

      }else{
        $scope.error = "Usuario o Contrasena Invalido";
      }

    }, function(err) {
      console.error('ERR LogIn', err);
    })

  }

  $scope.CambiarAregistro = function(view){
    $location.path(view);
  }


})

.controller('TrabajosCtrl', function($scope, $http) {

})


;

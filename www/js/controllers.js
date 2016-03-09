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

  $scope.sendSolicitud = function(descripcion, catSelect, subcatSelect, ubicacion, usuario){
    var usuario = {
    	"Descripcion": descripcion,
    	"Categoria": catSelect,
    	"Subcategoria": subcatSelect,
    	"Ubicacion": ubicacion,
      "idUsuario": usuario
    }

    $http.post('https://api.backand.com:443/1/objects/Trabajos', usuario).then(function(resp) {
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

.controller('AccountCtrl', function($scope, $http, $state, $cordovaGeolocation) {
  $http.get('https://api.backand.com:443/1/objects/usuarios/1').then(function(resp) {
    console.log('Success backand', resp);
    // For JSON responses, resp.data contains the result
    $scope.usuario=resp.data;

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

.controller('RegisterCtrl', function($scope, $http) {

  $scope.registrar = function(Nombre, Apellido,Correo, contra, rcontra, fnac, Telefono, bobtoggle){

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

  $http.get('https://api.backand.com/1/query/data/getBOBs').then(function(resp) {
    console.log('Success', resp);
    $scope.BOBs=resp.data;
  }, function(err) {
    console.error('ERR', err);
  })

  $scope.showSelectValue = function(bob) {
    $http.get('https://api.backand.com/1/query/data/getTrabajosBOB?parameters='+
    '%7B%22nombreBOB%22:%22'+bob+'%22%7D').then(function(resp) {
      console.log('Success jobs', resp);
      // For JSON responses, resp.data contains the result
      $scope.Trabajos=resp.data;

    }, function(err) {
      console.error('ERR', err);
      // err.status will contain the status code

    })
  }


})


;

angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http, DashServices, $cookieStore, $ionicPopup) {

  $http.get('https://api.backand.com:443/1/objects/Categorias').then(function(resp) {
    console.log('Success', resp);
    $scope.cats=resp.data.data;
  }, function(err) {
    console.error('ERR', err);
  })

  $scope.showSelectValue = function(mySelect) {
       console.log(mySelect);
       $http.get('https://api.backand.com/1/query/data/findSubCats?parameters='+
       '%7B%22cat%22:%22'+mySelect+'%22%7D').then(function(resp) {
         console.log('Success subs', resp);
         $scope.subs=resp.data;
       }, function(err) {
         console.error('ERR', err);
       })
     }

  $scope.sendSolicitud = function(descripcion, catSelect, subcatSelect, ubicacion){

    for (var i = 0; i < $scope.subs.length; i++) {
      if($scope.subs[i].Nombre == subcatSelect){
        subcatSelect=$scope.subs[i].id;
        console.log(i);
      }
    }

    var tarea = {
    	"Descripcion": descripcion,
    	"Categoria": subcatSelect,
    	"owner": $cookieStore.get('Usuario')[0].id,
    	"Ubicacion": ubicacion
    }
     console.log(tarea.Categoria);
     console.log(tarea.owner);

    $scope.data = { text: "" };

    $http.post('https://api.backand.com:443/1/objects/Trabajos', tarea).then(function(resp) {
      console.log('Success post Trabajo', resp);
    }, function(err) {
      console.error('ERR', err);
    })


     var alertPopup = $ionicPopup.alert({
       title: 'BIEN! :-)',
       template: 'Tu solicitud se ha enviado correctmente'
     });

     alertPopup.then(function(res) {
       console.log('Solicitud enviada y Reload');
       location.reload();
     });



  }

})

.controller('SolicitudCtrl', function($scope, $http, $cookieStore, $ionicPopup) {

  $scope.numPpostulados = 0;
  $scope.MostrarPostu = true;
  $scope.Aux= new Object();


    $http.get('https://api.backand.com/1/query/data/getSolicitudes?parameters='+
    '%7B%22idUser%22:%22'+$cookieStore.get('Usuario')[0].id+'%22%7D').then(function(resp) {
      console.log('Success', resp);
      $scope.Solicitudes=resp.data;


      for (var i = 0; i < $scope.Solicitudes.length; i++) {
        $scope.Aux[i]=$scope.Solicitudes[i];

        $http.get('https://api.backand.com/1/query/data/getPostulados?parameters='+
        '%7B%22idTrabajo%22:%22'+$scope.Solicitudes[i].id+'%22%7D').then(function(resp) {
          console.log('Success Postulados', resp);
          $scope.Postulados=resp.data;
          $scope.Aux[i].postulados=$scope.Postulados;


        }, function(err) {
          console.error('ERR', err);
        })
        $scope.Solicitudes[i]
      }
      console.log(JSON.stringify($scope.Solicitudes));

    }, function(err) {
      console.error('ERR', err);
    })




    $scope.verPostulados = function(idTrabajo){

      $scope.MostrarPostu = false;

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

  $scope.Subcats = [];
  $scope.BobSubs = true;

  $scope.HideBob =  function(){
    $scope.BobSubs = $scope.BobSubs === false ? true: false;
  }

  $http.get('https://api.backand.com:443/1/objects/Categorias?pageSize=20&pageNumber=1').then(function(resp) {
      console.log('Success', resp);
      $scope.Cates=resp.data.data;
    }, function(err) {
      console.error('ERR', err);
    })

  $scope.showSelectValue = function(mySelect) {
       console.log(mySelect);
       $http.get('https://api.backand.com/1/query/data/findSubCats?parameters='+
       '%7B%22cat%22:%22'+mySelect+'%22%7D').then(function(resp) {
         console.log('Success', resp);
         $scope.subs=resp.data;
       }, function(err) {
         console.error('ERR', err);
       })
     }

     $scope.selection = [];

      // helper method to get selected subs
    $scope.selectedSubs = function selectedSubs() {
      return filterFilter($scope.subs, { selected: true });
    };

    // watch subs for changes
    $scope.$watch('subs|filter:{selected:true}', function (nv) {
      $scope.selection = nv.map(function (sub) {
        return sub.Nombre;
      });
    }, true);

    $scope.addSubs = function(){

      $scope.Subcats = $scope.Subcats.concat($scope.selection);
      //Funcion para eliminar duplicados
      var unique = function(origArr) {
        var newArr = [],
            origLen = origArr.length,
            found,
            x, y;

        for ( x = 0; x < origLen; x++ ) {
            found = undefined;
            for ( y = 0; y < newArr.length; y++ ) {
                if ( origArr[x] === newArr[y] ) {
                  found = true;
                  break;
                }
            }
            if ( !found) newArr.push( origArr[x] );
        }
       return newArr;
     }

    $scope.Subcats = unique($scope.Subcats);
    console.log($scope.Subcats);

    }

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
        console.log('Success post Usuario', resp);

      }, function(err) {
        console.error('ERR', err);
      })

      if(bobtoggle){
        for (var i = 0; i < $scope.Subcats.length; i++) {
          $http.get('https://api.backand.com/1/query/data/insertBOB?parameters='+
          '%7B%22sub%22:%22'+$scope.Subcats[i]+'%22,%22correo%22:%22'+Correo+'%22%7D').then(function(resp) {
              console.log('Success insert BOB'+$scope.Subcats[i], resp);
            }, function(err) {
              console.error('ERR', err);
            })
        }
      }

      $location.path(viewLogIn);

    }else{
      $scope.error = "No coinciden las conraseña";
    }

  }

})

.controller('LoginCtrl', function($scope, $cookieStore, $location, $http) {

  $scope.validar = function(Correo, contra){

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

        if($cookieStore.get('Usuario')[0].verificado==1){
          $location.path('tab/dash');
        }else{
          $location.path('consu/dash');
        }


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

.controller('TrabajosCtrl', function($scope, $http, $cookieStore, $ionicPopup) {

  $http.get('https://api.backand.com/1/query/data/getTrabajos?parameters='+
  '%7B%22idBOB%22:%22'+$cookieStore.get('Usuario')[0].id+'%22%7D').then(function(resp) {
    console.log('Success', resp);
    $scope.Trabajos=resp.data;
    //console.log(JSON.stringify($scope.Trabajos));
  }, function(err) {
    console.error('ERR', err);
  })

  $scope.Aceptar = function(nombre, apellido, id){

    var alertPopup = $ionicPopup.alert({
      title: 'EXITO',
      template: 'Te has postulado correctamente para el trabajo, espera'+
      'por la respuesta de '+nombre+' '+apellido
    });

    alertPopup.then(function(res) {
      console.log('Solicitud enviada y Reload');
      location.reload();
    });


    var postulacion = {
    	"PostulanteTrabajo": id,
    	"UsuarioPostulante": $cookieStore.get('Usuario')[0].id
    }

    $http.post('https://api.backand.com:443/1/objects/Postulantes', postulacion).then(function(resp) {
      console.log('Success post Postulacion', resp);

    }, function(err) {
      console.error('ERR', err);
    })


  }



})

;

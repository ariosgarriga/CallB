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

    $http.post('https://api.backand.com:443/1/objects/Trabajos', tarea).then(function(resp) {
      console.log('Success post Trabajo', resp);

      var alertPopup = $ionicPopup.alert({
        title: 'BIEN! :-)',
        template: 'Tu solicitud se ha enviado correctmente'
      });

      alertPopup.then(function(res) {
        console.log('Solicitud enviada y Reload');
        location.reload();
      });

    }, function(err) {
      console.error('ERR post trabajo', err);
    })








  }

})

.controller('SolicitudCtrl', function($scope, $http, $cookieStore, $ionicPopup, $location) {
  $scope.SListas = true;
  $scope.SAceptadas = true;
  $scope.SEspera= true;
  $scope.SListas= true;
  $scope.Postulados = "Postulados";

    $http.get('https://api.backand.com/1/query/data/getSolicitudes?parameters='+
    '%7B%22idUser%22:%22'+$cookieStore.get('Usuario')[0].id+'%22%7D').then(function(resp) {
      console.log('Success', resp);
      $scope.Solicitudes=resp.data;
        if ($scope.Solicitudes.length>0) {
          $scope.SEspera= false;
        }
    }, function(err) {
      console.error('ERR', err);
    })

    $http.get('https://api.backand.com/1/query/data/getSolicitudesAceptadas?parameters=%7B%22idUser%22:%22'+
    $cookieStore.get('Usuario')[0].id+'%22%7D').then(function(resp) {
      console.log('Success', resp);
      $scope.Aceptadas=resp.data;
      if ($scope.Aceptadas.length>0) {
        $scope.SAceptadas= false;
      }
    }, function(err) {
      console.error('ERR', err);
    })

    $http.get('https://api.backand.com/1/query/data/getSolicitudesListas?parameters=%7B%22idUser%22:%22'+
    $cookieStore.get('Usuario')[0].id+'%22%7D').then(function(resp) {
      console.log('Success', resp);
      $scope.Listas=resp.data;
      if ($scope.Listas.length>0) {
        $scope.SListas= false;
      }
    }, function(err) {
      console.error('ERR', err);
    })

    $scope.verPostulados = function(idTrabajo){
      $cookieStore.put('idTrabajo', idTrabajo);
      console.log('En el coockie tengo '+$cookieStore.get('idTrabajo'));
      $location.path('tab/postulantes');
    }

    $scope.Actualizar = function(){
      location.reload();
    }





    $scope.FinalizarTrabajo = function(idAceptada) {

       $scope.data = {}
       $scope.data.idAceptada = idAceptada;
       var myPopup = $ionicPopup.show({
          template: ' Puntuacion 1-5<input type="number" min="1" max="5" ng-model="data.PuntuacionBOB">'+
          '<br>Comentario sobre el BOB:<textarea ng-model="data.comentarioBOB" > ',
          title: 'Comentarios',
          subTitle: 'Ingrese sus comentarios y puntuacion del BOB',
          scope: $scope,
          buttons: [{
             text: '<b>Finalizar</b>',
             type: 'button-positive button-full',
             onTap: function(e) {
                   return $scope.data;
             }
          } ]
       });

       myPopup.then(function(res) {

         $http.get('https://api.backand.com:443/1/objects/Trabajos/'+res.idAceptada).success(function(data) {
           console.log('Success DoneConsumidor', data);
            var Update = data;
             Update.DoneConsumidor = true;

             $http.put('https://api.backand.com:443/1/objects/Trabajos/'+res.idAceptada, Update).success(function(data) {
                console.log('Success put Update', data);
              })
              .error(function(data) {
                  console.log('Error: put update' + data);
              });
        })
        .error(function(data) {
            console.log('Error: dondeconsumidor' + data);
        });



        $http.get('https://api.backand.com/1/query/data/getResena?parameters=%7B%22idTrabajo%22:%22'+
        res.idAceptada+'%22%7D').success(function(data) {
          console.log('Success getResena', data);
          if(data.length>0){
            var Resena = data[0];
            Resena.Calificacion_B = res.PuntuacionBOB;
            Resena.Comentario_B = res.comentarioBOB;

            $http.put('https://api.backand.com:443/1/objects/Resena/'+Resena.id, Resena).success(function(data) {
               console.log('Success put Resena', data);
             })
             .error(function(data) {
                 console.log('Error: put update' + data);
             });

          }else{

            var Resena={
             "Calificacion_C":  null,
             "Comentario_C": null,
             "Comentario_B": res.comentarioBOB,
             "Calificacion_B": res.PuntuacionBOB,
             "ResenaTrabajo": res.idAceptada
            }

            $http.post('https://api.backand.com:443/1/objects/Resena', Resena).success(function(data) {
               console.log('Success POsT Resena', data);
             })
             .error(function(data) {
                 console.error('Error: Post update' + data);
             });

          }
       })
       .error(function(data) {
           console.error('Error: getResena' + data);
           var Resena
       });



       });
   };


})

.controller('AccountCtrl', function($scope, $http, $state, $cordovaGeolocation, $cookieStore) {


    $scope.usuario = $cookieStore.get('Usuario')[0];

    $http.get('https://api.backand.com/1/query/data/getCommentsBOB?parameters='+
    '%7B%22idUser%22:%22'+$scope.usuario.id+'%22%7D').then(function(resp) {
      console.log('Success', resp);
      $scope.ComentariosBOB=resp.data;

      var aux = 0;
      for (var i = 0; i < $scope.ComentariosBOB.length; i++) {
        aux=aux+$scope.ComentariosBOB[i].Calificacion_B;
      }



      if($scope.ComentariosBOB.length>0){
        $scope.errorComentBOB = true;
        $scope.CaliBOB= (aux/$scope.ComentariosBOB.length).toFixed(0);
      }else{
        $scope.errorComentBOB = false;
        $scope.CaliBOB = 0;
      }

      if($scope.usuario.verificado){
        $scope.ComenBOB = false;
      }else{
        $scope.ComenBOB = true;
      }
    }, function(err) {
      console.error('ERR', err);
    })

    $http.get('https://api.backand.com/1/query/data/getCommentsCliente?parameters='+
    '%7B%22idUser%22:%22'+$scope.usuario.id+'%22%7D').then(function(resp) {
      console.log('Success', resp);
      $scope.ComentariosCliente=resp.data;

      var aux = 0;
      for (var i = 0; i < $scope.ComentariosCliente.length; i++) {
        aux=aux+$scope.ComentariosCliente[i].Calificacion_C;
      }


      if($scope.ComentariosCliente.length>0){
        $scope.errorComentCliente = true;
        $scope.CaliCliente= (aux/$scope.ComentariosCliente.length).toFixed(0);
      }else{
        $scope.errorComentCliente = false;
        $scope.CaliCliente=0;
      }
    }, function(err) {
      console.error('ERR', err);
    })

/*    var options = {timeout: 10000, enableHighAccuracy: true};

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
  });*/

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

  $scope.Actualizar = function(){
    location.reload();
  }

  $http.get('https://api.backand.com/1/query/data/getTrabajos?parameters='+
  '%7B%22idBOB%22:%22'+$cookieStore.get('Usuario')[0].id+'%22%7D').then(function(resp) {
    console.log('Success', resp);
    $scope.Trabajos=resp.data;
    if($scope.Trabajos.length==0){
      $scope.error = "No hay mas trabajos disponibles";
    }
  }, function(err) {
    console.error('ERR', err);
  })

  $http.get('https://api.backand.com/1/query/data/getBOBPostulados?parameters=%7B%22idUser%22:%22'+
  $cookieStore.get('Usuario')[0].id+'%22%7D').then(function(resp) {
    console.log('Success', resp);
    $scope.Jobs=resp.data;
    if($scope.Jobs.length>0){
      $scope.TEspera=false;
    }else{
      $scope.TEspera=true;
    }

  }, function(err) {
    console.error('ERR', err);
  })

  $http.get('https://api.backand.com/1/query/data/getBOBAceptados?parameters=%7B%22idUser%22:%22'+
  $cookieStore.get('Usuario')[0].id+'%22%7D').then(function(resp) {
    console.log('Success', resp);
    $scope.Aceptados=resp.data;
    if($scope.Aceptados.length>0){
      $scope.TAceptados=false;
    }else{
      $scope.TAceptados=true;
    }
  }, function(err) {
    console.error('ERR', err);
  })

  $http.get('https://api.backand.com/1/query/data/getBOBListos?parameters=%7B%22idUser%22:%22'+
  $cookieStore.get('Usuario')[0].id+'%22%7D').then(function(resp) {
    console.log('Success', resp);
    $scope.Listos=resp.data;
    if($scope.Listos.length>0){
      $scope.TListos=false;
    }else{
      $scope.TListos=true;
    }
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

  $scope.FinalizarTrabajo = function(idAceptada) {

     $scope.data = {}
     $scope.data.idAceptada = idAceptada;
     var myPopup = $ionicPopup.show({
        template: ' Puntuacion 1-5<input type="number" min="1" max="5" ng-model="data.PuntuacionCliente">'+
        '<br>Comentario sobre el Cliente:<textarea ng-model="data.comentarioCliente" > ',
        title: 'Comentarios',
        subTitle: 'Ingrese sus comentarios y puntuacion del Cliente',
        scope: $scope,
        buttons: [{
           text: '<b>Finalizar</b>',
           type: 'button-positive button-full',
           onTap: function(e) {
                 return $scope.data;
           }
        } ]
     });

     myPopup.then(function(res) {

       $http.get('https://api.backand.com:443/1/objects/Trabajos/'+res.idAceptada).success(function(data) {
         console.log('Success DoneConsumidor', data);
          var Update = data;

           Update.DoneBOB = true;

           $http.put('https://api.backand.com:443/1/objects/Trabajos/'+res.idAceptada, Update).success(function(data) {
              console.log('Success put Update', data);
            })
            .error(function(data) {
                console.log('Error: put update' + data);
            });
      })
      .error(function(data) {
          console.log('Error: dondeconsumidor' + data);
      });

      $http.get('https://api.backand.com/1/query/data/getResena?parameters=%7B%22idTrabajo%22:%22'+
      res.idAceptada+'%22%7D').success(function(data) {
        console.log('Success getResena', data);
        if(data.length>0){
          var Resena = data[0];
          Resena.Calificacion_C = res.PuntuacionCliente;
          Resena.Comentario_C = res.comentarioCliente;

          $http.put('https://api.backand.com:443/1/objects/Resena/'+Resena.id, Resena).success(function(data) {
             console.log('Success put Resena', data);
           })
           .error(function(data) {
               console.log('Error: put update' + data);
           });
        }else{
          var Resena={
          	"Calificacion_C":  res.PuntuacionCliente,
          	"Comentario_C": res.comentarioCliente,
          	"Comentario_B": null,
          	"Calificacion_B": null,
          	"ResenaTrabajo": res.idAceptada
          }

          $http.post('https://api.backand.com:443/1/objects/Resena', Resena).success(function(data) {
             console.log('Success POsT Resena', data);
           })
           .error(function(data) {
               console.error('Error: Post update' + data);
           });

        }
     })
     .error(function(data) {
         console.error('Error: getResena' + data);
         var Resena
     });




     });
  };


})

.controller('PostulanteCtrl', function($scope, $http, $cookieStore, $ionicPopup, $location) {

  $http.get('https://api.backand.com/1/query/data/getPostulados?parameters='+
  '%7B%22idTrabajo%22:%22'+$cookieStore.get('idTrabajo')+'%22%7D').then(function(resp) {
   console.log('Success Postulados', resp);
    $scope.Postulantes=resp.data;
    $cookieStore.put('Postulantes', resp.data);
    console.log($scope.Postulantes.length);
    if($scope.Postulantes.length==0){
      $scope.error = "Nadie se ha postulado";
    }

  }, function(err) {
    console.error('ERR', err);
  })

  $scope.aceptarPostulado = function(idTrabajo, idSolicitante){

    $http.get('https://api.backand.com:443/1/objects/Trabajos/'+idTrabajo).then(function(resp) {
     console.log('Success Postulados', resp);

     var Update = resp.data;
     //console.log(JSON.stringify(Update));

     Update.Trabajador = idSolicitante;
     Update.Aceptada = true;

       $http.put('https://api.backand.com:443/1/objects/Trabajos/'+idTrabajo, Update).then(function(resp) {
        console.log('Success PUT', resp);
        history.back();
       }, function(err) {
         console.error('ERR', err);
       })



    }, function(err) {
      console.error('ERR', err);
    })




  }

})

;

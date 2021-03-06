// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers',
  'starter.services', 'ngCordova', 'backand', 'ngCookies'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function (BackandProvider, $stateProvider, $urlRouterProvider, $httpProvider) {
      BackandProvider.setAppName('callbob');
      BackandProvider.setSignUpToken('11f15581-be39-48c5-a142-82d771ef67bd');
      BackandProvider.setAnonymousToken('fd88aa57-d831-43df-8a29-3793e99eee22');
  })

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:
  .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginCtrl'
    })
    .state('registrarse', {
        url: '/registrarse',
        templateUrl: 'templates/registrarse.html',
        controller: 'RegisterCtrl'
      })

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.solicitudes', {
      url: '/solicitudes',
      views: {
        'tab-solicitudes': {
          templateUrl: 'templates/tab-solicitudes.html',
          controller: 'SolicitudCtrl'
        }
      }
    })
    .state('tab.postulantes', {
        url: '/postulantes',
        views: {
          'tab-solicitudes': {
            templateUrl: 'templates/postulantes.html',
            controller: 'PostulanteCtrl'
          }
        }
      })


  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('tab.trabajos', {
    url: '/trabajos',
    views: {
      'tab-trabajos': {
        templateUrl: 'templates/trabajos.html',
        controller: 'TrabajosCtrl'
      }
    }
  })

  .state('consu', {
  url: '/consu',
  abstract: true,
  templateUrl: 'templates/consu.html'
  })

  .state('consu.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('consu.solicitudes', {
      url: '/solicitudes',
      views: {
        'tab-solicitudes': {
          templateUrl: 'templates/tab-solicitudes.html',
          controller: 'SolicitudCtrl'
        }
      }
    })


  .state('consu.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })


  ;


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});

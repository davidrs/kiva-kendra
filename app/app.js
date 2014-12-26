'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.recent',
  'myApp.charts',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/recent'});

  console.log('start!');

//http://api.kivaws.org/v1/partners.json
}]);

// albania AL
// armenia AM
// azerbaijan AZ
// georgia GE
// moldova MD
// ukraine UA
// kyrgyzstan KG
// monglia  MN
// tajikistan TJ
// kosovo XK

'use strict';

/**
 * @ngdoc overview
 * @name websiteApp
 * @description
 * # websiteApp
 *
 * Main module of the application.
 */
angular
  .module('websiteApp', [
    // angular built ins
    'ngResource',
    'ngTouch',

    // angular third party plugins
    'ui.router',

    // app modules
    'websiteApp.sarees',
  ])
  .config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider){
  	$urlRouterProvider.otherwise('/');

  	$stateProvider
  		.state('home', {
  			url: '/',
  			templateUrl: 'src/app/views/sarees/sarees.html',
  			controller: 'SareesCtrl'
  		})
  		.state('saree', {
  			url: '/saree',
  			templateUrl: 'src/app/views/saree/saree.html'
  		})
  		.state('contact', {
  			url: '/contact',
  			templateUrl: 'src/app/views/contact/contact.html'
  		})
  }]);

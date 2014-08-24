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

    // templates
    'templates-app',
    'templates-components',

    // angular third party plugins
    'ui.router',

    // app modules
    'websiteApp.sarees',
    'websiteApp.saree',
    'websiteApp.contact',

  ])
  .config(function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise('/');
  });

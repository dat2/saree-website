'use strict';

/**
 * @ngdoc function
 * @name websiteApp.controller:SareeCtrl
 * @description
 * # MainCtrl
 * Controller of the websiteApp
 */
angular.module('websiteApp.contact', [])

  .config(function config($stateProvider){
    $stateProvider
      .state('contact', {
        url: '/contact',
        templateUrl: 'src/app/views/contact/contact.html',
        controller: 'ContactCtrl'
      })
  })

  .controller('CareeCtrl', function ContactController($scope) {
              
  });
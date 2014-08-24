'use strict';

/**
 * @ngdoc function
 * @name websiteApp.controller:SareesCtrl
 * @description
 * # MainCtrl
 * Controller of the websiteApp
 */
angular.module('websiteApp.sarees', [])

  .config(function config($stateProvider){
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/sarees/sarees.html',
        controller: 'SareesCtrl',
        resolve: {
        	sarees: function($http){
        		return $http.get('/sarees')
              .then(function(response){
        			return response.data;
        		});
        	}
        }
      });
  })

  .controller('SareesCtrl', function SareesController($scope, sarees) {
    $scope.sarees = sarees;
	});

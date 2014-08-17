'use strict';

/**
 * @ngdoc function
 * @name websiteApp.controller:SareeCtrl
 * @description
 * # MainCtrl
 * Controller of the websiteApp
 */
angular.module('websiteApp.sarees', [])
  .controller('SareeCtrl', function ($scope) {
    $scope.saree = 
    	{
    		"id":1,
    		"type":"designer",
    		"price":185.21,
    		"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"
    	}						
  });
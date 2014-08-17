'use strict';

/**
 * @ngdoc function
 * @name websiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the websiteApp
 */
angular.module('websiteApp.sarees', [])
  .controller('SareesCtrl', function ($scope) {
    $scope.awesomeThings = [
      {
      	title:'HTML5 Boilerplate',
      	descr:'HTML5 Boilerplate is a professional front-end template for building fast, robust, and adaptable web apps or sites.'
      },
      {
      	title: 'AngularJS',
      	descr: 'AngularJS is a toolset for building the framework most suited to your application development.'
  		},
  		{
  			title: 'Karma',
  			descr: 'Spectacular Test Runner for JavaScript.'
  		}
    ];

    $scope.sarees = [{"id":1,"type":"designer","price":185.21,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
										{"id":2,"type":"designer","price":91.33,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
										{"id":3,"type":"cotton","price":88.91,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
										{"id":4,"type":"cotton","price":183.23,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
										{"id":5,"type":"silk","price":96.07,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
										{"id":6,"type":"designer","price":94.35,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
										{"id":7,"type":"designer","price":252.15,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
										{"id":8,"type":"silk","price":233.54,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
										{"id":9,"type":"designer","price":116.28,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
										{"id":10,"type":"silk","price":200.66,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
										{"id":11,"type":"silk","price":215.72,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
										{"id":12,"type":"silk","price":293.18,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
										{"id":13,"type":"silk","price":152.97,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
										{"id":14,"type":"cotton","price":252.23,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"},
										{"id":15,"type":"silk","price":221.84,"thumbnail":"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"}]
  });

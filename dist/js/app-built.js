/**
 * saree-website - v0.0.0 - 2014-08-24
 * https://github.com/dat2/saree-website
 *
 * Copyright (c) 2014 Nicholas Dujay and Pirave Eahalaivan
 * Licensed MIT <>
 */
(function ( window, angular, undefined ) {
"use strict";angular.module("websiteApp",["ngResource","ngTouch","templates-app","templates-components","ui.router","websiteApp.sarees","websiteApp.saree","websiteApp.contact"]).config(["$urlRouterProvider","$stateProvider",function(e){e.otherwise("/")}]),angular.module("websiteApp.contact",[]).config(["$stateProvider",function(e){e.state("contact",{url:"/contact",templateUrl:"views/contact/contact.html",controller:"ContactCtrl"})}]).controller("CareeCtrl",["$scope",function(){}]),angular.module("websiteApp.saree",[]).config(["$stateProvider",function(e){e.state("saree",{url:"/saree",templateUrl:"views/saree/saree.html",controller:"SareeCtrl"})}]).controller("SareeCtrl",["$scope",function(e){e.saree={id:1,type:"designer",price:185.21,thumbnail:"http://www.drinkasinu.com/wp-content/uploads/2014/02/Product-Image-Coming-Soon.png"}}]),angular.module("websiteApp.sarees",[]).config(["$stateProvider",function(e){e.state("home",{url:"/",templateUrl:"views/sarees/sarees.html",controller:"SareesCtrl",resolve:{sarees:["$http",function(e){return e.get("/sarees").then(function(e){return e.data})}]}})}]).controller("SareesCtrl",["$scope","sarees",function(e,t){e.sarees=t}]);})( window, window.angular );

//# sourceMappingURL=app-built.js.map
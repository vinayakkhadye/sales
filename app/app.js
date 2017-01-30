/// <reference path="../Scripts/angular-1.1.4.js" />

/*#######################################################################
  
  Dan Wahlin
  http://twitter.com/DanWahlin
  http://weblogs.asp.net/dwahlin
  http://pluralsight.com/training/Authors/Details/dan-wahlin

  Normally like to break AngularJS apps into the following folder structure
  at a minimum:

  /app
      /controllers      
      /directives
      /services
      /partials
      /views

  #######################################################################*/

var app = angular.module('customersApp', ['ngRoute','chart.js']);
app.run(function($rootScope,$location) {
    $rootScope.userToken = false;
	$rootScope.logout	= function(){
		$rootScope.userToken = false;
		$location.path( "/login" );
	}
})
app.config(['$httpProvider', function($httpProvider) {  
    $httpProvider.interceptors.push('myInterceptor');
}]);
//This configures the routes and associates each route with a view and a controller
app.config(function ($routeProvider) {
    $routeProvider
        .when('/login',
            {
                controller: 'LoginController',
                templateUrl: 'app/partials/login.html'
            })
        .when('/orders',
            {
                controller: 'OrdersController',
                templateUrl: 'app/partials/orders.html'
            })
        .when('/charts/:chartName',
            {
                controller: 'ChartsController',
                templateUrl: 'app/partials/charts.html'
            })
		
        .when('/customers',
            {
                controller: 'CustomersController',
                templateUrl: 'app/partials/customers.html'
            })
        //Define a route that has a route parameter in it (:customerID)
        .when('/customerorders/:customerID',
            {
                controller: 'CustomerOrdersController',
                templateUrl: 'app/partials/customerOrders.html'
            })
        .otherwise({ redirectTo: '/login' });
});
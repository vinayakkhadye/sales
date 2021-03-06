﻿/*#######################################################################
  
  Vinayak Khadye

  Normally like the break AngularJS controllers into separate files.
  Kept them together here since they're small and it's easier to look through them.
  example. 

  #######################################################################*/


app.controller('LoginController', function ($scope, $rootScope, $location, loginService) {

    //I like to have an init() for controllers that need to perform some initialization. Keeps things in
    //one place...not required though especially in the simple example below
    $scope.login = function() {
		
		var userName 	= $scope.userName;
		var password	= $scope.password;
		$scope.isUser	= "";
		
		loginService.login(userName,password).then(function(response)
		{
			$scope.message	= false;
			$scope.isUser	= response.data;
			
			if($scope.isUser=='1')
			{
				$rootScope.userToken = $scope.userName;
				$location.path( "/orders" );
			}
			else
			{
				$scope.message = "wrong username or password";
			}
		});
    }
});

app.controller('OrdersController', function ($scope,$rootScope, $location, ordersService) {
	init();
	function init()
	{
		if($rootScope.userToken ==false)
		{
			$location.path( "/login" );
		}
		$scope.orders = [];
		$scope.old_delivery_date = "";
		
		ordersService.getOrders().then(function(response)
		{
			$scope.orders 		= response.data;	
			$scope.orderByField = 'o.id';
			$scope.reverseSort  = false;
			$scope.readonly		= true;
		});

		$scope.enableDeliveryDate	= function(obj,date)
		{
			obj.readonly			= false;
			$scope.old_delivery_date= date;
		};
		
		$scope.disableDeliveryDate	= function(obj,new_delivery_date,id)
		{
			obj.readonly	= true;
			var date		= new Date(new_delivery_date);		
			if(angular.isDate(date) && $scope.old_delivery_date != new_delivery_date && new_delivery_date!="")
			{
				ordersService.updateDispatchDate(new_delivery_date,id).then(function(response)
				{
					console.log(response);
				});
				//console.log(id);	
			}
		};
	}
});

app.controller('ChartsController', function ($scope,$rootScope, $routeParams,$location, chartsService) {
	init();
	function init() {
		if($rootScope.userToken ==false)
		{
			$location.path( "/login" );
		}
		
		if ($routeParams.chartName == 'getOrdersChartForMonth')
		{
			chartsService.getOrdersChartForMonth().then(function(response) {
				var currentDate 	= new Date(), y = currentDate.getFullYear(), m = currentDate.getMonth();
				var noOfDays 		= new Date(y, m , 0).getDate();
				$scope.labels 		= [];
				$scope.monthDays 	= [];
				$scope.monthSales 	= [];
				$scope.dbDaysSale 	= [];
				$scope.series 		= ['Products Sold'];
				$scope.label_head 	= 'Orders Chart (Previous Month)';
				
				var day = false;
				
				$scope.ordersbydate = response.data;
					
				for(val in $scope.ordersbydate)
				{
					day = new Date($scope.ordersbydate[val].orders.order_date);
					day = day.toLocaleDateString("en-US")
					$scope.dbDaysSale.push([day,$scope.ordersbydate[val][0].total_orders]);
				}
				for(i=1;i<=noOfDays;i++)
				{
					day = new Date(y, m-1, i);
					$scope.monthDays.push(day.toLocaleDateString("en-US"));
					$scope.labels.push(day.toLocaleDateString("en-US"));	
				}
				
				var matchFound	= false;
				for (val in $scope.monthDays)
				{
					matchFound	= false;
					for (val1 in $scope.dbDaysSale)
					{
						if( $scope.monthDays[val] == $scope.dbDaysSale[val1][0] )
						{
							$scope.monthSales.push($scope.dbDaysSale[val1][1]);
							matchFound = true;
						}
					}
					if(matchFound	== false)
					{
						$scope.monthSales.push(0);
					}
				}
				$scope.data = [$scope.monthSales];
			});			
			
		}
		else if ($routeParams.chartName == 'getProductsSaleChartForMonth')
		{
			
			chartsService.getProductsSaleChartForMonth().then(function(response) {
				var currentDate 	= new Date(), y = currentDate.getFullYear(), m = currentDate.getMonth();
				var noOfDays 		= new Date(y, m , 0).getDate();
				$scope.labels 		= [];
				$scope.monthDays 	= [];
				$scope.monthSales 	= [];
				$scope.productSale 	= [];
				$scope.series 		= ['Sales'];
				$scope.label_head 	= 'product sales chart (previous month)';
					
				$scope.productsbyname = response.data;
				for(val in $scope.productsbyname)
				{
					product 		= $scope.productsbyname[val].p.name;
					product_sale	= $scope.productsbyname[val][0].total_product_sale;
					console.log(product_sale);
					$scope.labels.push(product);
					$scope.productSale.push(product_sale);
				}
				$scope.data = [$scope.productSale];
			});
		}
		else
		{
			$location.path( "/orders" );
		}
	}
	
});

//This controller retrieves data from the customersService and associates it with the $scope
//The $scope is ultimately bound to the customers view
app.controller('CustomersController', function ($scope,$rootScope, customersService) {

    //I like to have an init() for controllers that need to perform some initialization. Keeps things in
    //one place...not required though especially in the simple example below
    init();

    function init() {
        $scope.customers = customersService.getCustomers();
    }

    $scope.insertCustomer = function () {
		
        var firstName = $scope.newCustomer.firstName;
        var lastName = $scope.newCustomer.lastName;
        var city = $scope.newCustomer.city;
        customersService.insertCustomer(firstName, lastName, city);
        $scope.newCustomer.firstName = '';
        $scope.newCustomer.lastName = '';
        $scope.newCustomer.city = '';
    };

    $scope.deleteCustomer = function (id) {
        customersService.deleteCustomer(id);
    };
});

//This controller retrieves data from the customersService and associates it with the $scope
//The $scope is bound to the order view
app.controller('CustomerOrdersController', function ($scope,$rootScope, $routeParams, customersService) {
    $scope.customer = {};
    $scope.ordersTotal = 0.00;

    //I like to have an init() for controllers that need to perform some initialization. Keeps things in
    //one place...not required though especially in the simple example below
    init();

    function init() {
        //Grab customerID off of the route        
        var customerID = ($routeParams.customerID) ? parseInt($routeParams.customerID) : 0;
        if (customerID > 0) {
            $scope.customer = customersService.getCustomer(customerID);
        }
    }

});


app.controller('NavbarController', function ($scope,$rootScope, $location) {
    $scope.getClass = function (path) {
        if ($location.path().substr(0, path.length) == path) {
            return true
        } else {
            return false;
        }
    }
});

//This controller is a child controller that will inherit functionality from a parent
//It's used to track the orderby parameter and ordersTotal for a customer. Put it here rather than duplicating 
//setOrder and orderby across multiple controllers.
app.controller('OrderChildController', function ($scope,$rootScope) {
    $scope.orderby = 'product';
    $scope.reverse = false;
    $scope.ordersTotal = 0.00;

    init();

    function init() {
        //Calculate grand total
        //Handled at this level so we don't duplicate it across parent controllers
        if ($scope.customer && $scope.customer.orders) {
            var total = 0.00;
            for (var i = 0; i < $scope.customer.orders.length; i++) {
                var order = $scope.customer.orders[i];
                total += order.orderTotal;
            }
            $scope.ordersTotal = total;
        }
    }

    $scope.setOrder = function (orderby) {
        if (orderby === $scope.orderby)
        {
            $scope.reverse = !$scope.reverse;
        }
        $scope.orderby = orderby;
    };

});

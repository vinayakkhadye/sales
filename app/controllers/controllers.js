/*#######################################################################
  
  Vinayak Khadye

  Normally like the break AngularJS controllers into separate files.
  Kept them together here since they're small and it's easier to look through them.
  example. 

  #######################################################################*/


app.controller('LoginController', function ($scope, $location, loginService) {

    //I like to have an init() for controllers that need to perform some initialization. Keeps things in
    //one place...not required though especially in the simple example below
    $scope.login = function() {
        $scope.login = loginService.login();
		
		if($scope.login)
		{
			$location.path( "/orders" );
		}
    }
});

app.controller('OrdersController', function ($scope, $location, ordersService) {
	$scope.orders = [];
	$scope.old_delivery_date = "";
    //I like to have an init() for controllers that need to perform some initialization. Keeps things in
    //one place...not required though especially in the simple example below
    init();

    function init() {
		$scope.orderByField = 'o.id';
		$scope.reverseSort  = false;
        $scope.orders 		= ordersService.getOrders();
		$scope.readonly		= true;
    }
	
	$scope.enableDeliveryDate	= function(obj,date){
		obj.readonly			= false;
		$scope.old_delivery_date= date;
	};
	
	$scope.disableDeliveryDate	= function(obj,new_delivery_date,id){
		obj.readonly			= true;
		var date	=	new Date(new_delivery_date);		
		if(angular.isDate(date) && $scope.old_delivery_date != new_delivery_date){
			//console.log(id);	
		}else
		{
			//console.log($scope.old_delivery_date + ' '+  new_delivery_date);	
			//obj.value = $scope.old_delivery_date;
		}
	};
});

app.controller('ChartsController', function ($scope, $routeParams,$location, chartsService) {
	init();
	function init() {
		if ($routeParams.chartName == 'getOrdersChartForMonth'){
			
		  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
		  $scope.series = ['Series A', 'Series B'];
		  $scope.data = [
			[65, 59, 80, 81, 56, 55, 40],
			[28, 48, 40, 19, 86, 27, 90]
		  ];
		  $scope.onClick = function (points, evt) {
			console.log(points, evt);
		  };
		  /*$scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];*/
		
		  $scope.options = {
			scales: {
			  yAxes: [
				{
				  id: 'y-axis-1',
				  type: 'linear',
				  display: true,
				  position: 'left'
				},
				{
				  id: 'y-axis-2',
				  type: 'linear',
				  display: true,
				  position: 'right'
				}
			  ]
			}
		  };


			$scope.ordersbydate = chartsService.getOrdersChartForMonth();	
		}else if ($routeParams.chartName == 'getProductsSaleChartForMonth'){
			$scope.ordersbydate = chartsService.getProductsSaleChartForMonth();	
		}else{
			$location.path( "/orders" );
		}
	}
	
});

//This controller retrieves data from the customersService and associates it with the $scope
//The $scope is ultimately bound to the customers view
app.controller('CustomersController', function ($scope, customersService) {

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
app.controller('CustomerOrdersController', function ($scope, $routeParams, customersService) {
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


app.controller('NavbarController', function ($scope, $location) {
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
app.controller('OrderChildController', function ($scope) {
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

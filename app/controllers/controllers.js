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
		
		if ($routeParams.chartName == 'getOrdersChartForMonth')
		{
			var currentDate 	= new Date(), y = currentDate.getFullYear(), m = currentDate.getMonth();
			var noOfDays 		= new Date(y, m , 0).getDate();
			$scope.labels 		= [];
			$scope.monthDays 	= [];
			$scope.monthSales 	= [];
			$scope.dbDaysSale 	= [];
			$scope.series 		= ['Products Sold'];
			$scope.label_head 	= 'Orders Chart (Previous Month)';
			
			var day = false;
			
			$scope.ordersbydate = chartsService.getOrdersChartForMonth();	
			
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
			console.log($scope.labels);
			console.log($scope.data);
			
		}
		else if ($routeParams.chartName == 'getProductsSaleChartForMonth')
		{
			var currentDate 	= new Date(), y = currentDate.getFullYear(), m = currentDate.getMonth();
			var noOfDays 		= new Date(y, m , 0).getDate();
			$scope.labels 		= [];
			$scope.monthDays 	= [];
			$scope.monthSales 	= [];
			$scope.productSale 	= [];
			$scope.series 		= ['Sales'];
			$scope.label_head 	= 'product sales chart (previous month)';
			
			
			
			$scope.productsbyname = chartsService.getProductsSaleChartForMonth();	
			
			
			for(val in $scope.productsbyname)
			{
				product 		= $scope.productsbyname[val].p.name;
				product_sale	= $scope.productsbyname[val][0].total_product_sale;
				console.log(product_sale);
				$scope.labels.push(product);
				$scope.productSale.push(product_sale);
			}
			$scope.data = [$scope.productSale];
							
		}
		else
		{
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

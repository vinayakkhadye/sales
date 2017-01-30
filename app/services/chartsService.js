//This handles retrieving data and is used by controllers. 3 options (server, factory, provider) with 
//each doing the same thing just structuring the functions/data differently.
app.service('chartsService', function ($http,$q) {
									   
    this.getOrdersChartForMonth = function () {
		var dfd = $q.defer();
        $http({
            method: 'GET',
            url: 'http://52.86.237.61/cakeangularjs/order/getOrdersChartForMonth/previous',
            //params: params,
            //cache: Schools.schoolCache,
        }).success(function(response) {
            //dfd.resolve(response.schools || response.school);
			console.log(response);
        });
		//return dfd.promise;
		
        return	[{"orders":{"order_date":"2016-12-14"},"0":{"total_orders":"2"}},{"orders":{"order_date":"2016-12-15"},"0":{"total_orders":"1"}},{"orders":{"order_date":"2016-12-16"},"0":{"total_orders":"1"}},{"orders":{"order_date":"2016-12-20"},"0":{"total_orders":"1"}}];
    };
	
    this.getProductsSaleChartForMonth = function () {
        return [{"p":{"name":"tooth brush"},"0":{"total_product_sale":"7"}},{"p":{"name":"shampoo"},"0":{"total_product_sale":"3"}},{"p":{"name":"headphones"},"0":{"total_product_sale":"1"}}];
    };
});
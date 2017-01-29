//This handles retrieving data and is used by controllers. 3 options (server, factory, provider) with 
//each doing the same thing just structuring the functions/data differently.
app.service('chartsService', function () {
									   
    this.getOrdersChartForMonth = function () {
		
        return	[
				{
					"orders":{"order_date":"2016-12-15"},
					"0":{"total_orders":"10"}
				}
				];
    };
	
    this.getProductsSaleChartForMonth = function () {
        return [{"p":{"name":"tooth brush"},"0":{"total_product_sale":"1"}}];
    };
});
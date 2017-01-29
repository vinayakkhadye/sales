//This handles retrieving data and is used by controllers. 3 options (server, factory, provider) with 
//each doing the same thing just structuring the functions/data differently.
app.service('ordersService', function () {
									   
    this.getOrders = function () {
        return orders;
    };

    var orders =	[
					{
						"o":
						  	{
								"id":"2",
								"order_date":"2017-01-25",
								"order_time":"13:30:45",
								"deliver_date":"2017-01-28",
								"order_price":"25.00",
								"order_quantity":"1"
							},
						"p":
							{
								"product_name":"tooth brush"
							},
						"c":
							{
								"customer_name":"aniket choudhari"
							}
					},
					{
						"o":
						  	{
								"id":"3",
								"order_date":"2017-01-25",
								"order_time":"13:30:45",
								"deliver_date":"2017-01-28",
								"order_price":"25.00",
								"order_quantity":"1"
							},
						"p":
							{
								"product_name":"santoor soap"
							},
						"c":
							{
								"customer_name":"shalaka khadye"
							}
					}					
					];
});
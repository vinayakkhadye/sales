//This handles retrieving data and is used by controllers. 3 options (server, factory, provider) with 
//each doing the same thing just structuring the functions/data differently.
app.service('ordersService', function ($http) {
									   
    this.getOrders = function () {
        return  $http({
            method: 'GET',
            //url: 'http://localhost/cakeangularjs/order',
			url: 'http://52.86.237.61/cakeangularjs/order',
        }).then(function(response) {
            return response;
        }).catch(function(error) {
			return error;
        });
		
        return orders;
    };

	this.updateDispatchDate = function(date,id) {
        return  $http({
            method: 'GET',
            //url: 'http://localhost/cakeangularjs/order/updateDispatchDate/'+date+'/'+id,
			url: 'http://52.86.237.61/cakeangularjs/order/updateDispatchDate/'+date+'/'+id,
        }).then(function(response) {
            return response;
        }).catch(function(error) {
			return error;
        });
	}    
});
//This handles retrieving data and is used by controllers. 3 options (server, factory, provider) with 
//each doing the same thing just structuring the functions/data differently.
app.service('loginService', function ($http) {
    this.getUser = function () {
        return users;
    };

    this.login = function (userName,password) {
        return  $http({
            method: 'GET',
            //url: 'http://localhost/cakeangularjs/login/index/'+userName+'/'+password,
			url: 'http://52.86.237.61/cakeangularjs/login/index/'+userName+'/'+password,
        }).then(function(response) {
			//console.log(response);
            return response;
        }).catch(function(error) {
			return false;
        });
		
    };

    var users = [	
        {
            id: 1, name: 'vinayak khadye', gender: 'M', address: 'Dombivli', phone_number: '9819364453',user_id:'vinayak249',password:'9d5e4791ecc9bfaaef767413cba4de90'
        }
    ];

});
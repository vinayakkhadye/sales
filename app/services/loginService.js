//This handles retrieving data and is used by controllers. 3 options (server, factory, provider) with 
//each doing the same thing just structuring the functions/data differently.
app.service('loginService', function () {
    this.getUser = function () {
        return users;
    };

    this.login = function (id) {
        return true;
    };

    var users = [	
        {
            id: 1, name: 'vinayak khadye', gender: 'M', address: 'Dombivli', phone_number: '9819364453',user_id:'vinayak249',password:'9d5e4791ecc9bfaaef767413cba4de90'
        }
    ];

});
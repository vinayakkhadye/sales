var app = angular.module('salesApp',[]);

 app.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'login.html',
                controller  : 'LoginController'
            });
    });


app.controller('LoginController',function($scope)
    {
        $scope.userName = "vinayak";
    }
)
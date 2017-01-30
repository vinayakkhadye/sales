app.factory('myInterceptor', ['$log', function($log) {  
    $log.debug('$log is here to show you that this is a regular factory with injection');

    var myInterceptor = {
        
    };

    return myInterceptor;
}]);
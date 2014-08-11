AngularJS-Interceptor
=====================

This repository for containing **Angular Interceptor** DEMO.

When we are working on **AngularJS** then **AngularJS**'s core service **$http** helps us to communicate with remote HTTP Server via ajax request. Lets first see a small demo of **$http** service then will understand the concept of **interceptor**.

```javascript
// $http service injecting to Controller via DI.
interceptorModule.controller("InterceptorController", ["$http", function ($http) {
    // Defining successHandler for success status.
    function successHandler(data, status, headers, config) {
        // This will called asynchronously when response will come with success status.
    }

    // Defining errorHandler for error status.
    function errorHandler(data, status, headers, config) {
        // This will called asynchronously when response will come with error status.
    }

    // Hitting get request on someUrl and providing successHandler in success function
    // and errorHandler in error function. successHandler will call when response come 
    // with success status and errorHandler will call when response come with error status.
    $http({method: 'GET', url: '/someUrl'})
        .success(successHandler)
        .error(errorHandler);
}]);
```

Many a times we load data via ajax request. And for authenticating our request on server, we need to pass token/jsessionid with each request. For passing the token/jsessionid with every request, we manually add token/jsessionid to each ajax request before hitting. e.g.

```javascript
$http({method: 'GET', url: '/someUrl1', headers: {Authorization: 'token'}})
    .success(function (data, status, headers, config) {
    })
    .error(function (data, status, headers, config) {
    });
$http({method: 'GET', url: '/someUrl2', headers: {Authorization: 'token'}})
    .success(function (data, status, headers, config) {
    })
    .error(function (data, status, headers, config) {
    });
```

And suppose response is coming into XML/JSON format, and we have to parse each and every response and if we get unauthorized response error then we have to redirect/open to login page. Then might be you think to write a custom **service** e.g.

```javascript
interceptorModule.service('CustomRequestService', ["$http", function ($http) {
    this.sendRequest = function (method, url, successHandler, errorHandler) {
        $http({method: method, url: url, headers: {Authorization: 'token'}})
            .success(function (data, status, headers, config) {
                // parse response data and pass to successHandler
                successHandler(JSON.parse(data), status, headers, config);
            })
            .error(function (data, status, headers, config) {
                // if unauthorized error returned then redirect here. else call errorHandler
                errorHandler(JSON.parse(data), status, headers, config);
            });
    };
}]);
```

Above way is nice to achieve the interceptor behavior. But few things, which I don't like about this. There can be many, but I am listing down few of them, e.g.
- We have to consume CustomRequestService in all the places instead of **$http service**. 
- Suppose my parsing logic takes 4 steps so I have to put all 4 steps into this single place.
- We can not make independent module, which want to communicate with **$http service**. etc.

**AngularJS** provide us functionality to write **interceptors**. Lets first try small interceptor:

**angular-interceptor.html**
```html
<!DOCTYPE html>
<html ng-app="interceptorDemo">
<head>
    <title>Angular Interceptor</title>
    <!-- Require AngularJS -->
    <script type="application/javascript" src="js/angular.min.js"></script>
    <!-- Require our custom interceptorJS -->
    <script type="application/javascript" src="js/interceptor.js"></script>
</head>
<body ng-controller="InterceptorController as interceptorCtrl">
    <h1 ng-bind="interceptorCtrl.demo"></h1>
</body>
</html>
```

**interceptor.js**
```javascript
(function () {
    var interceptorModule = angular.module("interceptorDemo", []);
    interceptorModule.controller("InterceptorController", ["$http", function ($http) {
        console.log("Controller executing.");
        this.demo = "Interceptor Demo";
        $http.get("README.md")
            .success(function () {
                console.log("Success returned");
            })
    }]);
    // Defining an interceptor with name interceptor1
    interceptorModule.factory('interceptor1', [function () {
        console.log("Interceptor1 initializing.");
        // defining interceptor configuration.
        var interceptor = {
            // defining a method, which will call before sending the request.
            request: function (config) {
                // attaching token/jsessionid code will come here.
                console.log("Executing before request of interceptor1");
                return config;
            },
            // defining a method, which will call after response received.
            response: function (response) {
                // parsing the response logic will come here.
                console.log("Executing after response of interceptor1");
                return response;
            }
        };
        // returning interceptor configuration.
        return interceptor;
    }]);
    // Defining an interceptor with name interceptor2
    interceptorModule.service('interceptor2', ["$q", function ($q) {
        // defining interceptor configuration.
        console.log("Interceptor2 initializing.");
        // defining a method, which should will call before sending the request.
        this.request = function (config) {
            console.log("Executing before request of interceptor2");
            // If you want to do some async work before sending the request then use $q service and return promise.
            var deferred = $q.defer();
            setTimeout(function () {
                console.log("Executed before request of interceptor2");
                deferred.resolve(config);
            }, 100);
            return deferred.promise;
        };
        // defining a method, which will call after response received.
        this.response = function (respnse) {
            console.log("Executing after response of interceptor2");
            // If you want to do some async work after response received then use $q service and return promise.
            var deferred = $q.defer();
            setTimeout(function () {
                console.log("Executed after response of interceptor2");
                deferred.resolve(respnse);
            }, 100);
            return deferred.promise;
        }
    }]);
    // Adding interceptor1 and interceptor2 to interceptor list.
    interceptorModule.config(['$httpProvider', function ($httpProvider) {
        // To add our custom interceptor we have to use $httpProvider, And push our interceptor to interceptors.
        $httpProvider.interceptors.push('interceptor1');
        $httpProvider.interceptors.push('interceptor2');
    }]);
})();
```



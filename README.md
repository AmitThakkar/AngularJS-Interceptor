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



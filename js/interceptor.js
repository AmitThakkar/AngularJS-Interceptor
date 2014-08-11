/**
 * Created by Amit Thakkar on 20/7/14.
 */

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
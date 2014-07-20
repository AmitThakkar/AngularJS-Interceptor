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
    interceptorModule.factory('interceptor1', ["$q", function ($q) {
        console.log("Interceptor1 initializing.");
        var interceptor = {
            request: function (config) {
                console.log("Executing before request of interceptor1");
                var deferred = $q.defer();
                setTimeout(function () {
                    console.log("Executed before request of interceptor1");
                    deferred.resolve(config);
                }, 100);
                return deferred.promise;
            },
            response: function (response) {
                console.log("Executing after response of interceptor1");
                var deferred = $q.defer();
                setTimeout(function () {
                    console.log("Executed after response of interceptor1");
                    deferred.resolve(response);
                }, 100);
                return deferred.promise;
            }
        };
        return interceptor;
    }]);
    interceptorModule.service('interceptor2', ["$q", function ($q) {
        console.log("Interceptor2 initializing.");
        this.request = function (config) {
            console.log("Executing before request of interceptor2");
            var deferred = $q.defer();
            setTimeout(function () {
                console.log("Executed before request of interceptor2");
                deferred.resolve(config);
            }, 100);
            return deferred.promise;
        };
        this.response = function (respnse) {
            console.log("Executing after response of interceptor2");
            var deferred = $q.defer();
            setTimeout(function () {
                console.log("Executed after response of interceptor2");
                deferred.resolve(respnse);
            }, 100);
            return deferred.promise;
        }
    }]);
    interceptorModule.config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('interceptor1');
        $httpProvider.interceptors.push('interceptor2');
    }]);
})();
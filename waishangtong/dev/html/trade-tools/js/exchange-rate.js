/* !
 *  用于客户详情
 */
require([ 'common' ], function () {
    require([  'maintab', 'blockUI', 'jqform', 'ztree', 'bootstrap','angular','datetimepickerCN'], function (maintab) {
        maintab.init();
        var app=angular.module("All",[]);
       app.config(['$httpProvider', function($httpProvider) {
         $httpProvider.defaults.headers.post["Content-Type"] =
         "application/x-www-form-urlencoded";
         $httpProvider.defaults.
         transformRequest.unshift(function(data,
         headersGetter) {
         var key, result = [];
         for (key in data) {
         if (data.hasOwnProperty(key)) {
         result.push(encodeURIComponent(key) + "="
         + encodeURIComponent(data[key]));
         }
         }
         return result.join("&");
         });
         }]);
        app.controller("exchangeRateList",['$scope','$http',function($scope,$http){
            $scope.listname="test";

        }])
        angular.bootstrap( document.body,['All']);




    });
});
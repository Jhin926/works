require([ 'common' ], function () {
    require(['maintab','angular', 'ZeroClipboard', 'ueditorLang', 'blockUI', 'jqform', 'ztree'], function (maintab, ZeroClipboard) {
        maintab.init();
        var app=angular.module("All",[]);
            app.controller("exchangeRateList",["$scope","$http",function($scope,$http){
                $scope.pageObj = {
                    homepage: 1,
                    currentPage: 1,
                    lastpage: null,
                    pageSize: 20,
                    conditions: [],
                    keyword: ''
                };
                $scope.exchageMoney="";
                $scope.rateList={};
                $scope.infoList=[];
                $scope.exchangeList={};
                $scope.results=[];
                $scope.left_rate="";
                $scope.right_rate="";
                $scope.results1="";
                $scope.results2="";
                $scope.exchange = function(){
                    $(".results").html("");
                    $(".left_results").html("");
                    $(".right_results").html("");
                    var holding=$(".left-select option:selected").text();
                    var exchangeMoney=$(".right-select option:selected").text();
                    holding=holding.substring(0,holding.length-3);
                    exchangeMoney=exchangeMoney.substring(0,exchangeMoney.length-3);
                    var holdval=$(".left-select option:selected").val();
                    var exchangeval=$(".right-select option:selected").val();
                    $(".left-select option").attr("selected",false);
                    $(".left-select").find("option[value='"+exchangeval+"']").prop("selected",true);
                    $(".right-select option").attr("selected",false);
                    $(".right-select").find("option[value='"+holdval+"']").prop("selected",true);
                    $(".holding-money").html(exchangeMoney);
                    $(".exchange-money").html(holding);
                    $(".left_rate").html(exchangeMoney);
                    $(".right_rate").html(holding);
                }
                $scope.show_right=function(e){
                    $.EventFn(e);
                    $(".page-left").animate({marginLeft:"-148px"});
                    $(".page-right").css({width:"100%",borderLeft:"none"});
                    $(".r_titles").show();
                }
                $scope.show_left = function(e){
                    $.EventFn(e);
                    $(".page-left").animate({marginLeft:"0px"});
                    $(".page-right").css({width:"88%",borderLeft:"10px solid #E6EAED"});
                    $(".r_titles").hide();
                }
                $scope.compute = function(){
                    var money=$scope.exchageMoney,
                        holding=$(".left-select option:selected").text(),
                        exchange=$(".right-select option:selected").text();
                    if(money==""){
                        $.Alert("请输入兑换金额");
                        return
                    }
                    holding=holding.substring(holding.length-3);
                    exchange=exchange.substring(exchange.length-3);
                    $(".exchange-rate-con").css("height","164px");
                    $(".exchange-rate-bottom").show();
                    $scope.data={
                        from : holding,
                        to : exchange,
                        money : money
                    };
                    search();
                };
                function search (){
                    $http({
                        method:"post",
                        url:Base.sitUrl + '/api/exchange/v1/convert',
                        params:{
                            data:JSON.stringify($scope.data)
                        }
                    }).success(function(res){
                        if(!res.success){
                            $.Alert(res.message);
                            return
                        }
                        $scope.results=res.data;
                        $scope.left_rate=$scope.results.rate;
                        $scope.results1=$scope.results.rate;
                        var resting=$scope.exchageMoney/$scope.results.toMoney;
                        resting=resting.toFixed(6);
                        $scope.results2=resting;
                        if($scope.results1>0){
                            $(".left_results").html($scope.results2);
                            $(".right_results").html($scope.results1);
                        }
                            $(".left_results").html($scope.results1);
                            $(".right_results").html($scope.results2);
                    })
                }
                //汇率列表
                function rateList(){
                $http({
                    method:"get",
                    url: Base.sitUrl + '/api/exchange/v1/query',
                    params:{
                        data:JSON.stringify($scope.pageObj)
                    }
                }).success(function(res){
                    if(!res.success){
                        $.Alert(res.message);
                        return
                    }
                    $scope.rateList=res.data.results;
                    var total = res.data.totalItem,
                        all = Math.ceil(res.data.totalItem/res.data.pageSize);
                    $.Page({
                        total: total,
                        _class: '.page',
                        nowNum: $scope.pageObj.currentPage,
                        allNum: all,
                        callback: function (now, all) {
                            $scope.pageObj.currentPage = now;
                            rateList();
                        }
                    });
                })
                }
                rateList();
                //下拉菜单
                $http({
                    method:"get",
                    url: Base.sitUrl + '/api/exchange/v1/list',
                }).success(function(res){
                    if(!res.success){
                        $.Alert(res.message);
                        return
                    }
                    $scope.exchangeList=res.data;
                })
            }])
            angular.bootstrap(document.body,["All"]);
    });
});
/**
 * Created by zhanggt at 2016/10/8 0008.
 */
require([ 'common' ], function () {
    require(['maintab', 'angular','angularAnimate', 'blockUI','datetimepickerCN'], function (maintab) {
        maintab.init();
        if (jQuery().datetimepicker) {
            $('.datetime-picker').datetimepicker({
                format: "yyyy-mm-dd hh:mm",
                language: 'zh-CN',
                todayBtn: 1,
                autoclose: 1,
                bootcssVer: 3//因为html里的写法不规范，所以必须要加上这个时间插件才能正常显示
            });
        }
        var app=angular.module("approvalListModule",[]);
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
        app.controller("approvalList",['$scope','$http',function($scope,$http){
            $scope.isMyApproval=false;
            $scope.showToolbar = false;
            $scope.checkedItem = [];
            $scope.approvalList = [];
            $scope.statusList = {};
            $scope.checkedAll = false;
            $scope.approvalListRequestParams ={
                "initiatorType" : 2,     //审批发起人
                "subject" : "",   //标题
                "bizType" : 0,            //审批业务类型 1-报价 2-PI 3-订单 4-Email
                "status" : 0,             //审批状态（1-待审批 2-通过 3-不通过）
                "approver" : 0,      //审批人
                "startDate" : "",//开始日期
                "endDate" : "",   //结束日期
                'currentPage':1,
                'pageSize':20
            };
            $scope.principalList=[];
            $scope.approvalItem=[];
            loadApprovalList();
            $scope.switchApprovalList = function(type){
                $scope.isMyApproval = type == 2;
                if(type == 2){
                    $(".positon-change").html("审批人");
                    $(".approval-person").html("审核人");
                    $(".approval-person").attr("data-id",2);
                    $(".m_batch1").attr("data-id",2);
                }else{
                    $(".positon-change").html("发起人");
                    $(".approval-person").html("发起人");
                    $(".approval-person").attr("data-id",1)
                    $(".m_batch1").attr("data-id",1)
                }
                $scope.approvalListRequestParams.approvalType=type;
                loadApprovalList();
            }
            function loadApprovalList(){
                $.BlockUI();
                var params = {
                    "data": $scope.approvalListRequestParams
                }
                $http({
                    method:'get',
                    url: Base.sitUrl + '/api/approval/v1/list',
                    params:params
                }).success(function(res) {
                    $.UnblockUI();
                    if (!res.success) {
                        $.unLogin(res);
                        return
                    }
                    var data = res.data;
                    if(data.results==''){
                        $(".trNone").show();
                    }else{
                        $(".trNone").hide();
                    }
                    var total = data.totalItem;
                    var all = Math.ceil(total / $scope.approvalListRequestParams.pageSize);
                    $.Page({
                        total: total,
                        _class: '.page',
                        nowNum: data.currentPage,
                        allNum: all,
                        callback: function (now, all) {
                            $scope.approvalListRequestParams.currentPage = now;
                            loadApprovalList();
                        }
                    });
                    $scope.approvalItem=$scope.approvalList = formateData(data.results);
                });
            }
            //获取审核人列表
            $http({
                method:"get",
                url:Base.sitUrl+'/api/org/v1/org/principal/list'
            }).success(function(res){
                if(!res.success){
                    $.Alert(res.message);
                    return
                }
                $scope.principalList= res.data;
            });

            function formateData(data){
                var statusDict = {"k_1": "待审批", "k_2": "通过", "k_3": "不通过"};
                //var typeDict = {"k_0": "其他", "k_1": "报价单", "k_2": "PI", "k_3": "订单"};
                var typeDict = {"k_1":"报价","k_2": "PI", "k_3": "订单"};
                for (var i = 0; i < data.length; i++) {
                    if (data[i].subject.length > 50) {
                        data[i].shortSubject = data[i].subject.substring(0, 50) + '...';
                    }else{
                        data[i].shortSubject = data[i].subject;
                    }
                    data[i].statusText = statusDict["k_"+data[i].status];
                    data[i].bizTypeText = typeDict["k_"+data[i].bizType];
                }
                return data;
            };
            //排序
            $scope.approvalSort = function(approvalItem){
                var $i=$(".approval-sort p");
                if ($i.hasClass('s-orderList')) {
                    $i.removeClass('s-orderList').addClass('s-reorderList');
                    approvalItem.sort(function(a,b){
                        var bTime = parseInt((b.updateTime).replace(/-|:| /g, ''));
                        var aTime = parseInt((a.updateTime).replace(/-|:| /g, ''));
                        return aTime - bTime;
                    })
                } else {
                    $i.removeClass('s-reorderList').addClass('s-orderList');
                    approvalItem.sort(function(a,b){
                        var bTime = parseInt((b.updateTime).replace(/-|:| /g, ''));
                        var aTime = parseInt((a.updateTime).replace(/-|:| /g, ''));
                        return bTime - aTime;
                    })
                }
            }
            $scope.checkAll = function($event) {
                $event.stopPropagation();
                var $this = $($event.target);
                $scope.checkedAll = $this.prop('checked');
            };
            $scope.checkItem = function(item,$event){
                var $this = $($event.target);
                if($this.prop('checked')==true){
                    $this.parent().addClass('checked');
                    if($scope.checkedItem.indexOf(item.id)<0){
                        $scope.checkedItem.push(item.id);
                    }
                }else{
                    $this.parent().removeClass('checked');
                    if($scope.checkedItem.indexOf(_file)>=0){
                        $scope.checkedItem.splice($scope.checkedItem.indexOf(item.id),1);
                    }
                }
            };
            //筛选
            $scope.approvalSearch = function(){
                var type=$("#approvalType option:selected").val(),
                    status=$("#approvalStatus option:selected").val(),
                    through=$("#approvalThrough option:selected").val(),
                    startDate=$("input[name=start-date]").val(),
                    endDate=$("input[name=end-date]").val();
                    through=through.substring(7);
                var $id=$(".approval-person").attr("data-id");
            $scope.data={
                    "initiator" : '',     //审批发起人
                    "subject" : '',   //标题
                    "bizType" : type,            //审批业务类型 1-报价 2-PI 3-订单 4-Email
                    "status" : status,              //审批状态（1-待审批 2-通过 3-不通过）
                    "approver" : '',       //审批人
                    "startDate" : startDate,//开始日期
                    "endDate" : endDate,  //结束日期
                    "approvalType" : 1 ,        //1-由我审批 2-我的审批
                    'currentPage':1,
                    'pageSize':20
                };
                if($id==1){
                    $scope.data.initiator=through;
                    $scope.data.approvalType=1;
                    $scope.data.approver="";
                }else{
                    $scope.data.initiator='';
                    $scope.data.approver=through;
                    $scope.data.approvalType=2;
                }
                $http({
                    method:"post",
                    url:Base.sitUrl+'/api/approval/v1/list',
                    data:{data:JSON.stringify($scope.data)}
                }).success(function(res){
                    if(res.data.results==''){
                        $(".trNone").show();
                    }else{
                        $(".trNone").hide();
                    }
                    $scope.approvalListRequestParams =$scope.data;
                    loadApprovalList();
                })
            };
            //搜索框搜索
            $("#inputQuick").on('keyup', function () {
                var keyword = $("#inputQuick").val();
                $scope.approvalListRequestParams.subject=keyword;
                if (event.keyCode == 13) {
                    loadApprovalList();
                }
            });
            //点击查看详情
            $scope.getDetail = function(approvalItem){
                var $id=approvalItem.id;
                var $bizId=approvalItem.bizId;
                var $type=$(".m_batch1").attr("data-id");
                if (!isNaN($id)) {
                maintab.showTab(Base.url + '/html/approval/view/approval-detail.html?id='+$id+'&type='+$type+'&bizId='+$bizId+'&v=' + window.ver, '审批详情');
                }
             }
        }]);
        angular.bootstrap( document.body , ['approvalListModule']);

    });
});
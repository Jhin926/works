require([ 'common' ], function () {
    require(['maintab', 'angular','angularAnimate', 'datetimepickerCN'], function (maintab) {
        maintab.init();
        if (jQuery().datetimepicker) {
            $('.datetime-picker').datetimepicker({
                format: "yyyy-mm-dd hh:ii",
                language: 'zh-CN',
                todayBtn: 1,
                autoclose: 1,
                bootcssVer: 3//因为html里的写法不规范，所以必须要加上这个时间插件才能正常显示
            });
        }
        var pIdx = Number($.GetQueryString('pIdx')),
            type = $.GetQueryString('type'),
            emailName = $.GetQueryString('emailName'),
            custId = $.GetQueryString('custId'),
            contId = $.GetQueryString('contId'),
            contName = $.GetQueryString('contName'),
            taskId = $.GetQueryString('id');

        var app=angular.module("All",[]);
        app.config(['$httpProvider', function($httpProvider) {
            $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
            $httpProvider.defaults.transformRequest.unshift(function(data, headersGetter) {
                var key, result = [];
                for (key in data) {
                    if (data.hasOwnProperty(key)) {
                        result.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
                    }
                }
                return result.join("&");
            });
        }]);
        app.controller('task',['$scope','$http',function($scope,$http){
            $scope.pageObj = {
                homepage: 1,
                currentPage: 1,
                lastpage: null,
                pageSize: 10,
                conditions: [],
                keyword: ''
            };
            $scope.chargerList = [];
            $scope.customerList = [];
            $scope.showGroup = false;
            $scope.customerGroupList = [
                {id: '0',name: '全部分组'}
            ];
            $scope.chiocedGroup = {
                id: 0,
                name: '选择分组'
            };

            $scope.isEml = type=='email'?true:false;
            $scope.emailName = emailName;

            $scope.isCont = contId?true:false;
            $scope.contName = contName;

            $scope.reminds = [
                {value:'0', name: '无'},
                {value:'1', name: '事件发生时'},
                {value:'2', name: '5分钟前'},
                {value:'3', name: '15分钟前'},
                {value:'4', name: '30分钟前'},
                {value:'5', name: '1小时前'},
                {value:'6', name: '2小时前'},
                {value:'7', name: '1天前'},
                {value:'8', name: '1周前'}
            ];
            $scope.repeats = [
                {value:'1', name: '不重复'},
                {value:'2', name: '每天'},
                {value:'3', name: '每周'},
                {value:'4', name: '每月'},
                {value:'5', name: '每年'}
            ];
            $scope.stopTypes = [
                {value:'0', name:'永不'},
                {value:'1', name:'按时间选择'}
            ];
            $scope.saveUrl = '/api/task/v1/task/modify';

            $scope.task = {
                name: '',
                customer: {},
                charger: {},
                startTime: '',
                endTime: '',
                repeat: $scope.repeats[0].value,
                remind: $scope.reminds[0].value,
                stopType: $scope.stopTypes[0].value,
                stopTime: '',
                depict: ''
            };

            $scope.save = function(){
                if($scope.task.name=='' || $scope.task.customer=={} || $scope.task.charger=={} || $scope.task.startTime=={} || $scope.task.endTime=={}){
                    $.Alert("必填项不能为空！");
                    return;
                }
                var data = {
                    name: $scope.task.name,
                    customerId: $scope.task.customer.id,
                    customerName: $scope.task.customer.name,
                    executionTime:$scope.task.startTime,
                    executionTimeType:3,
                    fullDay:0,
                    principalId: $scope.task.charger.id,
                    principalName: $scope.task.charger.name,
                    description: $scope.task.depict,
                    remindTime: $scope.task.remind,
                    startDate: $scope.task.startTime,
                    endDate: $scope.task.endTime,
                    repeat:$scope.task.repeat
                };
                if($scope.task.repeat != '1'){
                    data.endRepeat = $scope.task.stopType;
                    if($scope.task.stopType!= '0'){
                        data.endRepeatTime = $scope.task.stopTime;
                    }
                }
                $http({
                    method:'post',
                    url: Base.sitUrl + $scope.saveUrl,
                    data:{
                        data: JSON.stringify(data)
                    }
                }).success(function(res) {
                        if (res.success) {
                            $.Alert('新建任务成功！', '', function () {
                                var index = parent.me.tabIdx();
                                parent.me.refresh2(pIdx, 'part');
                                parent.me.closeOne(index, true);
                            });
                        } else {
                            $.unLogin(res);
                        }
                    });
            };
            $scope.chioceGroup = function(_group){
                $scope.chiocedGroup = _group;
                $scope.showGroup = false;

                $scope.pageObj.currentPage = 1;
                if(_group.id!='0'){
                    $scope.pageObj.conditions = [{"filedName":"customerGroupId","operateType":"=","filedValue":_group.id}];
                }else {
                    $scope.pageObj.conditions = [];
                }

                customerList();
            };
            $scope.changeStyle = function($event){
                var thisDom = $event.target;
                $(thisDom).parents('.customer-list').find('div.radio').find('span.checked').removeClass('checked');
                $(thisDom).parent().addClass('checked');

                $scope.task.customer = JSON.parse($(thisDom).val());
            };

            $scope.custList = function () {
                customerList();
            };

            //负责人列表
            $http({
                method:'post',
                url: Base.sitUrl + '/api/org/v1/org/principal/list'
                })
                .success(function(res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return
                    }
                    $scope.chargerList = res.data;
                });
            //客户列表
            function customerList(){
                $http({
                    method:'post',
                    url: Base.sitUrl + '/api/customer/v1/customer/list/query',
                    data: {data: JSON.stringify($scope.pageObj)}
                }).success(function(res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return
                    }
                    $scope.customerList = res.data.results;

                    var total = res.data.totalItem,
                        all = Math.ceil(res.data.totalItem/res.data.pageSize);
                    $.Page({
                        total: total,
                        _class: '.customer-page',
                        nowNum: $scope.pageObj.currentPage,
                        allNum: all,
                        callback: function (now, all) {
                            $scope.pageObj.currentPage = now;
                            customerList();
                        }
                    });
                });
            }
            customerList();

            //客户分组列表
            $http({
                method:'post',
                url: Base.sitUrl + '/api/customer/v1/customer/group/list'
            }).success(function(res) {
                if (!res.success) {
                    $.unLogin(res);
                    return
                }
                $scope.customerGroupList = $scope.customerGroupList.concat(res.data);
                });

            if(taskId != null){
                $http({
                    method:"post",
                    url:Base.sitUrl + '/api/task/v1/task/particulars',
                    params:{
                        data:{
                            id:taskId
                        }
                    }})
                    .success(function(res){
                        if(!res.success){
                            $.unLogin(res);
                            return;
                        }
                        var data = res.data;
                        $scope.task.name = data.name;
                        $scope.task.customer.name = data.customerName;
                        $scope.task.customer.id = data.customerId;
                        $scope.task.charger.id = data.principalId;
                        $scope.task.charger.name = data.principalName;
                        $scope.task.startTime = data.startDate;
                        $scope.task.endTime = data.endDate;
                        $scope.task.repeat = data.repeat;
                        $scope.task.stopType = data.endRepeat;
                        $scope.task.stopTime = data.endRepeatTime;
                        $scope.task.remind = data.remindTime;
                        $scope.task.depict = data.description;
                    })
            }
        }]);

        angular.bootstrap( document.body , ['All']);
    });
});
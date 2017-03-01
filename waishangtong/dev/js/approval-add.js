require([ 'common' ], function () {
    require(['maintab','angular', 'ZeroClipboard', 'ueditorLang', 'blockUI', 'jqform', 'ztree'], function (maintab, ZeroClipboard) {
        maintab.init();

        var app=angular.module("approvalAddModule",[]);
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
        app.controller("approvalAdd",['$scope','$http',function($scope,$http){
            $scope.hasApprover = false;
            $scope.selectedApprovers = [];
            $scope.approverList=[];
            $scope.fullapproverList=[];
            $scope.isShowAddApproversPopup = false;
            $scope.approvalBusinessLoadCondition={
                'name':'',
                'type':0,
                'currentPage':1,
                'pageSize':20
            };
            $scope.piResult={
                'currentPage':0
            };
            $scope.quotationResult={
                'currentPage':0
            };
            $scope.orderResult={
                'currentPage':0
            };
            $scope.approvalBusinessPopupOpend = false;
            $scope.postData = {
                "subject" : "",   //标题
                "bizType" : 0,            //审批业务类型 1-报价 2-PI 3-订单 4-Email
                "bizId" : 0,         //审批业务ID
                "bizName" : "",   //审批业务名称
                "status" : 1,             //审批状态（1-待审批 2-通过 3-不通过）
                "remark" : "",
                "approvalApproverEnters" : [
                    // {
                    //     "userId" : 200200,
                    //     "approvalResult" : "",    //审批结果，同approval 表的状态
                    //     "approvalOpinions" : ""   //审批意见
                    // }
                ],
                "approvalAttachmentEnters" : [
                    // {
                    //     "name" : "附件名称",
                    //     "url" : "附件地址",
                    //     "size" : "附件大小",
                    //     "contentType" : "内容类型"
                    // }
                ]
            }
            //打开添加审批人弹出层
            $scope.openAddApproversPopup = function(){
                $scope.isShowAddApproversPopup = true;
                if($scope.fullapproverList.length > 0){
                    return;
                }
                loadApproversData();
            };

            //关闭添加审批人弹出层
            $scope.closeAddApproversPopup = function(){
                $scope.isShowAddApproversPopup = false;
            };

            //选中审批人
            $scope.selectedApprover = function(approver,$event){
                $event.stopPropagation();
                $scope.selectedApprovers.push(approver);
                $scope.isShowAddApproversPopup = false;
                $scope.hasApprover = $scope.selectedApprovers.length > 0;
                $scope.fullapproverList.remove(approver);

            };

            //删除审批人
            $scope.removeSelectedApprover = function(approver,$event){
                $event.stopPropagation();
                $scope.selectedApprovers.remove(approver);
                $scope.fullapproverList.push(approver);
            };

            //搜索审批人
            $scope.searchApprovers = function(keyword){
                $scope.approverList = [];
                if(keyword == undefined || keyword ==null || keyword == ''){
                    $scope.approverList = $scope.fullapproverList;
                    return true;
                }
                for(var i=0;i<$scope.fullapproverList.length;i++){
                    if($scope.fullapproverList[i].name.indexOf(keyword)>-1){
                        $scope.approverList.push($scope.fullapproverList[i]);
                    }
                }
            };

            //删除审批业务
            $scope.removeApprovalBusiness = function(){
                $scope.postData.bizType = 0;
                $scope.postData.bizId = 0;
                $scope.postData.bizName="";
            };
            function fileLimit(obj) {
                var flag = true;
                var fileObj = obj.prop('files');
                var sizeS = fileObj[0].size;
                return {flag: flag, name: fileObj[0].name, size: sizeS};
            }

            $scope.addAttachment = function(){
                $('#up-files').click();
            };
            //移除附件
            $scope.removeAttachment = function(attachment,$event){
                $scope.postData.approvalAttachmentEnters.remove(attachment);
            };

            //打开新增审批业务弹出层
            $scope.openAddApprovalBusinessPopup = function(type){
                $scope.approvalBusinessLoadCondition.currentPage = 1;
                $scope.approvalBusinessPopupOpend = true;
                $scope.postData.bizType=type;
                loadApprovalBusinessData('');
            };
            //关闭新增审批业务弹出层
            $scope.closeAddApprovalBusinessPopup = function(){
                $scope.postData.bizType=0;
                $scope.approvalBusinessLoadCondition={
                    'name':'',
                    'type':0,
                    'currentPage':1,
                    'pageSize':20
                };
                $scope.pi=[];
                $scope.quotation=[];
                $scope.order=[];
            };
            //搜索审批业务
            $scope.searApprovalBusiness = function(inputKeyword){
                loadApprovalBusinessData(inputKeyword);
            };
            //保存审批
            $scope.saveApproval = function(){
                if($scope.postData.subject==""){
                    $.Alert("请填写审批主题");
                    return
                };
                if($scope.hasApprover==false){
                    $.Alert("请添加审批人");
                    return
                };
                if($("#added-files .no-active").html()==""){
                    $.Alert("请选择审批对象");
                    return
                };
                for(var i=0;i<$scope.selectedApprovers.length;i++){
                    $scope.postData.approvalApproverEnters.push({'userId':$scope.selectedApprovers[i].id});
                }
                if($scope.postData.bizType==4){
                    $scope.postData.bizType=3;
                }else if($scope.postData.bizType==2){
                    $scope.postData.bizType=2;
                }else if($(".add-quotation").attr("data-id")){
                    $scope.postData.bizType=1;
                }
                var params = {
                    data:angular.toJson($scope.postData)
                };

                $http({
                    method:'post',
                    url: Base.sitUrl + '/api/approval/v1/add',
                    data:params
                }).success(function(res) {
                    $.UnblockUI();
                    if (!res.success) {
                        $.Alert(res.message);
                        return
                    }
                    $.DestroyPopInPop();
                    parent.location.reload();
                });

            };

            function loadApproversData(){
                var params = {
                    'keyword' : ''
                };
                $http({
                    method:'get',
                    url: Base.sitUrl + '/api/org/v1/org/principal/list',
                    params:params
                }).success(function(res) {
                    $.UnblockUI();
                    if (!res.success) {
                        $.Alert(res.message);
                        return
                    }
                    var data = res.data;
                    if (data.length > 0) {
                        $scope.approverList = formatData(data);
                        $scope.fullapproverList = $scope.approverList;
                    }
                });
            };


            function loadApprovalBusinessData(name){
                $scope.approvalBusinessLoadCondition.type=$scope.postData.bizType;
                $scope.approvalBusinessLoadCondition.name=name;
                var params = $scope.approvalBusinessLoadCondition;
                $http({
                    method:'get',
                    url: Base.sitUrl + '/api/export/v1/list',
                    params:params
                }).success(function(res) {
                    $.UnblockUI();
                    if (!res.success) {
                        $.Alert(res.message);
                        return
                    }
                    var data = res.data;

                    var total = data.totalItem;
                    var all = Math.ceil(total / $scope.approvalBusinessLoadCondition.pageSize);
                    $.Page({
                        total: total,
                        _class: '.page',
                        nowNum: $scope.approvalBusinessLoadCondition.currentPage,
                        allNum: all,
                        callback: function (now, all) {
                            $scope.approvalBusinessLoadCondition.currentPage = now;
                            loadApprovalBusinessData(name);
                        }
                    });
                    //1、产品；2、PI；3、报价；4、订单
                    switch($scope.approvalBusinessLoadCondition.type){
                        case 1:
                            break;
                        case 2:
                            $scope.piResult=data;
                            break;
                        case 3:
                            $scope.quotationResult=data;
                            break;
                        case 4:
                            $scope.orderResult=data;
                            break;
                        default:
                    };
                });
            };

            function formatData(data){
                for(var i=0;i<data.length;i++){
                    if(data[i].name.length>0){
                        if (escape(data[i].name).indexOf( "%u" )<0){
                            data[i].shortName=data[i].name.substring(0,2).toUpperCase();
                        } else {
                            data[i].shortName=data[i].name.substring(0,1);
                        }
                        //data[i].shortName=data[i].name.substring(0,1);
                    }
                }
                return data;
            };
            $scope.changeStyle = function($event){
                var thisDom = $event.target;
                $(thisDom).parents('.modelDwon').find('div.radio').find('span.checked').removeClass('checked');
                $(thisDom).parent().addClass('checked');
                $scope.postData.bizId = Number($(thisDom).val());
                $scope.postData.bizName = $(thisDom).parent().parent().next().text();
            };

            //附件选中和上传
            $scope.choiceAttachment = function(_this){
                var fileList = _this.files;//附件列表

                var flag = true;
                for(var i=0;i<fileList.length;i++){
                    var size = Math.round(fileList[i].size / 1024 * 100) / 100 / 1024;//MB
                    if (size > 20) {
                        $.Alert('上传附件需小于20MB');
                        flag = false;
                        break;
                    }
                }

                if (flag) {//所有文件都小于20m
                    $('#form_file').ajaxForm({
                        url: Base.sitUrl + '/api/file/upload',
                        beforeSend: function () {
                            $.BlockUI();
                        },
                        complete: function () {
                            $.UnblockUI();
                        },
                        success: function (res) {
                            if (!res.success) {
                                $.unLogin(res);
                                return;
                            }
                            var urlList = (res.data).split(',');
                            for(var i=0;i<fileList.length;i++){
                                $scope.postData.approvalAttachmentEnters.push({name:fileList[i].name, url: urlList[i], size: fileList[i].size});
                            }
                            $scope.$apply();
                        }
                    }).submit();
                }
            };

        }]);

        angular.bootstrap( document.body , ['approvalAddModule']);

        var startContent,startTheme;
        window['ZeroClipboard'] = ZeroClipboard;
        var emailId = $.GetQueryString('id');
        var hflx = $.GetQueryString('type');
        var typeCloud = $.GetQueryString('typeCloud');
        var typeTask = $.GetQueryString('typeTask');
        var emailTask = $.GetQueryString('emailTask');
        var modelType = $.GetQueryString('modelType');
        var customerName = $.GetQueryString('name');
        var modelsId = parseInt($.GetQueryString('ids'));
        // if (modelType == 99) {
        //     modelPdtAdd(modelsId);
        // } else if (modelType == 100) {
        //     modelquoteAdd(modelsId);
        // } else if (modelType == 101) {
        //     modelpiAdd(modelsId);
        // }
        //  添加审批人
        $('.downs').on('click', '.dropdowns ul>li', function (e) {
            $.EventFn(e);
            if ($(this).hasClass('active')) {
                return;
            }
            $(this).addClass('active');
        });
        //删除预览
        $('#added-files').on('click', '.removeLi', function () {
            $(this).parents("li").remove();
        });
        //删除附件预览
        $('#added-appendix').on('click', '.removeLi', function () {
            $(this).parents("li").remove();
        });
        //删除审批人
        $('.salesman').on('click', '.remove_sales', function () {
            $(this).parent().remove();
        });

    });
});
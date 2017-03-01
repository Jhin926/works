/* !
 *  用于查看任务详情
 */
require([ 'common' ], function () {
    require(['maintab', 'blockUI','angular', 'datetimepickerCN'], function (maintab) {
        var taskId = $.GetQueryString('taskId'),
            targetType = 0;
        maintab.init();
        //  清除外右边距
        function cMr(target, num) {
            $(target).each(function (index) {
                var _idx = index + 1;
                if (_idx % num == 0) {
                    $(this).css('margin-right', '0');
                }
            });
        }

        if (jQuery().datetimepicker) {
            $('.datetime-picker').datetimepicker({
                format: "yyyy-mm-dd hh:ii",
                todayBtn: false,
                language: "zh-CN",
                startDate: new Date(),
                pickerPosition: "top-left",
                autoclose: true
            });
        }
        //字段空值
        function testNull(test) {
            if (test == null) {
                return "";
            } else {
                return test;
            }
        }

        var app=angular.module("All",[]);
        app.controller("task_detail",['$scope','$http',function($scope,$http){
            $scope.userId=taskId;
            $scope.description="";
            $scope.taskTitle='';
            $scope.startDate='';
            $scope.endDate='';
            $scope.customerName='';
            $scope.principalName='';
            $scope.status='';
            $scope.end_repeat_time='';
            $scope.remindTime='';
            $scope.createTime='';
            $scope.executionTime='';
            $scope.repeat='';
            $scope.customerName='';
            $scope.customerStatusName='';
            $scope.card_title='';
            $scope.card_word='';
            $scope.id='';
            $scope.email='';
            $scope.end_repeat='';

            //  根据任务id获取任务详情
            function getTaskDetail() {
                $.BlockUI();
                $http({
                    method:"post",
                    url:Base.sitUrl + '/api/task/v1/task/particulars',
                    params:{
                        data:{
                            id:$scope.userId
                        }
                    }})
                    .success(function(res){
                        $.UnblockUI();
                        if(!res.success){
                            $.unLogin(res);
                            return;
                        }
                        var data = res.data;
                        var time = formatDate(new Date(data.createTime));
                        if (data.status == 1) {
                            $(".i-status").hide();
                            var html = '<span class="overtime" style="display:inline-block"></span>';
                            $("#task-title").before(html);
                            $("#completeTask").show();
                        } else if (data.status == 2) {
                            $(".i-status").hide();
                            var html = '<span class="overtime" style="display:inline-block"></span>';
                            $("#task-title").before(html);
                            $("#completeTask").show();
                        } else if (data.status == 3) {
                            $(".i-status").addClass("complete");
                        } else {
                            $(".i-status").hide();
                            var html = '<span class="overtime" style="display:inline-block"></span>';
                            $("#task-title").before(html);
                            $("#completeTask").show();
                        }
                        //提醒时间判断
                        if(data.remindTime==0){
                            data.remindTime="无";
                        }if(data.remindTime==1){
                            data.remindTime="事件发生时";
                        }if(data.remindTime==2){
                            data.remindTime="5分钟前";
                        }if(data.remindTime==3){
                            data.remindTime="15分钟前";
                        }if(data.remindTime==4){
                            data.remindTime="30分钟前";
                        }if(data.remindTime==5){
                            data.remindTime="1个小时前";
                        }if(data.remindTime==6){
                            data.remindTime="2个小时前";
                        }if(data.remindTime==7){
                            data.remindTime="1天前";
                        }if(data.remindTime==8){
                            data.remindTime="1周前";
                        }
                        //重复判断
                        if(data.repeat==1){
                            data.repeat="不重复";
                        }else if(data.repeat==2){
                            data.repeat="每天";
                        }else if(data.repeat==3){
                            data.repeat="每周";
                        }else if(data.repeat==4){
                            data.repeat="每月";
                        }else if(data.repeat==5){
                            data.repeat="每年";
                        }
                        //结束重复判断
                        if(data.end_repeat==1){
                            data.end_repeat="永不";
                        }
                        //状态判断
                        if(data.status==1){
                            data.status="未完成";
                            $(".info_con h5").css("background","#7596FD");
                        }else if(data.status==2){
                            data.status="已超时";
                            $(".info_con h5").css("background","#FF726B");
                        }else if(data.status==3){
                            data.status="已完成";
                            $(".info_con h5").css("background","#33BF7B");
                        }
                        //背景颜色
                        var color=data.visitingCard.customerStatusColour;
                        $("span.s-status").css("background",color);
                        $scope.taskTitle+=testNull(data.name);
                        $scope.id+=testNull(data.visitingCard.customerId);
                        $scope.email+=testNull(data.visitingCard.email);
                        $scope.description+=testNull(data.description);
                        $scope.startDate+=testNull(data.startDate);
                        $scope.principalName+=testNull(data.principalName);
                        if(data.end_repeat_time){
                            $scope.end_repeat_time+=testNull(data.endRepeatTime);
                        }else{
                            $scope.end_repeat_time+='无';
                        }
                        $scope.end_repeat+=testNull(data.end_repeat);
                        $scope.remindTime+=testNull(data.remindTime);
                        $scope.createTime+=testNull(data.createTime);
                        $scope.status+=testNull(data.status);
                        $scope.repeat+=testNull(data.repeat);
                        $scope.customerName+=testNull(data.customerName);
                        $scope.executionTime+=testNull(data.executionTime);
                        $scope.customerName=testNull(data.visitingCard.customerName);
                        $scope.card_title=testNull(data.visitingCard.title);
                        if(data.visitingCard.title){
                            $scope.card_word=testNull(data.visitingCard.title.substring(0,1));
                        }else{
                            $scope.card_word='';
                        }
                        $scope.customerStatusName=testNull(data.visitingCard.customerStatusName);
                        $("#taskName").val(testNull(data.name));
                        $("#customer option[value="+data.customerName+"]").attr("selected","selected");
                        $("#principal option[value="+data.principalName+"]").attr("selected","selected");
                        $("#noRepeat option[value="+data.end_repeat+"]").attr("selected","selected");
                        $("#repeat option[value="+data.repeat+"]").attr("selected","selected");
                        $("span.data-st").text(testNull(time));
                        $("#stratTime").val(testNull(data.startDate));
                        $("#endTime").val(testNull(data.endDate));
                        if (!data.executionTimeResult) {
                            $("#startTime").val(data.executionTime);
                        } else {
                            var weeks = data.executionTimeResult.weeks.split(',');
                            for (var i = 0; i < weeks.length; i++) {
                                for (var j = 0; j < $('.checkcycle').find('label').length; j++) {
                                    if (weeks[i] == $('.checkcycle').find('label').eq(j).find('input').attr('data-id')) {
                                        $('.checkcycle').find('label').eq(j).find('span').addClass('checked');
                                        $('.checkcycle').find('label').eq(j).find('input[type=checkbox]').attr('checked', true);
                                    }
                                }
                            }
                            var startTimeWeek = data.executionTimeResult.startTime;
                            var endTimeWeek = data.executionTimeResult.endTime;
                            var startHour = startTimeWeek.substring(0, 2);
                            var startMin = startTimeWeek.substring(3, 5);
                            var endHour = endTimeWeek.substring(0, 2);
                            var endMin = endTimeWeek.substring(3, 5);
                            if (parseInt(startHour) > 12 && parseInt(endHour) > 12) {
                                hFn($('#ap').attr('id'), 'pm', ha[1]['pm'].hs);
                                hFn($('#ap2').attr('id'), 'pm', ha[1]['pm'].hs);
                            } else if (parseInt(startHour) <= 12 && parseInt(endHour) <= 12) {
                                hFn($('#ap').attr('id'), 'am', ha[0]['am'].hs);
                                hFn($('#ap2').attr('id'), 'am', ha[0]['am'].hs);
                            } else if (parseInt(startHour) > 12 && parseInt(endHour) <= 12) {
                                hFn($('#ap').attr('id'), 'pm', ha[1]['pm'].hs);
                                hFn($('#ap2').attr('id'), 'am', ha[0]['am'].hs);
                            } else if (parseInt(startHour) <= 12 && parseInt(endHour) > 12) {
                                hFn($('#ap2').attr('id'), 'pm', ha[1]['pm'].hs);
                                hFn($('#ap').attr('id'), 'am', ha[0]['am'].hs);
                            }
                            $('#minutes').val(startMin);
                            $('#minutes2').val(endMin);
                            if (parseInt(startHour) > 12) {
                                $('#ap option[value=pm]').attr('selected', true);
                                $('#hours option[value=' + startHour + ']').attr('selected', true);
                            } else {
                                $('#ap option[value=am]').attr('selected', true);
                                $('#hours option[value=' + startHour + ']').attr('selected', true);
                            }
                            if (parseInt(endHour) > 12) {
                                $('#ap2 option[value=pm]').attr('selected', true);
                                $('#hours2 option[value=' + endHour + ']').attr('selected', true);
                            } else {
                                $('#ap2 option[value=am]').attr('selected', true);
                                $('#hours2 option[value=' + endHour + ']').prop('selected', true);
                            }
                            $('#taskType option[value=2]').attr('selected', true);
                            $('.check-box').show();
                            $('.startTime').hide();
                        }
                        $("#warn option[value="+data.remindTime+"]").attr("selected","selected");
                        $("#description").val(testNull(data.description));
                        var tx = data.visitingCard.status;
                        var gh = data.visitingCard.isHighSeas;
                        var comp = data.visitingCard.customerName;
                        userimg = '';
                        var gonghai = '';
                        var html2 = '';
                        if (gh == 1) {
                            gonghai = '<span>公海</span>';
                        }
                        if (data.visitingCard.customerContactsName == null || data.visitingCard.customerContactsName == undefined) {
                            var status = '';
                        } else {
                            var status = data.visitingCard.customerContactsName.substring(0, 1);
                        }
                        switch (tx) {
                            case 1:
                                userimg = '<i class="pub-icon sender4-icon"></i>';
                                html2 = '<ul><li data-id="' + data.id + '" data-email="' + data.visitingCard.email + '">' +                //陌生发件人
                                    '<div class="sender-condition">' +
                                    '<div class="sender-condition-img"><span class="ellipsis sender-condition-name">' + data.visitingCard.title + '</span></div>' +
                                    '<button type="button" class="btn btn-primary btn-lg btn-block btn-blockAdd">添加为联系人</button>' +
                                    '<div class="btn-group condition-cz-btn" role="group" style="margin-left:-118px;"><button type="button" class="btn btn-default newtongxunlu">添加通讯录</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                                    '</div>' +
                                    '</li></ul>';
                                break;
                            case 2:
                                userimg = '<i class="pub-icon sender4-icon"></i>';
                                html2 = '<ul><li data-id="' + data.id + '" data-email="' + data.visitingCard.email + '">' +                //通讯录好友
                                    '<div class="sender-condition">' +
                                    '<div class="sender-condition-img"><span class="ellipsis sender-condition-name">' + data.visitingCard.title + '</span></div>' +
                                    '<button type="button" class="btn btn-primary btn-lg btn-block btn-blockAdd">添加为联系人</button>' +
                                    '<div class="btn-group condition-cz-btn" role="group" style="margin-left:-118px;"><button type="button" class="btn btn-default tongxunlu">通讯录好友</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                                    '</div>' +
                                    '</li></ul>';
                                break;
                            case 3:
                                userimg = '<i class="pub-icon sender1-icon"></i>';//我的联系人
                                html2 = '<ul><li data-id="' + data.id + '" data-customer="' + data.visitingCard.customerId + '" data-cont="' + data.visitingCard.customerContactsId + '" data-email="' + data.visitingCard.email + '">' +
                                    '<div class="sender-condition">' +
                                    '<div class="sender-condition-img"><span class="ellipsis sender-condition-name">' + data.visitingCard.title + '</span></div>' +
                                    '<div class="company-info"><span class="s-status" style="background-color: ' + data.visitingCard.customerStatusColour + ';">' + status + '</span><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                                    '<div class="belong-yewuy"><label>所属业务员：</label><span>' + data.visitingCard.salesmanName + '</span></div>' +
                                    '<button type="button" class="btn btn-primary btn-lg btn-block btn-blockDetail">查看联系人</button>' +
                                    '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin">写跟进</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                                    '</div>' +
                                    '</li></ul>';
                                break;
                            case 4:
                                userimg = '<i class="pub-icon sender1-icon"></i>';//我的客户
                                html2 = '<ul><li data-id="' + data.id + '" data-customer="' + data.visitingCard.customerId + '" data-email="' + data.visitingCard.email + '">' +
                                    '<div class="sender-condition">' +
                                    '<div class="sender-condition-img"><span class="ellipsis sender-condition-name">' + data.visitingCard.title + '</span></div>' +
                                    '<div class="company-info"><span class="s-status" style="background-color: ' + data.visitingCard.customerStatusColour + ';">' + status + '</span><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                                    '<div class="belong-yewuy"><label>所属业务员：</label><span>' + data.visitingCard.salesmanName + '</span></div>' +
                                    '<button type="button" class="btn btn-primary btn-lg btn-block btn-scanCust">查看客户</button>' +
                                    '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin" disabled>写跟进</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                                    '</div>' +
                                    '</li></ul>';
                                break;
                            case 5:
                                userimg = '<i class="pub-icon sender3-icon"></i>';//公海联系人
                                html2 = '<ul><li data-id="' + data.id + '" data-customer="' + data.visitingCard.customerId + '" data-email="' + data.visitingCard.email + '">' +
                                    '<div class="sender-condition">' +
                                    '<div class="sender-condition-img"><i class="pub-icon sender3-icon" style="top:0;"></i><span class="ellipsis sender-condition-name">' + data.visitingCard.title + '</span></div>' +
                                    '<div class="company-info"><span class="s-status" style="background-color: ' + data.visitingCard.customerStatusColour + ';">' + status + '</span><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                                    '<div class="belong-yewuy"><label>所属业务员：</label>' + gonghai + '</div>' +
                                    '<button type="button" class="btn btn-primary btn-lg btn-block btn-privateCont">添加到私海</button>' +
                                    '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin" disabled>写跟进</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                                    '</div>' +
                                    '</li></ul>';
                                break;
                            case 6:
                                userimg = '<i class="pub-icon sender3-icon"></i>';//公海客户
                                html2 = '<ul><li data-id="' + data.id + '" data-customer="' + data.visitingCard.customerId + '" data-email="' + data.visitingCard.email + '">' +
                                    '<div class="sender-condition">' +
                                    '<div class="sender-condition-img"><i class="pub-icon sender3-icon" style="top:0;"></i><span class="ellipsis sender-condition-name">' + data.visitingCard.title + '</span></div>' +
                                    '<div class="company-info"><span class="s-status" style="background-color: ' + data.visitingCard.customerStatusColour + ';">' + status + '</span><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                                    '<div class="belong-yewuy"><label>所属业务员：</label>' + gonghai + '</div>' +
                                    '<button type="button" class="btn btn-primary btn-lg btn-block btn-privateCust">添加到私海</button>' +
                                    '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin" disabled>写跟进</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                                    '</div>' +
                                    '</li></ul>';
                                break;
                            case 7:
                                userimg = '<i class="pub-icon sender2-icon"></i>';//同事联系人
                                html2 = '<ul><li data-id="' + data.id + '" data-customer="' + data.visitingCard.customerId + '" data-email="' + data.visitingCard.email + '">' +
                                    '<div class="sender-condition">' +
                                    '<div class="sender-condition-img"><i class="pub-icon sender2-icon" style="top:0;"></i><span class="ellipsis sender-condition-name">' + data.visitingCard.title + '</span></div>' +
                                    '<div class="company-info"><span class="s-status" style="background-color: ' + data.visitingCard.customerStatusColour + ';">' + status + '</span><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                                    '<div class="belong-yewuy"><label>所属业务员：</label><span>' + data.visitingCard.salesmanName + '</span></div>' +
                                    '<button type="button" class="btn btn-default btn-lg btn-block btn-blockDetail btn-gray" disabled>查看联系人</button>' +
                                    '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin" disabled>写跟进</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go" disabled>往来邮件</button></div>' +
                                    '</div>' +
                                    '</li></ul>';
                                break;
                            case 8:
                                userimg = '<i class="pub-icon sender2-icon"></i>';//同事客户
                                html2 = '<ul><li data-id="' + data.id + '" data-customer="' + data.visitingCard.customerId + '" data-email="' + data.visitingCard.email + '">' +
                                    '<div class="sender-condition">' +
                                    '<div class="sender-condition-img"><i class="pub-icon sender2-icon" style="top:0;"></i><span class="ellipsis sender-condition-name">' + data.visitingCard.title + '</span></div>' +
                                    '<div class="company-info"><span class="s-status" style="background-color: ' + data.visitingCard.customerStatusColour + ';">' + status + '</span><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                                    '<div class="belong-yewuy"><label>所属业务员：</label><span>' + data.visitingCard.salesmanName + '</span></div>' +
                                    '<button type="button" class="btn btn-default btn-lg btn-block btn-gray btn-blockAdd" disabled>添加联系人</button>' +
                                    '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin" disabled>写跟进</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go" disabled>往来邮件</button></div>' +
                                    '</div>' +
                                    '</li></ul>';
                                break;
                        }
                        html = html2;
                        $('.sender-condition-style').empty();
                        $('.sender-condition-style').append(html);
                    })
            };
            getTaskDetail(taskId);

            //点击卡片写跟进
            $('.box-left').on('click','.xiegenjin',function (e) {
                $.EventFn(e);
                var id = $scope.id;
                maintab.showTab(Base.url + '/html/pop-upload.html?type=1&id=' + id + "&v=" + window.ver, '写跟进');
            });
            //  查看联系人
            $('.box-left').on('click', '.btn-blockDetail', function (e) {
                $.EventFn(e);
                var id = $scope.id;
                maintab.showTab(Base.url + '/html/pop-relation-detail.html?id=' + id + "&v=" + window.ver, '联系人详情');
            });
            //点击卡片发邮件
            $('.box-left').on('click', '.fayoujian', function (e) {
                $.EventFn(e);
                var id = $scope.id;
                maintab.showTab(Base.url + '/html/pop-email-new.html?showType=right&type=0&id=' + id + "&v=" + window.ver, '发邮件');
            });
            //点击卡片往来邮件
            $('.box-left').on('click', '.come-go', function (e) {
                $.EventFn(e);
                var email = $scope.email;
                var h = email.search(/\;/)
                email = email.substring(0, h);
                maintab.showTab(Base.url + '/html/pop-come-go-email.html?email=' + email + "&v=" + window.ver, '往来邮件');
            });
        }]);
        //  切换时间
        $('#ap,#ap2').change(function () {

            if (($(this).attr('id') == 'ap' && ($(this).val() == 'pm'))) {
                $('#ap2').val($(this).val());
                hFn($(this).attr('id'), 'pm', ha[1]['pm'].hs);
            } else if (($(this).attr('id') == 'ap2' && ($(this).val() == 'am'))) {
                $('#ap').val($(this).val());
                hFn($(this).attr('id'), 'am', ha[0]['am'].hs);
            } else if (($(this).attr('id') == 'ap' && ($(this).val() == 'am'))) {
                hFn($(this).attr('id'), 'am', ha[0]['am'].hs);
            } else if ($(this).attr('id') == 'ap2' && $(this).val() == 'pm') {
                hFn($(this).attr('id'), 'pm', ha[1]['pm'].hs);
            }

        });

        var dateObj = {
            st: '',
            ed: '',
            oSt: ''
        };

        function getCalender() {
            var date = new Date();
            var _m = date.getMonth() + 1;
            var _d = date.getDate();
            var _H = date.getHours();
            var _S = date.getMinutes();
            var _s = date.getSeconds();
            var tmp = date.getFullYear() + '-' + _m + '-' + _d;
            var tmp2 = date.getFullYear() + '-' + _m + '-' + _d + ' ' + _H + ':' + _S + ':' + _s;
            dateObj.st = tmp;
            dateObj.ed = tmp;
            dateObj.oSt = tmp2;
        }


        //时间戳转换
        function formatDate(now) {
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var date = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();
            var second = now.getSeconds();
            return   year + "-" + month + "-" + date + "   " + hour + ":" + minute + ":" + second;
        }

        var groups = '';

        //  渲染公司/联系人详情
        function viewTypeDetail(data) {
            if (data.headImgUrl != '') {
                $('.data-imgurl').attr('src', data.headImgUrl);
            }
        }

        //  查看与编辑窗口切换
        $('.boxs').on('click', '#taskChange', function () {
            $(this).closest('.boxs').hide().siblings('.boxs').show();
            $("#editForm").show();
            if ($(this).hasClass('fa-pencil-square-o')) {
                cuFn(targetType);
                headFn(0);
                $('#cusType').get(0).selectedIndex = targetType;
                //hFn('ap','ap',ha[0]['am'].hs);
            }
        });
        //获取负责人列表
        $("#taskChange").on('click', function () {
            $.ajax({
                url: Base.sitUrl + '/api/org/v1/org/principal/list',
                type: 'POST',
                dataType: 'json',
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }
                    ;
                    var data = result.data;
                    for (var i = 0; i < data.length; i++) {
                        var li = '<option data-id="' + data[i].id + '">' + data[i].name + '</option>';
                        $("#principal").append(li);
                    }
                }
            });
            //获取客户列表
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/customer/assign/list',
                type: 'POST',
                dataType: 'json',
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }
                    ;
                    var data = result.data;
                    for (var i = 0; i < data.length; i++) {
                        var li = '<option data-id="' + data[i].id + '">' + data[i].name + '</option>';
                        $("#customer").append(li);
                    }
                }
            });
        })

        //  客户类型切换
        $('#cusType').on('change', function () {

            cuFn($(this).val());
        });
        //  负责人类型切换
        $('#cusType').on('change', function () {

            //headFn($(this).val());
        });
        $('#cusType,#headType').on('click', function (e) {
            var _ev = e || window.event;
            _ev.stopPropagation();
        });


        var custObj = {id: null, name: null};
        var headArr = [];
        var headObj = {id: '', name: '', dep: ''};


        //  标记任务
        $('#completeTask').on('click', function () {
            $.Confirm('确认完成任务？', '', function () {
                $.ajax({
                    url: Base.sitUrl + '/api/task/v1/task/sign',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        id: taskId,
                        status: 3
                    },
                    success: function (result) {
                        if (!result.success) {
                            $.Alert(result.message);
                            return;
                        }
                        ;
                        if (result.success) {
                            parent.location.reload();
                            $.DestroyPopInPop();
                        } else {
                            $.Alert(result.message);
                        }
                        $.DestroyPopInPop();
                        parent.location.reload();
                    }
                });
            });
        });

        //  删除任务
        $('#openDel').on('click', function () {
            $('#delModal').modal('show');
        });

        //  确定删除
        $('#delModal').delegate('.delOne', 'click', function (e) {
            $.ajax({
                url: Base.sitUrl + '/api/task/v1/task/delete',
                type: 'POST',
                dataType: 'json',
                data: {
                    ids: taskId
                },
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }
                    ;
                    if (result.success) {
                        parent.location.reload();
                        $.DestroyPopInPop();
                    } else {
                        $.Alert(result.message);
                    }
                    $.DestroyPopInPop();
                    parent.location.reload();
                }
            })
        });

        //  编辑任务详情
        function editTask(taskId) {
            var executionTime = "";
            if ($("#taskType option:selected").attr("value") == 1) {
                executionTime += $("#startTime").val()
            } else {
                var week = '';
                if ($(".checkcycle").find("input[name=cycle]:checked").length < 1) {
                    $.Alert("请选择周期");
                    return;
                }
                for (var i = 0; i < $(".checkcycle").find("input[name=cycle]:checked").length; i++) {
                    week += $(".checkcycle").find("input[name=cycle]:checked").eq(i).attr("data-id");
                }
                var start = $("#hours option:selected").val() + ':' + $("#minutes").val();
                var end = $("#hours2 option:selected").val() + ':' + $("#minutes2").val();
                executionTime += week + ' ' + start + ' ' + '-' + ' ' + end;
                if ($("#hours option:selected").val() > $("#hours2 option:selected").val()) {
                    $.Alert("周期选择错误！");
                    return;
                } else if ($("#hours option:selected").val() == $("#hours2 option:selected").val() && $("#minutes").val() > $("#minutes2").val()) {
                    $.Alert("周期选择错误！");
                    return;
                }
            }
            var data = {
                id: taskId,
                name: $("#taskName").val(),
                customerId: $("#customer option:selected").attr("data-id"),
                customerName: $("#customer").val(),
                principalId: $("#principal option:selected").attr("data-id"),
                principalName: $("#principal").val(),
                description: $("#description").val(),
                remindTime: $("#warn option:selected").attr("value"),
                executionTimeType: $("#taskType option:selected").attr("value"),
                executionTime: executionTime
            };
            if ($("#taskName").val() == "" || $("#customer").val() == "" || $("#principal").val() == "") {
                $.Alert("内容不能为空！");
                return;
            }
            $.ajax({
                url: Base.sitUrl + '/api/task/v1/task/edit',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: JSON.stringify(data)
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    if (res.success) {
                        parent.location.reload();
                        $.DestroyPopInPop();
                    } else {
                        $.Alert(result.message);
                    }
                    $.DestroyPopInPop();
                    parent.location.reload();
                }
            });
        }

        $(document).on('click', '.overtime', function (e) {
            $.EventFn(e);
            var oThis = $(this);
            $.ajax({
                url: Base.sitUrl + '/api/task/v1/task/sign',
                type: 'POST',
                dataType: 'json',
                data: {
                    id: taskId,
                    status: 3
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    $(oThis).addClass('i-status complete');
                    $(oThis).removeClass('overtime');
                    getTaskDetail(taskId);
                    parent.$.reQuey();
                }
            });
        })

        //  提交修改
        $('#taskBubSave').on('click', function (e) {
            var _ev = e || window.event;
            _ev.preventDefault();
            editTask(taskId);
            if ($('.complete').length > 0) {
                $.ajax({
                    url: Base.sitUrl + '/api/task/v1/task/sign',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        id: taskId,
                        status: 1
                    },
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        ;
                        getTaskDetail(taskId);
                        parent.$.reQuey();
                    }
                });
            }
        });

        $('#taskBubCencle').on('click', function (e) {
            var _ev = e || window.event;
            _ev.preventDefault();
            $("#editForm").hide();
            $('.detailBox').show().siblings('.boxs').hide();
        });
        //名片
        //点击卡片写跟进
        $('.sender-condition-style').on('click', '.xiegenjin', function (e) {
            $.EventFn(e);
            var id = $(this).parents('li').attr('data-id');
            maintab.showTab(Base.url + '/html/pop-upload.html?id=' + id + "&v=" + window.ver, '写跟进');
        });
        //点击卡片添加通讯录
        $('.sender-condition-style').on('click', '.newtongxunlu', function (e) {
            $.EventFn(e);
            var id = $(this).parents('li').attr('data-id');
            maintab.showTab(Base.url + '/html/pop-statistics-new.html?id=' + id + "&v=" + window.ver, '新建通讯录');
        });
        //点击卡片通讯录
        $('.sender-condition-style').on('click', '.tongxunlu', function (e) {
            $.EventFn(e);
            var id = $(this).parents('li').attr('data-id');
            maintab.showTab(Base.url + '/html/email-statistics.html' + "?&v=" + window.ver, '通讯录');
        });
        //点击卡片发邮件
        $('.sender-condition-style').on('click', '.fayoujian', function (e) {
            $.EventFn(e);
            var email = $(this).parents('li').attr('data-email');
            $('#mainIframe', parent.parent.document).attr('src', Base.url + '/html/pop-email-new.html?typeTask=1&emailTask=' + email + "&v=" + window.ver);
        });
        //添加客户到私海
        $('.sender-condition-style').on('click', '.btn-privateCust', function (e) {
            $.EventFn(e);
            var id = $(this).parents('li').attr('data-id');
            var data = {
                id: id
            }
            var $oThis = $(this)
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/into/private/seas',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: JSON.stringify(data)
                },
                success: function (res) {
                    $oThis.text('已添加到私海')
                }
            })
        });
        //添加联系人到私海
        $('.sender-condition-style').on('click', '.btn-privateCont', function (e) {
            $.EventFn(e);
            var id = $(this).parents('li').attr('data-id');
            var data = {
                id: id
            }
            var $oThis = $(this)
            $.ajax({
                url: Base.sitUrl + '/api/customer/contacts/v1/into/private/seas',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: JSON.stringify(data)
                },
                success: function (res) {
                    $oThis.text('已添加到私海')
                }
            })
        });

        //点击卡片往来邮件
        $('.sender-condition-style').on('click', '.come-go', function (e) {
            $.EventFn(e);
            var email = $(this).parent().prevAll('.sender-condition-img').find('.sender-condition-name').text();
            maintab.showTab(Base.url + '/html/pop-come-go-email.html?email=' + email + "&v=" + window.ver, '往来邮件');
        });
        //  添加为联系人
        $('.sender-condition-style').on('click', '.btn-blockAdd', function (e) {
            $.EventFn(e);
            var name = $(".detailSender").val();
            maintab.showTab(Base.url + '/html/pop-contacts-add.html?name=' + name + "&v=" + window.ver, '添加联系人');
        });
        //  查看联系人
        $('.sender-condition-style').on('click', '.btn-blockDetail', function (e) {
            $.EventFn(e);
            var id = $(this).parents('li').attr('data-cont');
            maintab.showTab(Base.url + '/html/pop-relation-detail.html?id=' + id + "&v=" + window.ver, '联系人详情');
        });
        //查看公司
        $('.sender-condition-style').on('click', '.company-name,.btn-scanCust', function (e) {
            $.EventFn(e);
            var id = $(this).parents('li').attr('data-customer');
            maintab.showTab(Base.url + '/html/pop-customer-detail.html?id=' + id + "&v=" + window.ver, '客户详情');
        });
        angular.bootstrap( document.body , ['All']);
    });
});
/* !
 *  用于新建任务
 */
require([ 'common' ], function () {
    require(['maintab', 'blockUI', 'datetimepickerCN'], function (maintab) {

        var type = $.GetQueryString('type');
        var taskType = $.GetQueryString('taskType');
        var dateTime = $.GetQueryString('dateTime');
        var emailName = $.GetQueryString('emailName');
        var custId = parseInt($.GetQueryString('id'));
        var taskId = parseInt($.GetQueryString('taskId'));
        var contactsId = $.GetQueryString('contactsId');
        var pIdx = Number($.GetQueryString('pIdx'));

        if (type == 'email') {
            $('#emailName').val(emailName);
            $('#emailNameShow').show();
        }

        //获取负责人列表
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
                if (custId || contactsId) {//从客户中新建订单
                    for (var i = 0; i < data.length; i++) {
                        if (custId == data[i].id) {
                            $('#customerInput').attr({'data-id': data[i].id, 'disabled': true}).val(data[i].name);
                            $(".customerList").css({border: 'none', padding: 0});
                            break;
                        }
                    }
                } else {
                    for (var i = 0; i < data.length; i++) {
                        var li = '<div class="customerLi" data-id="' + data[i].id + '">' + data[i].name + '</div>';
                        $("#customer").append(li);
                    }
                }
            }
        });
        $('#customerInput').click(function (e) {//显示客户列表
            $.EventFn(e)
            if ($(".customerList").css('display') == 'none') {
                $(".customerList").show();
            } else {
                $(".customerList").hide();
            }
        });
        $('body').click(function () {
            $(".customerList").hide();
        })
        $('.customerList').click(function (e) {
            $.EventFn(e)
        });
        $('.customerSearch').on('input', function (e) {//客户搜索
            $("#c-cust").parent().show();
            var val = $(this).val();
            var valI = val.length;
            $(this).attr("data-id", "");
            var iLength = $("#customer").find('div').length;
            for (var i = 0; i < iLength; i++) {
                var textLi = $("#customer").find('div').eq(i).text();
                var valLi = textLi.substring(0, valI);
                if (valLi !== val) {
                    $("#customer").find('div').eq(i).hide();
                } else {
                    $("#customer").find('div').eq(i).show();
                }
            }
        });
        $('#customer').on('click', '.customerLi', function () {//选择客户
            var data_id = $(this).attr('data-id');
            var name = $(this).text();
            $('#customerInput').attr('data-id', data_id);
            $('#customerInput').val(name);
            $(".customerList").hide();
        });

        $("#repeat").on("click",function(){
            if($("#repeat option:selected").text()=="不重复"){
                $("#noRepeat").attr("disabled",true);
            }else{
                $("#noRepeat").attr("disabled",false);
            }
        })
        $("#noRepeat").on("click",function(){
            if($("#noRepeat option:selected").val()=="chooseTime"){
                $(".time_hide").show();
            }
        })
        //  新建任务
        $('#task-add').on('click', function () {
            var executionTime = "";
            if ($.GetLength($("#taskName").val()) > 64) {
                $.Alert('任务名称不超过64个字母或32个汉字')
                return
            }
            if($(".time_hide input").val()!=""){
                $(".time_hide").hide();
            }
                var data = {
                    name: $("#taskName").val(),
                    customerId: $("#customerInput").attr("data-id"),
                    customerName: $("#customerInput").val(),
                    executionTimeType:3,
                    fullDay:0,
                    principalId: $("#principal option:selected").attr("data-id"),
                    principalName: $("#principal").val(),
                    description: $("#description").val(),
                    remindTime: $("#warn option:selected").attr("value"),
                    end_repeat:$("#noRepeat option:selected").val(),
                    startDate: $('#stratTime').val(),
                    endDate: $('#endTime').val(),
                    end_repeat_time:$("#chooseTime").val(),
                    repeat:$("#repeat option:selected").val()
                };
            if ($("#taskName").val() == "" || $("#customerInput").val() == "" || $("#principal").val() == "") {
                $.Alert("内容不能为空！");
                return;
            }
            if (taskId) {
                var uri = '/api/task/v1/task/edit'
                var data = {
                    id: taskId,
                    name: $("#taskName").val(),
                    customerId: $("#customerInput").attr("data-id"),
                    customerName: $("#customerInput").val(),
                    principalId: $("#principal option:selected").attr("data-id"),
                    principalName: $("#principal").val(),
                    description: $("#description").val(),
                    remindTime: $("#warn option:selected").attr("value"),
                    startDate: $('#stratTime').val(),
                    endDate: $('#endTime').val()
                };
            } else {
                var uri = '/api/task/v1/task/save'
            }
            if (contactsId) {
                data.contactsId = contactsId;
            }
            if (custId) {
                data.customerId = custId;
            }
            $.ajax({
                url: Base.sitUrl + uri,
                type: 'POST',
                dataType: 'json',
                data: {
                    data: JSON.stringify(data)
                },
                success: function (result) {
                    if (result.success) {
                        $.Alert('新建任务成功！', '', function () {
                            var index = parent.me.tabIdx();
                            parent.me.refresh2(pIdx, 'part');
                            parent.me.closeOne(index, true);
                        });
                    } else {
                        $.Alert(result.message);
                    }
                }
            });
        });
        var id = $.GetQueryString('id'),
            type = $.GetQueryString('type');

        if (jQuery().datetimepicker) {
            $('.datetime-picker').datetimepicker({
                format: "yyyy-mm-dd hh:mm:ss",
                todayBtn: false,
                language: "zh-CN",
                // startDate: new Date(),
                pickerPosition: "top-left",
                autoclose: true,
                // minView:"month"
            });
        }


        //  周期选中
        $('input[name=cycle]').on('click', function () {
            $(this).attr('checked', !$(this).attr('checked'));
        });

        //  切换周期任务
        $('.check-box').hide();
        var ha = [
            {'am': {hs: ['01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00']}},
            {'pm': {hs: ['13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00', '24:00']}}
        ];
        $('#taskType').change(function () {
            if ($(this).val() == 1) {
                $('.startTime').show().next('.check-box').hide();
            } else {
                $('.startTime').hide().next('.check-box').show();
            }
        });

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

        hFn('ap', 'ap', ha[0]['am'].hs);
        function hFn(id, dhr, param) {
            var html = '';
            for (var i = 0; i < param.length; i++) {
                var h = param[i];
                var _h = h.substr(0, h.lastIndexOf(':'));
                html += '<option value="' + _h + '">' + h + '</option>';
            }
            if (id == 'ap' && dhr == 'am') {
                $('#hours').empty();
                $('#hours').append(html);
            } else if (dhr == 'ap' || (id == 'ap' && dhr == 'pm') || (id == 'ap2' && dhr == 'am')) {
                $('#hours').empty();
                $('#hours2').empty();
                $('#hours').append(html);
                $('#hours2').append(html);
            } else if (id == 'ap2' && dhr == 'pm') {
                $('#hours2').empty();
                $('#hours2').append(html);
            }
        }

        //  取消新建任务
        $('#task-cancel').on('click', function () {
            $.DestroyPopInPop();
        });
        $(document).ready(function () {
            if (taskType) {
                $('#startTime').val(dateTime);
                $('#taskName').val(emailName);
            }
            if (taskId) {
                $.ajax({
                    url: Base.sitUrl + '/api/task/v1/task/detail',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        id: taskId
                    },
                    success: function (res) {
                        var data = res.data;
                        $('#task-add').text('修改');
                        $('#startTime').val(data.executionTime);
                        $('#taskName').val(data.name);
                        $('#description').val(data.description);
                        // $('#customer option[data-id='+data.customerId+']').attr('selected',true);
                        $('#customerInput').attr('data-id', data.customerId)
                        $('#customerInput').val(data.customerName)
                        $('#principal option[data-id=' + data.principalId + ']').attr('selected', true);
                        $('#warn option[value=' + data.remindTime + ']').attr('selected', true);
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
                    }
                })
            }
        })
    });
});
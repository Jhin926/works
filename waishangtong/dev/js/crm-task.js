/* !
 *  用于CRM任务设置
 */
require([ 'common' ], function () {
    require(['maintab', 'blockUI', 'datetimepickerCN'], function (maintab) {
        //显示相应的功能按钮
        var funcList = top.funcList;
        $('[data-code]').each(function(){
            for(var i=0; i<funcList.length; i++){
                if(funcList[i].code == $(this).attr('data-code')){
                    $(this).removeClass('none');
                }
            };
        });


        // 右侧弹窗初始化
        maintab.init();
        //默认隐藏右半部分标题
        $('.r-titles').hide();
        if (jQuery().datetimepicker) {
            $('.datetime-picker').datetimepicker({
                format: "yyyy-mm-dd hh:ii",
                todayBtn: true,
                language: "zh-CN",
                // startDate: new Date(),
                pickerPosition: "bottom-right",
                autoclose: true
            });
        }
        var $content = $('.page-content');
        //  分页
        var pageObj = {
            homepage: 1,
            currentPage: 1,
            lastpage: null,
            pageSize: 20
        };
        //切换
        $("#taskType li").on('click', function () {
            $(this).addClass("active");
            $(this).siblings().removeClass("active");
            var value = $(this).attr("data-value");
            ajaxStatus(value);
        })
        //关闭按钮变换
        $('#batchClose').on('mouseenter', function () {
            $(this).addClass('s-updownBg s-dels4').removeClass('fa fa-times')
        })
        $('#batchClose').on('mouseleave', function () {
            $(this).addClass('fa fa-times').removeClass('s-updownBg s-dels4')
        });

        //查询列表
        var quoObj = {
            /*
             * @filter 获取报价单列表
             */
            filter: function (_obj) {
                var obj = pageObj;
                if(typeof _obj === 'object'){
                    obj = $.extend({}, pageObj, _obj);
                }
                $.ajax({
                    url: Base.sitUrl + '/api/task/v1/task/list',
                    type: 'POST',
                    dataType: 'json',
                    data: obj,
                    beforeSend: function (XHR) {
                        $.BlockUI();
                    },
                    complete: function (XHR, TS) {
                        $.UnblockUI();
                    },
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var data = res.data.results,
                            html = '';
                        if (data.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                var time = new Date(data[i].createTime).format("yyyy-MM-dd hh:mm:ss");
                                var status = "";
                                var SH = "";
                                var HS = "";
                                var del = '';
                                var _del = '';
                                if (data[i].status == 1) {
                                    status = '未完成';
                                    SH = 'none';
                                    HS = 'inline-block'
                                } else if (data[i].status == 2) {
                                    status = '已超时';
                                    SH = 'none';
                                    HS = 'inline-block';
                                } else if (data[i].status == 3) {
                                    status = '已完成';
                                    SH = 'inline-block';
                                    HS = 'none';
                                    del = '<del>';
                                    _del = '</del>';
                                } else {
                                    status = '未知';
                                    SH = 'none';
                                    HS = 'inline-block'
                                }
                                if (data[i].executionTime !== '' && data[i].executionTime !== null) {
                                    if ($.GetLength(data[i].executionTime) > 26) {
                                        data[i].executionTime = data[i].executionTime.substring(0, 12) + '...'
                                    } else {
                                        data[i].executionTime = data[i].executionTime
                                    }
                                }
                                if (data[i].name !== '' && data[i].name !== null) {
                                    if (data[i].name.length > 26) {
                                        data[i].name = data[i].name.substring(0, 23) + '...'
                                    } else {
                                        data[i].name = data[i].name
                                    }
                                }
                                if (data[i].customerName !== '' && data[i].customerName !== null) {
                                    if (data[i].customerName.length > 20) {
                                        data[i].customerName = data[i].customerName.substring(0, 19) + '...'
                                    }
                                }
                                if (data[i].principalName !== '' && data[i].principalName !== null) {
                                    if (data[i].principalName.length > 20) {
                                        data[i].principalName = data[i].principalName.substring(0, 19) + '...'
                                    }
                                }
                                html += '<tr data-id="' + data[i].id + '">' +
                                    '<td><div class="checker"><span><input name="batch" type="checkbox" data-id="' + data[i].id + '"></span></div></td>' +
                                    '<td><label><i class="complete" style="display:' + SH + '"></i><span class="overtime" style="display:' + HS + '"></span></label> <label class="executionTime createTime">' + del + data[i].executionTime + _del + '</label></td>' +
                                    '<td><a href="pop-detail.html?taskId=' + data[i].id + '&v=' + window.ver + '" data-maintab><label class="description">' + del + testNull(data[i].name) + _del + '</label></a></td>' +
                                    '<td><label class="customerName">' + testNull(data[i].customerName) + '</label></td>' +
                                    '<td><label class="principalName">' + testNull(data[i].principalName) + '</label></td>' +
                                    '<td><label class="status">' + status + '</label></td>' +
                                    '</tr>'
                            }
                            $('.page_info>table>tbody').empty().append(html);

                            var total = res.data.totalItem,
                                ps = pageObj.pageSize,
                                all = Math.ceil(total / ps);
                            pageObj.lastpage = all;
                            $.Page({
                                total: total,
                                _class: '.page',
                                nowNum: pageObj.currentPage,
                                allNum: all,
                                callback: function (now, all) {
                                    pageObj.currentPage = now;
                                    quoObj.filter(_obj);
                                }
                            });
                        } else {
                            var none = '<div class="trNone">' +
                                '<div class="trnone-info">' +
                                '<img src="../images/empty-task.png" alt="" />' +
                                '<p class="trnone-text">暂无任务</p>'+
                                '</div>' +
                                '<a href="pop-task.html" class="trnone-btn btn btn-primary" data-code="task_add" data-maintab></i><span>创建任务</span></a>'+
                                '</div>';
                            $('.page_info>table').after(none);
                        }
                    }
                });
            }
        };

        quoObj.filter();

        //获取负责人列表
        $.ajax({
            url: Base.sitUrl + '/api/customer/v1/underling/customer',
            type: 'POST',
            dataType: 'json',
            success: function (result) {
                if (!result.success) {
                    $.Alert(result.message);
                    return;
                }

                var data = result.data;
                var li = '', list = '';
                for (var i = 0; i < data.length; i++) {
                    li += '<option data-id="' + data[i].id + '">' + data[i].name + '</option>';
                    list += '<li data-id="' + data[i].id + '">' + data[i].name + '</li>';
                }
                var none = '<option data-id="">请选择负责人</option>';
                $("#headName").empty();
                $("#headName").append(none);
                $("#headName").append(li);
                $('.modal-body>ul').empty().append(list)
            }
        });
        $('#btn-underling').on('click', function (e) {
            if ($(this).hasClass('on')) {
                $.EventFn(e);
                quoObj.filter();
                $('#btn-underling-pop').hide();
                $(this).removeClass('on').attr({'data-toggle': 'modal', 'data-target': '#myModal'});
            }
        })
        //下属
        $('.modal-body>ul').on('click', '>li', function () {
            var id = $(this).attr('data-id')
            var name = $(this).text();
            $('#btn-underling').attr({'data-toggle': '', 'data-target': ''}).addClass('on');
            $('#btn-underling-pop').text(name).attr('data-id', id).show();
            $('#underling-close').click();
            var obj = $.extend({}, pageObj, {id: id});
            quoObj.filter(obj);
        });

        //客户名称
        $("#targetName").on('keyup', function () {
            if (event.keyCode == 13) {
                var obj = {customerName: $("#targetName").val()};
                pageObj.currentPage = 1;
                quoObj.filter(obj);
            }
        });
        //状态查询
        $("#taskStatus").on('click', function () {
            var value = $(this).val();
            ajaxStatus(value);
        });
        function ajaxStatus(value) {
            var obj = {};
            obj.status = value;
            pageObj.currentPage = 1;
            quoObj.filter(obj);
        }

        //负责人查询
        $("#headName").unbind('change').on('change', function () {
            var value = $(this).val();
            if (value == '请选择负责人') {
                value = ''
            }
            var obj = {};
            obj.principalName = value;
            pageObj.currentPage = 1;
            quoObj.filter(obj);
        })
        //任务时间查询
        $("#timeNumTask,#timeListTask").on('change', function () {
            var obj = {};
            obj.executionTime= $("#timeNumTask").val();
            obj.executionType= $("#timeListTask option:selected").val();
            pageObj.currentPage = 1;
            quoObj.filter(obj);
        });
        //创建时间查询
        $("#timeNum,#timeList").on('change', function () {
            var obj = {};
            obj.createTime = $("#timeNum").val();
            obj.type = $("#timeList option:selected").val();
            pageObj.currentPage = 1;
            quoObj.filter(obj);
        })
        //任务名称查询
        $("#inputQuick,#taskName").on('keyup', function () {
            var inputQuick = $("#inputQuick").val() || $("#taskName").val();
            if ($('#btn-underling-pop').css('display') != 'none') {
                pageObj.id = id;
            }
            if (event.keyCode == 13) {
                var obj = {};
                obj.name = inputQuick;
                pageObj.currentPage = 1;
                quoObj.filter(obj);
            }
        });
        //删除
        $("#del").on('click', function () {
            var ids = getAllChecked();
            if (ids == "") {
                $.Alert("请选择删除对象!");
            } else {
                $.Confirm("确认删除？", "", function () {
                    $.ajax({
                        url: Base.sitUrl + '/api/task/v1/task/delete',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            ids: ids
                        },
                        success: function (result) {
                            if (!result.success) {
                                $.Alert(result.message);
                                return;
                            }
                            ;
                            $('.page_info .table tbody td input[type=checkbox]:checked').each(function () {
                                $(this).parents("tr").remove();
                            });
                        }
                    });
                });
            }
        });
        //字段空值
        function testNull(test) {
            if (test == null) {
                return "";
            } else {
                return test;
            }
        }

        //完成任务
        $(document).on('click', '.overtime', function (e) {
            $.EventFn(e);
            var id = $(this).parents("tr").attr("data-id");
            $.ajax({
                url: Base.sitUrl + '/api/task/v1/task/sign',
                type: 'POST',
                dataType: 'json',
                data: {
                    id: id,
                    status: 3
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }

                    quoObj.filter();
                }
            });
        });
        //取消完成任务
        $(document).on('click', '.complete', function (e) {
            $.EventFn(e);
            var id = $(this).parents("tr").attr("data-id");
            $.ajax({
                url: Base.sitUrl + '/api/task/v1/task/sign',
                type: 'POST',
                dataType: 'json',
                data: {
                    id: id,
                    status: 1
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }

                    quoObj.filter();
                }
            });
        });

        //标记
        $('#tag').on('click', function () {
            $('#tags').addClass('active');
            $('#tags').siblings('.modals').removeClass('active');
        });

        //  选择标记
        $('#selTag').on('click', '>li', function () {
            var status = $(this).attr('data-value');
            var ids = getAllChecked();
            if (ids == "") {
                $.Alert("请选择人员")
            } else {
                $.ajax({
                    url: Base.sitUrl + '/api/task/v1/task/sign',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        id: ids,
                        status: status
                    },
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }

                        $('#tags').removeClass('active');
                        $('#uniform-all').find('span').removeClass('checked');
                        $('#uniform-all').find('input[type=checkbox]').attr('checked', false);
                        quoObj.filter();
                    }
                });
            }
        });

        //  关闭
        $('.mclose,#btn-del-no').on('click', function () {
            $(this).closest('.modals').removeClass('active');
            headArr = [];
            headObj = {};
            $('#distrib').val('');
            $('#btn-distrib').hide();
        });
        // 所有选中任务id
        function getAllChecked() {
            var ids = "";
            $('.page_info .table tbody td input[type=checkbox]:checked').each(function () {
                var _id = $(this).attr('data-id');
                ids += _id + ';';
            });
            ids = ids.substring(0, ids.length - 1);
            return ids;
        }

        //任务列表类型切换
        $(".btn-group .btn").on('click', function () {
            $(this).removeClass("active");
            $(this).siblings().addClass("active");
        });
        $(document).on('click', 'tbody tr td', function () {
            var a = $(this).find("div.checker");
            if (a.length == 1) {
                return;
            } else {
                $(this).parent().find(".description").click();
            }
        });
        //联系人
        $("#sortsTime").on('click', function () {
            var timeArr = new Array();
            var trNum = $(".table tbody tr");
            var time = "";
            for (var i = 0; i < trNum.length; i++) {
                var taskTime = $(".table tbody tr").eq(i).find(".createTime").text();
                var timeNum = Date.parse(taskTime);
                time += timeNum + $(".table tbody tr").eq(i).attr("data-id") + ",";
            }
            time = time.substring(0, time.length - 1);
            timeArr = time.split(",");

            timeArr = timeArr.sort(function (a, b) {
                return a - b
            });
            var trList;
            if ($(this).attr("id") == "sortsTime") {//时间筛选
                $("#sortsTime").find(".s-orderList").addClass("s-reorderList");
                $("#sortsTime").find(".s-reorderList").removeClass("s-orderList");
                if ($("#sortsTime").attr("class") == "up") {
                    $("#sortsTime").find(".s-reorderList").addClass("s-orderList");
                    $("#sortsTime").find(".s-orderList").removeClass("s-reorderList");
                    $("#sortsTime").removeClass("up");
                    for (var i = 0; i < trNum.length; i++) {
                        for (var j = 0; j < trNum.length; j++) {
                            var timeId = timeArr[i].substring(13, timeArr[i].length);
                            if ($(".table tbody tr").eq(j).attr("data-id") == timeId) {
                                trList += '<tr data-id="' + $(".table tbody tr").eq(j).attr("data-id") + '">' + $(".table tbody tr").eq(j).html() + '</tr>';
                            }
                        }
                    }
                    $(".table tbody").empty().append(trList);
                } else if ($("#sortsTime").attr("class") == "" || $("#sortsTime").attr("class") == undefined) {
                    $("#sortsTime").addClass("up");
                    var trLength = trNum.length;
                    for (var i = 0; i < trLength; i++) {
                        for (var j = 0; j < trLength; j++) {
                            var x = trLength - i;
                            var timeId = timeArr[x - 1].substring(13, timeArr[x - 1].length);
                            if ($(".table tbody tr").eq(j).attr("data-id") == timeId) {
                                trList += '<tr data-id="' + $(".table tbody tr").eq(j).attr("data-id") + '">' + $(".table tbody tr").eq(j).html() + '</tr>';
                            }
                        }
                    }
                    $(".table tbody").empty().append(trList);
                }
            }
        });
        //展示切换
        $('#taskList').bind('click', function () {
            window.location.href = Base.url + '/html/crm-task.html' + "?&v=" + window.ver;
        })
        $('#taskCalendar').bind('click', function () {
            window.location.href = Base.url + '/html/pop-task-calendar.html' + "?&v=" + window.ver;
        })
    });
});
/* !
 *  用于任务日历
 */
require([ 'common' ], function () {
    require(['maintab', 'blockUI',  'jqueryUI', 'calendar'], function (maintab, fullCalendar) {
        maintab.init();
        //获取任务
        function task(year, month) {
            var listJson = '';
            $.ajax({
                url: Base.sitUrl + '/api/task/v1/task/list',
                type: 'GET',
                dataType: 'json',
                async: false,
                data: {
                    viewType: 1,
                    year: year,
                    month: month
                },
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
                            if (data[i].status == 1) {
                                var color = '#ffdfb6'
                                var textColor = '#946b1d'
                            } else if (data[i].status == 2) {
                                var color = '#ffdedc'
                                var textColor = '#da0000'
                            } else if (data[i].status == 3) {
                                var color = '#d3f1c4'
                                var textColor = '#179e01'
                            }
                            if (data[i].executionTime.substring(0, 1) == '2') {
                                listJson += '{title:"' + data[i].name +
                                    '",start:"' + data[i].executionTime.substring(0, 10) +
                                    '",principalName:"' + data[i].principalName +
                                    '",createUserName:"' + data[i].createUserName +
                                    '",executionTime:"' + data[i].executionTime +
                                    '",customerName:"' + data[i].customerName +
                                    '",id:"' + data[i].id +
                                    '",color:"' + color +
                                    '",textColor:"' + textColor +
                                    '"}' + ','
                            } else if (data[i].dates !== null && data[i].dates !== '') {
                                for (var j = 0; j < data[i].dates.length; j++) {
                                    listJson += '{title:"' + data[i].name +
                                        '",start:"' + data[i].dates[j] +
                                        '",principalName:"' + data[i].principalName +
                                        '",createUserName:"' + data[i].createUserName +
                                        '",executionTime:"' + data[i].executionTime +
                                        '",customerName:"' + data[i].customerName +
                                        '",id:"' + data[i].id +
                                        '",color:"' + color +
                                        '",textColor:"' + textColor +
                                        '"}' + ','
                                }
                            }
                        }
                        listJson = listJson.substring(0, listJson.length - 1);
                        listJson = '[' + listJson + ']';
                    }
                }
            });
            return eval("(" + listJson + ")");
        }

        var thisYear = new Date().getFullYear();
        var thisMonth = new Date().getMonth() + 1;
        var Month = new Date().getMonth();
        var eventsJson = task(thisYear, thisMonth);

        function calendar(eventsData, year, month) {//日历初始化
            $('#calendar').fullCalendar({
                header: {
                    left: 'prev',
                    center: 'title',
                    right: 'next'
                },
                weekMode: 'liquid',
                firstDay: 0,
                year: year,
                month: month,
                events: eventsData,
                eventClick: function (event, jsEvent, view, e) {
                    $.EventFn(e);
                    var e = e || window.event;
                    var x = e.clientX - 200;
                    var y = e.clientY + 15;
                    if (x < 0) {
                        x = 10;
                    }
                    $('#card').attr('data-id', event.id);
                    $('#cardTitle').text(event.title);
                    $('#cardtime').text(event.executionTime);
                    $('#cardprincipalName').text(event.principalName);
                    $('#cardcreateUserName').text(event.createUserName);
                    $('#customerName').text(event.customerName);
                    $('#card').css('top', y);
                    $('#card').css('left', x);
                    $('#card').show();
                },
                // events: './js/json.php',
                dayClick: function (date, allDay, jsEvent, view) {
                    var selDate = $.fullCalendar.formatDate(date, 'yyyy-MM-dd hh:mm:ss');
                    $('#card').hide();
                    maintab.showTab(Base.url + '/html/pop-task.html?taskType=1&dateTime=' + selDate + "&v=" + window.ver, '新建任务');
                }
            });
            $.disNone = function () {
            }
            $.disBlock = function () {
            }
            //展示切换
            $('#taskList').bind('click', function () {
                window.location.href = Base.url + '/html/crm-task.html' + "?&v=" + window.ver;
            })
            $('#taskCalendar').bind('click', function () {
                window.location.href = Base.url + '/html/pop-task-calendar.html' + "?&v=" + window.ver;
            })
        };
        //隐藏卡片
        $('body').click(function (e) {
            $.EventFn(e);
            $('#card').hide();
        });
        $('#addTask').bind('click', function () {
            $('#card').hide();
        })
        $('#card').bind('click', function (e) {
            $.EventFn(e);
            $('#card').show();
        })
        //任务详情
        $('#more').bind('click', function (e) {
            $.EventFn(e);
            var taskId = $('#card').attr('data-id');
            $('#cardTitle').text('');
            $('#cardtime').text('');
            $('#cardprincipalName').text('');
            $('#cardcreateUserName').text('');
            $('#card').hide();
            maintab.showTab(Base.url + '/html/pop-detail.html?taskId=' + taskId + "&v=" + window.ver, '任务详情');
            // $.ajax({
            //     url:Base.sitUrl + '/api/task/v1/task/delete',
            //     type:'POST',
            //     dataType:'json',
            //     data:{
            //         ids:taskId
            //     },
            //     success:function(result){
            //         if(result.success){
            //             $('#cardTitle').text('');
            //             $('#cardtime').text('');
            //             $('#cardprincipalName').text('');
            //             $('#cardcreateUserName').text('');
            //             $('#card').hide();
            //             window.location.reload();
            //         }else{
            //             $.Alert(result.message);
            //         }
            //     }
            // });
        })
        //修改任务
        $('#edit').bind('click', function (e) {
            $.EventFn(e);
            $('#card').hide();
            var taskId = $('#card').attr('data-id');
            maintab.showTab(Base.url + '/html/pop-task.html?taskId=' + taskId + "&v=" + window.ver, '修改任务');
        })
        calendar(eventsJson, thisYear, Month);
        //周期任务
        $(document).find('.fc-header-left').unbind('click').on('click', function () {
            var date = $('.fc-header-center').find('h2').text();
            var year = date.substring(0, 4);
            var month = date.substring(5, 7);
            year = parseInt(year);
            month = parseInt(month);
            eventsData = task(year, month);
            $("#calendar").fullCalendar('removeEvents');
            $("#calendar").fullCalendar('addEventSource', eventsData);
        })
        $(document).find('.fc-header-right').unbind('click').on('click', function () {
            var date = $('.fc-header-center').find('h2').text();
            var year = date.substring(0, 4);
            var month = date.substring(5, 7);
            year = parseInt(year);
            month = parseInt(month);
            eventsData = task(year, month);
            $("#calendar").fullCalendar('removeEvents');
            $("#calendar").fullCalendar('addEventSource', eventsData);
        })
        $.reTask = function () {
            var date = $('.fc-header-center').find('h2').text();
            var year = date.substring(0, 4);
            var month = date.substring(5, 7);
            year = parseInt(year);
            month = parseInt(month);
            eventsData = task(year, month);
            $("#calendar").fullCalendar('removeEvents');
            $("#calendar").fullCalendar('addEventSource', eventsData);
        }
    });
});
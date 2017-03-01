require([ 'common' ], function () {
    require([ 'maintab', 'blockUI', 'selectPick'], function (maintab) {
        $(".i-alert", parent.document).css("right", "40px");
        maintab.init();
        //字段空值
        function testNull(test) {
            if (test == null) {
                return "";
            } else {
                return test;
            }
        }

        //漏斗图
        function map() {
            var chartSales = echarts.init(document.getElementById('sales'));
            var chartDev = echarts.init(document.getElementById('dev'));
            $.ajax({
                url: Base.sitUrl + '/api/home/v1/edm/situation',
                type: 'GET',
                dataType: 'json',
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

                    var data = res.data;
                    if (data.sendNum < 1) {
                        var img = '<img src="../images/edmNone.png" style="position:absolute;margin-left:-76px;margin-top:-76px;top:50%;left:50%">'
                        $("#dev").empty();
                        $("#dev").append(img);
                    } else {
                        var optionDev = {
                            tooltip: {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c}"
                            },
                            legend: {
                                top: 10,
                                data: ['营销发送条数', '营销送达条数', '营销']
                            },
                            calculable: true,
                            series: [
                                {
                                    name: '漏斗图',
                                    type: 'funnel',
                                    top: 60,
                                    //x2: 80,
                                    bottom: 60,
                                    width: '80%',
                                    // height: {totalHeight} - y - y2,
                                    min: 0,
                                    max: data.sendNum,
                                    minSize: '1%',
                                    maxSize: '80%',
                                    sort: 'descending',
                                    gap: 2,
                                    label: {
                                        normal: {
                                            show: true,
                                            position: 'left'
                                        },
                                        emphasis: {
                                            textStyle: {
                                                fontSize: 20
                                            }
                                        }
                                    },
                                    labelLine: {
                                        normal: {
                                            length: 10,
                                            lineStyle: {
                                                width: 1,
                                                type: 'solid'
                                            }
                                        }
                                    },
                                    itemStyle: {
                                        normal: {
                                            borderColor: '#fff',
                                            borderWidth: 1
                                        }
                                    },
                                    data: [
                                        {value: data.openNum, name: '营销打开条数'},
                                        {value: data.deliveryNum, name: '营销送达条数'},
                                        {value: data.sendNum, name: '营销发送条数'}
                                    ]
                                }
                            ]
                        };
                        chartDev.setOption(optionDev);
                    }
                }
            })
            $.ajax({
                url: Base.sitUrl + '/api/home/v1/sales/funnel',
                type: 'GET',
                dataType: 'json',
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

                    var data = res.data;
                    if (data.length < 1) {
                        var img = '<img src="../images/statusNone.png" style="position:absolute;margin-left:-76px;margin-top:-76px;top:50%;left:50%">'
                        $("#sales").empty();
                        $("#sales").append(img);
                    } else {
                        var nameArr = new Array();
                        var numArr = new Array();
                        var dataArr = new Array();
                        for (var i = 0; i < data.length; i++) {
                            var option = {
                                value: data[i].num,
                                name: testNull(data[i].name)
                            }
                            var num = data[i].num;
                            numArr.push(num)
                            dataArr.push(option)
                            nameArr.push(name)
                        }
                        var max = Math.max.apply(null, numArr)
                        var optionSales = {
                            tooltip: {
                                trigger: 'item',
                                formatter: "{a} <br/>{b} : {c}"
                            },
                            legend: {
                                top: 10,
                                data: nameArr
                            },
                            calculable: true,
                            series: [
                                {
                                    name: '漏斗图',
                                    type: 'funnel',
                                    top: 60,
                                    bottom: 60,
                                    width: '72%',
                                    min: 0,
                                    max: max,
                                    minSize: '1%',
                                    maxSize: '80%',
                                    sort: 'descending',
                                    gap: 2,
                                    label: {
                                        normal: {
                                            show: true,
                                            position: 'left'
                                        },
                                        emphasis: {
                                            textStyle: {
                                                fontSize: 20
                                            }
                                        }
                                    },
                                    labelLine: {
                                        normal: {
                                            length: 20,
                                            lineStyle: {
                                                width: 1,
                                                type: 'solid'
                                            }
                                        }
                                    },
                                    itemStyle: {
                                        normal: {
                                            borderColor: '#fff',
                                            borderWidth: 1
                                        }
                                    },
                                    data: dataArr
                                }
                            ]
                        };
                        chartSales.setOption(optionSales);
                    }
                }
            })
        }

        //待完成任务
        function task() {
            $.ajax({
                url: Base.sitUrl + '/api/home/v1/pending/task/list',
                type: 'GET',
                dataType: 'json',
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
                    var data = res.data;
                    var liLength;
                    var html = "";
                    if (data.length > 5) {
                        liLength = 6
                    } else {
                        liLength = data.length
                    }
                    if (data.length < 1) {
                        var img = '<img src="../images/taskNone.png" style="position:absolute;margin-left:-76px;margin-top:-76px;top:50%;left:50%">'
                        $("#task").empty();
                        $("#task").append(img);
                    } else {
                        for (var i = 0; i < liLength; i++) {
                            html += '<li data-id="' + data[i].id + '">' +
                                '<div class="contLeft">' +
                                '<i class="clock"></i>' +
                                '<span>' + data[i].executionTime + '</span>' +
                                '</div>' +
                                '<div class="contRight">' +
                                '<p>' + testNull(data[i].name) + '</p>' +
                                '<a style="width:100%">' + testNull(data[i].description) + '</a>' +
                                '</div>' +
                                '</li>';
                        }
                        $("#task").empty();
                        $("#task").append(html);
                    }
                }
            })
        }

        //待完成任务详情
        $('#task').on('click', '>li', function () {
            var id = $(this).attr('data-id');
            var name = $(this).find('.contRight').text();
            maintab.showTab(Base.sitUrl + '/html/pop-detail.html?taskId=' + id, name)
        })
        //最新客户动态
        function cust() {
            $.ajax({
                url: Base.sitUrl + '/api/home/v1/new/customer/dynamics',
                type: 'GET',
                dataType: 'json',
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

                    var data = res.data;
                    var liLength;
                    var html = "";
                    if (data.length > 5) {
                        liLength = 6
                    } else {
                        liLength = data.length
                    }
                    if (data.length < 1) {
                        var img = '<img src="../images/custNone.png" style="position:absolute;margin-left:-76px;margin-top:-76px;top:50%;left:50%">'
                        $("#cust").empty().append(img);
                    } else {
                        for (var i = 0; i < liLength; i++) {
                            if (data[i].customerName !== '' && data[i].customerName !== null) {
                                if (data[i].customerName.length > 20) {
                                    var name = data[i].customerName.substring(0, 19) + '...'
                                } else {
                                    var name = data[i].customerName
                                }
                            }
                            html += '<li data-contentType="' + data[i].contentType + '" data-customerId="' + data[i].customerId + '" data-contactId="' + data[i].customerContactsId + '" data-relationId="' + data[i].relationId + '">' +
                                '<div class="contLeft">' +
                                '<p class="blue" title="' + data[i].customerName + '">' + testNull(name) + '</p>' +
                                '<p><i class="clock"></i><span>' + data[i].createTime + '</span></p>' +
                                '</div>' +
                                '<div class="contRight">' +
                                '<p><span>' + testNull(data[i].createUserName) + '</span>&nbsp;&nbsp;&nbsp;<span>' + testNull(data[i].relationName) + '</span></p>' +
                                '<a class="blue">' + testNull(data[i].content) + '</a>' +
                                '</div>' +
                                '</li>';
                        }
                        $("#cust").empty();
                        $("#cust").append(html);
                    }
                }
            })
        }

        $('#cust').on('click', '>li', function () {
            var id = $(this).attr('data-customerId');
            if(id>0){
                maintab.showTab(Base.sitUrl + '/html/pop-customer-detail.html?id=' + id,'客户详情')
            }
        })
        //本月新客户
        function newCust() {
            $.ajax({
                url: Base.sitUrl + '/api/home/v1/new/customer',
                type: 'GET',
                dataType: 'json',
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

                    var data = res.data;
                    $("#newCust").text(data.count);
                    $("#newCustP").text(data.subCount);
                }
            })
        }

        //本月新联系人
        function newCon() {
            $.ajax({
                url: Base.sitUrl + '/api/home/v1/new/contacts',
                type: 'GET',
                dataType: 'json',
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

                    var data = res.data;
                    $("#newCon").text(data.count);
                    $("#newConP").text(data.subCount);
                }
            })
        }

        //本月新邮件
        function newEmail() {
            $.ajax({
                url: Base.sitUrl + '/api/home/v1/new/email',
                type: 'GET',
                dataType: 'json',
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

                    $("#newEmail").text(res.data);
                }
            })
        }

        function getNowFormatDate(_timezone) {
            var day = new Date();
            var getStand = day.getTime() + (day.getTimezoneOffset() * 60000) + Number(_timezone) * 60 * 60000;//标准时区的时间
            day = new Date(getStand);
            var Year = 0;
            var Month = 0;
            var Day = 0;
            var CurrentDate = "";
            //初始化时间
            Year = day.getFullYear();//ie火狐下都可以
            Month = day.getMonth() + 1;
            Day = day.getDate();
            Hour = day.getHours();
            Minute = day.getMinutes();
            Second = day.getSeconds();
            CurrentDate += Year + "年";
            if (Month >= 10) {
                CurrentDate += Month + "月";
            }
            else {
                CurrentDate += "0" + Month + "月";
            }
            if (Day >= 10) {
                CurrentDate += Day + "日";
            }
            else {
                CurrentDate += "0" + Day + "日";
            }
            return CurrentDate;
        }

        function startTime(_timezone) {
            var today = new Date();
            var getStand = today.getTime() + (today.getTimezoneOffset() * 60000) + Number(_timezone) * 60 * 60000;//标准时区的时间
            today = new Date(getStand);
            var h = today.getHours();
            var m = today.getMinutes();
            var s = today.getSeconds();
            // add a zero in front of numbers<10
            m = checkTime(m);
            s = checkTime(s);
            document.getElementById('newTime').innerHTML = h + ":" + m + ":" + s;
            t = setTimeout(function () {
                startTime(_timezone)
            }, 500);
        }

        function checkTime(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }

        function time() {
            var time = new Date();
            $("#newDate").text(getNowFormatDate(8));
        }

        //页面跳转
        $('.card1').bind('click', function () {
            $(window.parent.document).find('#sideMenu').find('li').removeClass('active');
            $(window.parent.document).find('#sideMenu').children('li').eq(3).addClass('active').find('li').eq(0).addClass('active');
            window.location.href = '/html/crm-customer.html' + "?&v=" + window.ver;
        })
        $('.card2').bind('click', function () {
            $(window.parent.document).find('#sideMenu').find('li').removeClass('active');
            $(window.parent.document).find('#sideMenu').children('li').eq(3).addClass('active').find('li').eq(1).addClass('active');
            window.location.href = '/html/crm-contacts.html' + "?&v=" + window.ver;
        })
        $('.card3').bind('click', function () {
            $(window.parent.document).find('#sideMenu').find('li').removeClass('active');
            $(window.parent.document).find('#sideMenu').children('li').eq(2).addClass('active').find('li').eq(1).addClass('active');
            window.location.href = '/html/email-inbox.html' + "?&v=" + window.ver;
        });

        $(".check-time").selectpick({
            container: '#check-time',
            onSelect: function (value, text) {
                //alert("这是回调函数，选中的值："+value+" \n选中的下拉框文本："+text);
                clearTimeout(t);
                startTime($('.check-time').val());
                getNowFormatDate($('.check-time').val());
            }
        });

        //页面起始
        newCust();
        newCon();
        newEmail();
        time();
        task();
        cust();
        map();
        startTime(8);
    });
});

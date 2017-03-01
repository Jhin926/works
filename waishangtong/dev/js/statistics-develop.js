require([ 'common' ], function () {
    require(['maintab', 'blockUI', 'jqform'], function (maintab) {
        var nowYear = new Date().getFullYear();
        //年月
        function dateTime() {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth();
            var htmlYaer = '';
            var htmlMonth = '';
            for (var i = 2000; i <= year; i++) {
                htmlYaer += '<option value=' + i + '>' + i + '年</option>'
            }
            for (var i = 1; i < 13; i++) {
                htmlMonth += '<option value="' + i + '">' + i + '月</option>'
            }
            $(".years").empty();
            $(".years").append(htmlYaer);
            $(".years").find('option[value=' + year + ']').attr('selected', true);
            $(".month").empty();
            $(".month").append('<option value="0">全部</option>');
            $(".month").append(htmlMonth);
        }

        //图表/列表
        function chartData1(year, month) {
            var dataJson;
            $.ajax({
                url: Base.sitUrl + '/api/edm/v1/marketing/statistics',
                type: 'POST',
                dataType: 'json',
                async: false,
                data: {
                    year: year,
                    month: month
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    dataJson = res.data;
                }
            });
            return dataJson;
        }

        var chartDataJson1 = chartData1(nowYear, 0);
        //营销信数
        function devNum(chartDataJson1) {
            if (chartDataJson1 == null) {
                $("#sendNum").text('0');
                $("#deliveryNum").text('0');
                $("#openNum").text('0');
                $("#replyNum").text('0');
            } else {
                $("#sendNum").text(chartDataJson1.sendNum);
                $("#deliveryNum").text(chartDataJson1.deliveryNum);
                $("#openNum").text(chartDataJson1.openNum);
                $("#replyNum").text(chartDataJson1.replyNum);
            }
        }

        //  分页
        var pageObj = {
            homepage: 1,
            currentPage: 1,
            lastpage: null,
            pageSize: 10
        };
        function chart1(chartDataJson1) {
            if (chartDataJson1 == null) {
                var none = '<img src="../../images/statisticsNone.png">';
                $("#chart1").empty();
                $("#chart1").append(none);
            } else {
                var sendNum = chartDataJson1.sendNum;
                var deliveryNum = chartDataJson1.deliveryNum;
                var openNum = chartDataJson1.openNum;
                var myChart = echarts.init(document.getElementById('chart1'));
                var option = {
                    tooltip: {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c}"
                    },
                    legend: {
                        data: ['营销发送条数', '营销送达数', '营销打开数']
                    },
                    calculable: true,
                    series: [
                        {
                            name: '漏斗图',
                            type: 'funnel',
                            left: '10%',
                            top: 60,
                            //x2: 80,
                            bottom: 60,
                            width: '80%',
                            // height: {totalHeight} - y - y2,
                            min: 0,
                            max: sendNum,
                            minSize: '1%',
                            maxSize: '80%',
                            sort: 'descending',
                            gap: 2,
                            label: {
                                normal: {
                                    show: true,
                                    position: 'right'
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
                                {value: sendNum, name: '营销发送条数'},
                                {value: deliveryNum, name: '营销送达数'},
                                {value: openNum, name: '营销打开数'}
                            ]
                        }
                    ]
                };
                myChart.setOption(option);
            }
        }

        function chartTable() {
            $.ajax({
                url: Base.sitUrl + '/api/edm/v1/open/sort',
                type: 'GET',
                dataType: 'json',
                success: function (res) {
                    var data = res.data;
                    if (data == '') {
                        var none = '<img src="../../images/statisticsNone.png">';
                        $(".chartTable").empty();
                        $(".chartTable").append(none);
                    } else {
                        var html = '';
                        for (var i = 0; i < data.length; i++) {
                            var iNum = i + 1;
                            html += '<li>' +
                                '<span class="circleTop">' + iNum + '</span>' +
                                '<span>' + data[i].name + '</span>' +
                                '<span class="moneyTop">' + data[i].count + '</span>' +
                                '</li>';
                        }
                        $(".chartTable").empty();
                        $(".chartTable").append(html);
                        if (data.length > 4) {
                            $("#down").show();
                        }
                    }
                }
            })

        }

        //图表列表
        $('#up a').bind('click', function () {
            $(this).parents(".bodyRight").find('ul li').eq(0).animate({
                marginTop: '+=48px'
            });
            $("#down").show();
            if ($(this).parents(".bodyRight").find('ul li').eq(0).css("marginTop") == '-48px') {
                $(this).parent().hide();
            }
        });
        $('#down a').bind('click', function () {
            $(this).parents(".bodyRight").find('ul li').eq(0).animate({
                marginTop: '-=48px'
            });
            $("#up").show();
            var top = '-' + (chartDataJson.length - 6) * 48 + 'px';
            if ($(this).parents(".bodyRight").find('ul li').eq(0).css("marginTop") == top) {
                $(this).parent().hide();
            }
        })
        //数据获取
        function chartData(year, month) {
            var dataJson = {
                year: year,
                month: month
            };
            $.ajax({
                url: Base.sitUrl + '/api/edm/v1/marketing/statistics',
                type: 'POST',
                dataType: 'json',
                async: false,
                data: {
                    data: JSON.stringify(dataJson)
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    var chartDataJson1 = res.data;
                    chart1(chartDataJson1);
                    devNum(chartDataJson1);
                }
            });
        }

        //营销发送数
        function devSendNum(year, month) {
            $.ajax({
                url: Base.sitUrl + '/api/edm/v1/send/statistics',
                type: 'POST',
                dataType: 'json',
                data: {
                    year: year,
                    month: month
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return
                    }
                    ;
                    var data = res.data;
                    if (data == '') {
                        var none = '<img src="../../images/statisticsNone.png">';
                        $("#chart2").empty();
                        $("#chart2").append(none);
                    } else {
                        var dataTime = new Array();
                        for (var i = 0; i < 12; i++) {
                            if (data[i] !== undefined) {
                                var time = data[i].month;
                            } else {
                                var time = '0';
                            }
                            if (time == '1' || time == '2' || time == '3' || time == '4' || time == '5' || time == '6' || time == '7' || time == '8' || time == '9' || time == '10' || time == '11' || time == '12') {
                                dataTime.push(data[i].count)
                            } else {
                                dataTime.push(0)
                            }
                        }
                        var count = new Array();
                        for (var i = 0; i < data.length; i++) {
                            count.push(data[i].customerNum);
                        }
                        if (count.length <= 12) {
                            for (var i = count.length; i < 12; i++) {
                                count.push(0)
                            }
                        }
                        var max = Math.max.apply(null, count);
                        var interval = Math.round(max * 0.2)
                        if (interval < 1) {
                            interval = 1
                        }
                        var myChart = echarts.init(document.getElementById('chart2'));
                        var option = {
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: ['营销发送数']
                            },
                            xAxis: [
                                {
                                    type: 'category',
                                    axisLabel: {
                                        interval: 0
                                    },
                                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                    name: '营销发送数',
                                    min: 0,
                                    max: max,
                                    interval: interval,
                                    axisLabel: {
                                        formatter: '{value}'
                                    }
                                }
                            ],
                            series: [
                                {
                                    name: '营销发送数',
                                    type: 'line',
                                    data: dataTime
                                }
                            ]
                        };
                        myChart.setOption(option);
                    }
                }
            })
        }

        //营销发送数.月
        function devSendNumMonth(year, month) {
            $.ajax({
                url: Base.sitUrl + '/api/edm/v1/send/statistics',
                type: 'POST',
                dataType: 'json',
                data: {
                    year: year,
                    month: month
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return
                    }
                    ;
                    var data = res.data;
                    if (data == '') {
                        var none = '<img src="../../images/statisticsNone.png">';
                        $("#chart2").empty();
                        $("#chart2").append(none);
                    } else {
                        var count = new Array();
                        var time = new Array();
                        for (var i = 0; i < data.length; i++) {
                            time.push(data[i].dateTime.substring(7, data[i].dateTime.length));
                            count.push(data[i].count);
                        }
                        var max = Math.max.apply(null, count);
                        var interval = max * 0.2;
                        var myChart = echarts.init(document.getElementById('chart2'));
                        var option = {
                            tooltip: {
                                trigger: 'axis'
                            },
                            legend: {
                                data: ['营销发送数']
                            },
                            xAxis: [
                                {
                                    type: 'category',
                                    data: time
                                }
                            ],
                            yAxis: [
                                {
                                    type: 'value',
                                    name: '营销发送数',
                                    min: 0,
                                    max: max,
                                    interval: interval,
                                    axisLabel: {
                                        formatter: '{value}'
                                    }
                                }
                            ],
                            series: [
                                {
                                    name: '营销发送数',
                                    type: 'line',
                                    data: count
                                }
                            ]
                        };
                        myChart.setOption(option);
                    }
                }
            })
        }

        //发送条数排名
        function devSendRank(year, month) {
            $.ajax({
                url: Base.sitUrl + '/api/edm/v1/send/sort',
                type: 'POST',
                dataType: 'json',
                data: {
                    year: year,
                    month: month
                },
                success: function (res) {
                    var data = res.data.results;
                    if (!res.success) {
                        $.unLogin(res);
                        return
                    }
                    ;
                    if (data == '') {
                        var none = '<img src="../../images/statisticsNone.png">';
                        $("#devSendRank .ulTop").empty();
                        $("#devSendRank .ulTop").append(none);
                    } else {
                        var html = '';
                        for (var i = 0; i < data.length; i++) {
                            var iNum = i + 1;
                            html += '<li>' +
                                '<span class="circleTop">' + iNum + '</span>' +
                                '<span>' + data[i].name + '</span>' +
                                '<span class="moneyTop">' + data[i].count + '</span>' +
                                '</li>';
                        }
                        $("#devSendRank .ulTop").empty();
                        $("#devSendRank .ulTop").append(html);
                        var pageNum = res.data.totalItem;
                        var total = pageNum,
                            cp = 1,
                            ps = pageObj.pageSize,
                            all = Math.ceil(total / ps);
                        pageObj.lastpage = all;
                        $('.i-content-wrapper').stop().animate({'scrollTop': 0}, 500);
                    }
                }
            })
        }

        //发送条数排名查询
        $("#devSendRank .years").on('change', function () {
            var year = $(this).val();
            var subyear = $("#devSendRank .month").val();
            devSendRank(year, subyear);
        })
        $("#devSendRank .month").on('change', function () {
            var subyear = $(this).val();
            var year = $("#devSendRank .years").val();
            devSendRank(year, subyear);
        })
        //开发信查询
        $("#devletterNum .years").on('change', function () {
            var year = $(this).val();
            var subyear = $("#devletterNum .month").val();
            chartData(year, subyear);
        })
        $("#devletterNum .month").on('change', function () {
            var subyear = $(this).val();
            var year = $("#devletterNum .years").val();
            chartData(year, subyear);
        })
        //营销发送查询
        $("#devSendS .years").on('change', function () {
            var year = $(this).val();
            var subyear = $("#devSendS .month").val();
            if (subyear == 0) {
                devSendNum(year, subyear);
            } else {
                devSendNumMonth(year, subyear);
            }
        })
        $("#devSendS .month").on('change', function () {
            var subyear = $(this).val();
            var year = $("#devSendS .years").val();
            if (subyear == 0) {
                devSendNum(nowYear, subyear);
            } else {
                devSendNumMonth(nowYear, subyear);
            }
        })
        dateTime();
        chart1(chartDataJson1);
        devNum(chartDataJson1);
        chartTable();
        devSendNum(nowYear, 0);
        devSendRank(nowYear, 0);
    });
});
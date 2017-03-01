require([ 'common' ], function () {
    require(['maintab', 'blockUI', 'jqform'], function (maintab) {
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
            $(".month").append('<option value="19">全部</option>');
            $(".month").append(htmlMonth);
        }

        //图表/列表
        function chartData1() {
            var dataJson;
            var data = {
                year: 2016,
                subyear: 19
            }
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/customer/number/by/status',
                type: 'POSt',
                dataType: 'json',
                async: false,
                data: {
                    data: JSON.stringify(data)
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

        var chartDataJson1 = chartData1();
        //公司客户总数
        function allNum() {
            $("#allNum").text(chartDataJson1.customerTotalNum);
        }

        //  分页
        var pageObj = {
            homepage: 1,
            currentPage: 1,
            lastpage: null,
            pageSize: 10
        };
        function chart1() {
            var data = chartDataJson1.sustomerNumberStatistics;
            var name = new Array();
            var customerStatus = new Array();
            var dataArr = new Array();
            var numArr = new Array();
            for (var i = 0; i < data.length; i++) {
                if (data[i].customerStatusName == null) {
                    data[i].customerStatusName = '无'
                }
                name.push(data[i].customerStatusName);
                customerStatus.push(data[i].customerStatus);
                numArr.push(data[i].customerNum);
                var arr = {
                    value: data[i].customerNum,
                    name: data[i].customerStatusName
                }
                dataArr.push(arr);
            }
            var max = Math.max.apply(null, numArr);
            var myChart = echarts.init(document.getElementById('chart1'));
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c}"
                },
                series: [
                    {
                        name: '客户状态',
                        type: 'funnel',
                        left: '10%',
                        top: 30,
                        //x2: 80,
                        bottom: 30,
                        width: '80%',
                        // height: {totalHeight} - y - y2,
                        min: 0,
                        max: max,
                        minSize: '1%',
                        maxSize: '100%',
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
                        data: dataArr
                    }
                ]
            };
            myChart.setOption(option);
        }

        function custStatus() {
            var html = '';
            var data = chartDataJson1.sustomerNumberStatistics;
            for (var i = 0; i < data.length; i++) {
                html += '<li class="charTableTitle">' +
                    '<span data-status="' + data[i].customerStatus + '">' + data[i].customerStatusName + '</span>' +
                    '<span>' + data[i].customerNum + '</span>' +
                    '</li>';
            }
            $("#custStatus").empty();
            $("#custStatus").append(html);
            if (data.length > 7) {
                $("#down").show();
            }
        }

        //图表列表
        $('#up a').bind('click', function () {
            $(this).parents(".bodyRight").find('ul li').eq(0).animate({
                marginTop: '+=20px'
            });
            $("#down").show();
            if ($(this).parents(".bodyRight").find('ul li').eq(0).css("marginTop") == '-20px') {
                $(this).parent().hide();
            }
        });
        $('#down a').bind('click', function () {
            $(this).parents(".bodyRight").find('ul li').eq(0).animate({
                marginTop: '-=20px'
            });
            $("#up").show();
            var top = '-' + (chartDataJson1.sustomerNumberStatistics.length - 6) * 20 + 'px';
            if ($(this).parents(".bodyRight").find('ul li').eq(0).css("marginTop") == top) {
                $(this).parent().hide();
            }
        })
        //新建客户数
        function newCust(year, subyear) {
            var data = {
                year: year,
                subyear: subyear
            }
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/customer/number/by/new',
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
                    var data = res.data;
                    var dataTime = new Array();
                    for (var i = 0; i < 12; i++) {
                        if (data[i] !== undefined) {
                            var time = data[i].dataTime.substring(5, 7);
                        } else {
                            var time = '0';
                        }
                        if (time == '01' || time == '02' || time == '03' || time == '04' || time == '05' || time == '06' || time == '07' || time == '08' || time == '09' || time == '10' || time == '11' || time == '12') {
                            dataTime.push(data[i].customerNum)
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
                    var interval = Math.round(max * 0.2);
                    if (interval < 1) {
                        interval = 1
                    }
                    var myChart = echarts.init(document.getElementById('chart2'));
                    var option = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['新建客户数']
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
                                name: '新建客户数',
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
                                name: '新建客户数',
                                type: 'line',
                                data: dataTime
                            }
                        ]
                    };
                    myChart.setOption(option);
                }
            })
        }

        //新建客户数.月
        function devSendNumMonth(year, subyear) {
            var data = {
                year: year,
                subyear: subyear
            }
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/customer/number/by/new',
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
                    var data = res.data;
                    var count = new Array();
                    var time = new Array();
                    for (var i = 0; i < data.length; i++) {
                        time.push(data[i].dataTime.substring(8, 10));
                        count.push(data[i].customerNum);
                    }
                    var max = Math.max.apply(null, count);
                    var interval = max * 0.2;
                    var myChart = echarts.init(document.getElementById('chart2'));
                    var option = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['新建客户数']
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
                                name: '新建客户数',
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
                                name: '新建客户数',
                                type: 'line',
                                data: count
                            }
                        ]
                    };
                    myChart.setOption(option);
                }
            })
        }

        //新建客户排名
        function newCustRank(year, subyear) {
            var year = year.toString();
            var subyear = subyear.toString();
            var page = pageObj.currentPage.toString();
            var pageSize = pageObj.pageSize.toString();
            var data = {year: year, subyear: subyear, currentPage: page, pageSize: pageSize};
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/customer/number/by/new/rank',
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
                    var data = res.data.results;
                    if (data.length > 0) {
                        var html = '';
                        for (var i = 0; i < data.length; i++) {
                            html += '<li>' +
                                '<span class="circleTop">' + data[i].userRank + '</span>' +
                                '<span>' + data[i].userName + '</span>' +
                                '<span class="moneyTop">' + data[i].customerNum + '</span>' +
                                '</li>';
                        }
                        $("#newCustRank").empty();
                        $("#newCustRank").append(html);
                        var pageNum = res.data.totalItem;
                        var total = pageNum,
                            cp = 1,
                            ps = pageObj.pageSize,
                            all = Math.ceil(total / ps);
                        pageObj.lastpage = all;
                        $('.i-content-wrapper').stop().animate({'scrollTop': 0}, 500);
                    } else {
                        var none = '<img src="../../images/statisticsNone.png">';
                        $("#newCustRank").empty();
                        $("#newCustRank").append(none);
                    }
                }
            })
        }

        //新建客户排名
        $("#newCustRankDev .years").on('change', function () {
            var year = $(this).val();
            var subyear = $("#newCustRankDev .month").val();
            newCustRank(year, subyear);
        })
        $("#newCustRankDev .month").on('change', function () {
            var subyear = $(this).val();
            var year = $("#newCustRankDev .years").val();
            newCustRank(year, subyear);
        })
        //新建客户数查询
        $("#devSendS .years").on('change', function () {
            var year = $(this).val();
            var subyear = $("#devSendS .month").val();
            if (subyear == 19) {
                devSendNum(nowYear, subyear);
            } else {
                devSendNumMonth(nowYear, subyear);
            }
        })
        $("#devSendS .month").on('change', function () {
            var subyear = $(this).val();
            var year = $("#devSendS .years").val();
            if (subyear == 19) {
                devSendNum(nowYear, subyear);
            } else {
                devSendNumMonth(nowYear, subyear);
            }
        })
        var nowYear = new Date().getFullYear();
        dateTime();
        allNum();
        chart1();
        custStatus();
        newCust(nowYear, 19);
        newCustRank(nowYear, 19);
    });
});
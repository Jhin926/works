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
            $(".month").append('<option value="19">全部</option>');
            $(".month").append(htmlMonth);
        }

        //数据获取
        function chartData(year, month) {
            var dataJson = {
                year: year,
                subyear: month
            };
            $.ajax({
                url: Base.sitUrl + '/api/email/v1/in/and/out/statistics',
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

                    var chartDataJson = res.data;
                    chart(chartDataJson);
                    emailNum(chartDataJson);
                    chartTable(chartDataJson);
                }
            });
        }

        //数据获取.月
        function chartDataMonth(year, month) {
            var dataJson = {
                year: year,
                subyear: month
            };
            $.ajax({
                url: Base.sitUrl + '/api/email/v1/in/and/out/statistics',
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
                    var chartDataJson = res.data;
                    chartMonth(chartDataJson);
                    emailNum(chartDataJson);
                    chartTable(chartDataJson);
                }
            });
        }

        //数据表格
        function chart(chartDataJson) {
            if (chartDataJson.trendsIn == "" && chartDataJson.trendsOut == "") {
                var none = '<img src="../../images/statisticsNone.png">';
                $("#chart").empty();
                $("#chart").append(none);
            } else {
                var dataOut = chartDataJson.trendsOut;
                var dataIn = chartDataJson.trendsIn;
                var dataTimeOut = new Array();
                var dataTimeIn = new Array();
                for (var i = 0; i < 12; i++) {
                    if (dataOut[i] !== undefined) {
                        var timeOut = dataOut[i].dataTime.substring(5, 7);
                    } else {
                        var timeOut = '0';
                    }
                    if (dataIn[i] !== undefined) {
                        var timeIn = dataIn[i].dataTime.substring(5, 7);
                    } else {
                        var timeIn = '0';
                    }
                    if (timeOut == '01' || timeOut == '02' || timeOut == '03' || timeOut == '04' || timeOut == '05' || timeOut == '06' || timeOut == '07' || timeOut == '08' || timeOut == '09' || timeOut == '10' || timeOut == '11' || timeOut == '12') {
                        dataTimeOut.push(dataOut[i].emailNum)
                    } else {
                        dataTimeOut.push(0)
                    }
                    if (timeIn == '01' || timeIn == '02' || timeIn == '03' || timeIn == '04' || timeIn == '05' || timeIn == '06' || timeIn == '07' || timeIn == '08' || timeIn == '09' || timeIn == '10' || timeIn == '11' || timeIn == '12') {
                        dataTimeIn.push(dataIn[i].emailNum)
                    } else {
                        dataTimeIn.push(0)
                    }
                }
                var trendsOutNum = new Array();
                for (var i = 0; i < dataOut.length; i++) {
                    trendsOutNum.push(dataOut[i].emailNum);
                }
                if (trendsOutNum.length <= 12) {
                    for (var i = trendsOutNum.length; i < 12; i++) {
                        trendsOutNum.push(0)
                    }
                }
                var maxOut = Math.max.apply(null, trendsOutNum);

                var trendsInNum = new Array();
                for (var i = 0; i < dataIn.length; i++) {
                    trendsInNum.push(dataIn[i].emailNum);
                }
                if (trendsInNum.length <= 12) {
                    for (var i = trendsInNum.length; i < 12; i++) {
                        trendsInNum.push(0)
                    }
                }
                var maxIn = Math.max.apply(null, trendsInNum);
                if(maxOut > maxIn){
                    var max = maxOut
                }else{
                    var max = maxIn
                }
                // var max = Math.max.apply(trendsOutNum, trendsInNum);
                max = max + Math.round(max * 0.1)
                var interval = Math.round(max * 0.2);
                if (interval < 1) {
                    interval = 1
                }
                var myChart = echarts.init(document.getElementById('chart'));
                var option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['发送数', '接受数']
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
                            name: '发送数',
                            type: 'line',
                            data: dataTimeOut
                        },
                        {
                            name: '接受数',
                            type: 'line',
                            data: dataTimeIn
                        }
                    ]
                };
                myChart.setOption(option);
            }

        }

        //数据表格.月
        function chartMonth(chartDataJson) {
            if (chartDataJson.trendsIn == "" && chartDataJson.trendsOut == "") {
                var none = '<img src="../../images/statisticsNone.png">';
                $("#chart").empty();
                $("#chart").append(none);
            } else {
                var dataOut = chartDataJson.trendsOut;
                var dataIn = chartDataJson.trendsIn;
                var dataTimeOut = new Array();
                var dataTimeIn = new Array();
                var time = new Array();
                for (var i = 0; i < dataOut.length; i++) {
                    time.push(dataOut[i].dataTime.substring(8, 10));
                    dataTimeOut.push(dataOut[i].emailNum);
                }
                for (var i = 0; i < dataIn.length; i++) {
                    time.push(dataIn[i].dataTime.substring(8, 10));
                    dataTimeIn.push(dataIn[i].emailNum);
                }
                var maxOut = Math.max.apply(null, dataTimeOut);
                var maxIn = Math.max.apply(null, dataTimeIn);
                if (maxIn >= maxOut) {
                    var max = maxIn
                } else {
                    var max = maxOut
                }
                var interval = Math.round(max * 0.2);
                var myChart = echarts.init(document.getElementById('chart'));
                var option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['发送数', '接受数']
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
                            name: '发送数',
                            type: 'line',
                            data: dataTimeOut
                        },
                        {
                            name: '接受数',
                            type: 'line',
                            data: dataTimeIn
                        }
                    ]
                };
                myChart.setOption(option);
            }

        }

        function chartTable(chartDataJson) {
            var data = chartDataJson.ranks;
            if (data == '') {
                var none = '<img src="../../images/statisticsNone.png">';
                $(".chartTable").empty();
                $(".chartTable").append(none);
            } else {
                var html = '';
                for (var i = 0; i < data.length; i++) {
                    html += '<li>' +
                        '<span class="circleTop">' + data[i].userRank + '</span>' +
                        '<span>' + data[i].userName + '</span>' +
                        '<span class="moneyTop">' + data[i].emailSendNum + '</span>' +
                        '</li>';
                }
                $(".chartTable").empty();
                $(".chartTable").append(html);
                if (data.length > 8) {
                    $("#down").show();
                }
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
            var top = '-' + (chartDataJson.length - 6) * 20 + 'px';
            if ($(this).parents(".bodyRight").find('ul li').eq(0).css("marginTop") == top) {
                $(this).parent().hide();
            }
        })
        function emailNum(chartDataJson) {
            var data = chartDataJson;
            $("#dayOutboxNum").text(data.dayOutboxNum);
            $("#dayInboxNum").text(data.dayInboxNum);
            $("#inboxNum").text(data.inboxNum);
            $("#outboxNum").text(data.outboxNum);
            $("#emailOpenRate").text(data.emailOpenRate);
        }

        //邮件查询
        $(".years").on('change', function () {
            var year = $(this).val();
            var subyear = $(".month").val();
            chartData(year, subyear);
        })
        $(".month").on('change', function () {
            var subyear = $(this).val();
            var year = $(".years").val();
            if (subyear == 19) {
                chartData(year, subyear);
            } else {
                chartDataMonth(year, subyear);
            }
        })
        dateTime();
        chartData(nowYear, 19);
    });
});
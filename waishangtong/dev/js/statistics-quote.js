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
            $("#years").empty();
            $("#years").append(htmlYaer);
            $("#years").find('option[value=' + year + ']').attr('selected', true);
            $("#month").empty();
            $("#month").append('<option value="0">全部</option>');
            $("#month").append(htmlMonth);
        }

        //图表/列表
        function chartData() {
            var dataJson;
            $.ajax({
                url: Base.sitUrl + '/api/quotation/v1/quotation/amount/count',
                type: 'GET',
                dataType: 'json',
                async: false,
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }

                    dataJson = res.data;
                }
            });
            return dataJson;
        }

        var chartDataJson = chartData();

        //  分页
        var $content = $('.page-content');
        var pageObj = {
            homepage: 1,
            currentPage: 1,
            lastpage: null,
            pageSize: 10
        };
        function chart() {
            var count = new Array();
            var months = new Array();
            for (var i = 0; i < chartDataJson.length; i++) {
                months.push(chartDataJson[i].month + '月')
                count.push(chartDataJson[i].count);
            }
            var max = Math.max.apply(null, count);
            var interval = Math.round(max * 0.2)
            if (interval < 1) {
                interval = 1
            }
            var myChart = echarts.init(document.getElementById('chart'));
            var option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['报价单次数']
                },
                xAxis: [
                    {
                        type: 'category',
                        axisLabel: {
                            interval: 0
                        },
                        data: months
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '报价单次数',
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
                        name: '报价单次数',
                        type: 'bar',
                        data: count
                    }
                ]
            };
            myChart.setOption(option);
        }

        function chartTable() {
            var html = '';
            for (var i = chartDataJson.length-1; i >=0; i--) {
                html += '<li class="charTableTitle">' +
                    '<span>' + chartDataJson[i].year + '年' + chartDataJson[i].month + '月' + '</span>' +
                    '<span>' + chartDataJson[i].count + '</span>' +
                    '</li>';
            }
            $(".chartTable").empty();
            $(".chartTable").append(html);
            if (chartDataJson.length > 8) {
                $("#down").show();
            }
        }

        //图表列表
        $('#up a').on('click', function () {
            $(this).parents(".bodyRight").find('ul li').eq(0).animate({
                marginTop: '+=40px'
            },'fast');
            $("#down").show();
            if (parseInt($(this).parents(".bodyRight").find('ul li').eq(0).css("marginTop")) >= -40) {
                $(this).parent().hide();
            }
        });
        $('#down a').on('click', function () {
            $(this).parents(".bodyRight").find('ul li').eq(0).animate({
                marginTop: '-=40px'
            },'fast');
            $("#up").show();
            var top = '-' + (chartDataJson.length - 6) * 40;
            if (parseInt($(this).parents(".bodyRight").find('ul li').eq(0).css("marginTop")) <= parseInt(top)) {
                $(this).parent().hide();
            }
        })
        //排名
        function leftTop() {
            $.ajax({
                url: Base.sitUrl + '/api/quotation/v1/quotation/amount/sort',
                type: 'POST',
                dataType: 'json',
                data: {
                    currentPage: pageObj.currentPage,
                    pageSize: pageObj.pageSize
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
                            var iNum = i + 1;
                            html += '<li>' +
                                '<span class="circleTop">' + iNum + '</span>' +
                                '<span>' + data[i].name + '</span>' +
                                '<span class="moneyTop">' + data[i].count + '</span>' +
                                '</li>';
                        }
                        $("#ulLeft").empty().append(html);
                    } else {
                        var none = '<img src="../../images/statisticsNone.png">';
                        $("#ulLeft").empty().append(none);
                    }
                    var pageNum = res.data.totalItem;
                    var total = pageNum,
                        ps = pageObj.pageSize,
                        all = Math.ceil(total / ps);
                    pageObj.lastpage = all;
                    $('.i-content-wrapper').stop().animate({'scrollTop': 0}, 500);
                }
            })
        }

        //排名前十
        function rightTop() {
            $.ajax({
                url: Base.sitUrl + '/api/quotation/v1/quotation/amount/top',
                type: 'POST',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    var data = res.data;
                    if (data.length > 0) {
                        var html = '';
                        if (data.length > 10) {
                            var dataLength = 10;
                        } else {
                            var dataLength = data.length;
                        }
                        for (var i = 0; i < dataLength; i++) {
                            var iNum = i + 1;
                            html += '<li>' +
                                '<span class="circleTop">' + iNum + '</span>' +
                                '<span>' + data[i].name + '</span>' +
                                '<span class="moneyTop">￥' + data[i].amount + '元</span>' +
                                '</li>';
                        }
                        $("#ulRight").empty().append(html);
                    } else {
                        var none = '<img src="../../images/statisticsNone.png">';
                        $("#ulRight").empty().append(none);
                    }
                }
            })
        }

        //排名查询
        function query(year, month) {
            var year = year;
            var month = month;
            $.ajax({
                url: Base.sitUrl + '/api/quotation/v1/quotation/amount/sort',
                type: 'GET',
                dataType: 'json',
                data: {
                    currentPage: pageObj.currentPage,
                    pageSize: pageObj.pageSize,
                    year: year,
                    month: month
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
                            var iNum = i + 1;
                            html += '<li>' +
                                '<span class="circleTop">' + iNum + '</span>' +
                                '<span>' + data[i].name + '</span>' +
                                '<span class="moneyTop">' + data[i].count + '</span>' +
                                '</li>';
                        }
                        $("#ulLeft").empty();
                        $("#ulLeft").append(html);
                    } else {
                        var none = '<img src="../../images/statisticsNone.png">';
                        $("#ulLeft").empty();
                        $("#ulLeft").append(none);
                    }
                    var pageNum = res.data.totalItem;
                    var total = pageNum,
                        ps = pageObj.pageSize,
                        all = Math.ceil(total / ps);
                    pageObj.lastpage = all;
                    $('.i-content-wrapper').stop().animate({'scrollTop': 0}, 500);
                }
            })
        }

        $("#years").on('change', function () {
            var year = $(this).val();
            query(year, 0);
        })
        $("#month").on('change', function () {
            var year = $('#years').val();
            var month = $(this).val();
            query(year, month);
        })
        dateTime();
        chart();
        chartTable();
        leftTop();
        rightTop();
    });
});
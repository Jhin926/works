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
            $(".month").append('<option value="0">全部</option>');
            $(".month").append(htmlMonth);
        }

        //产品总数
        function money() {
            $.ajax({
                url: Base.sitUrl + '/api/product/v1/product/count',
                type: 'GET',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    $("#money").text(res.data);
                }
            })
        }

        //图表/列表
        function chartData() {
            var dataJson;
            $.ajax({
                url: Base.sitUrl + '/api/product/v1/product/group',
                type: 'GET',
                dataType: 'json',
                async: false,
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

        var chartDataJson = chartData();

        //  分页
        var $content = $('.page-content');
        var pageObj = {
            homepage: 1,
            currentPage: 1,
            lastpage: null,
            pageSize: 5
        };
        $content.on('click', '#pagination>li', function (e) {
            var _ev = e || window.event;
            _ev.preventDefault();

            if ($(this).hasClass('active') || $(this).hasClass('disabled')) {
                return;
            } else {
                pageObj.currentPage = parseInt($(this).children().attr('data-page'));
                quoObj.filter();
                $(this).addClass('active').siblings().removeClass('active');
            }
        });

        function chart() {
            var name = new Array();
            var data = new Array();
            for (var i = 0; i < chartDataJson.length; i++) {
                if (chartDataJson[i].count > 0) {
                    name.push(chartDataJson[i].name);
                    var dataArr = {
                        name: chartDataJson[i].name,
                        value: chartDataJson[i].count
                    }
                    data.push(dataArr);
                }
            }
            var myChart = echarts.init(document.getElementById('chart'));
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: name
                },
                series: [
                    {
                        name: '产品分组',
                        type: 'pie',
                        radius: ['50%', '70%'],
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: true,
                                position: 'left'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '20',
                                    fontWeight: 'normal'
                                }
                            }
                        },
                        labelLine: {
                            normal: {
                                show: true
                            }
                        },
                        data: data
                    }
                ]
            };
            myChart.setOption(option);
        }

        function chartTable() {
            var html = '';
            for (var i = 0; i < chartDataJson.length; i++) {
                html += '<li class="charTableTitle">' +
                    '<span>' + chartDataJson[i].name + '</span>' +
                    '<span>' + chartDataJson[i].count + '</span>' +
                    '</li>';
            }
            $(".chartTable").empty();
            $(".chartTable").append(html);
            if (chartDataJson.length > 7) {
                $("#down").show();
            }
        }

        //图表列表
        $('#up a').bind('click', function () {
            $(this).parents(".bodyRight").find('ul li').eq(0).animate({
                marginTop: '+=30px'
            },'fast');
            $("#down").show();
            if (parseInt($(this).parents(".bodyRight").find('ul li').eq(0).css("marginTop")) >= -30) {
                $(this).parent().hide();
            }
        });
        $('#down a').bind('click', function () {
            $(this).parents(".bodyRight").find('ul li').eq(0).animate({
                marginTop: '-=30px'
            },'fast');
            $("#up").show();
            var h = $(".bodyRight").find('ul li').length;
            var topInt = parseInt((chartDataJson.length - 7) * 30);
            var top = '-' + topInt;
            if (parseInt($(this).parents(".bodyRight").find('ul li').eq(0).css("marginTop")) <= parseInt(top)) {
                $(this).parent().hide();
            }
        })
        //产品分组
        function leftTop(year, month) {
            $.ajax({
                url: Base.sitUrl + '/api/product/v1/group/statistics',
                type: 'POST',
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
                            data[i].conversionRate = parseInt(data[i].conversionRate)
                            html += '<tr data-id="' + i + '">' +
                                '<td>' + data[i].name + '</td>' +
                                '<td>' + data[i].amount + '</td>' +
                                '<td>' + data[i].orderCount + '</td>' +
                                '<td>' + data[i].unitAmount + '</td>' +
                                '<td>' + data[i].quotationCount + '</td>' +
                                '<td>' + data[i].num + '</td>' +
                                '<td>' + data[i].conversionRate + '%</td>' +
                                '</tr>';
                        }
                        $("#pdtGroup tbody").empty();
                        $("#pdtGroup tbody").append(html);
                    } else {
                        var none = '<img src="../../images/statisticsNone.png">';
                        $("#pdtGroup tbody").empty();
                        $("#pdtGroup tbody").append(none);
                    }
                    var pageNum = res.data.totalItem;
                    var total = pageNum,
                        cp = 1,
                        ps = pageObj.pageSize,
                        all = Math.ceil(total / ps);
                    pageObj.lastpage = all;
                    if (all > 1) {
                        var pas = '';
                        pas = '<li><a href="javascript:;" data-page="1">&laquo;</a></li>';
                        for (var j = 0; j < all; j++) {
                            pas += '<li><a href="javascript:;" data-page="' + (j + 1) + '">' + (j + 1) + '</a></li>';
                        }
                        pas += '<li><a href="javascript:;" data-page="' + pageObj.lastpage + '">&raquo;</a></li>';
                    }
                    $('#pagination').empty();
                    $('#pagination').append(pas);
                    $('.i-content-wrapper').stop().animate({'scrollTop': 0}, 500);
                    if (pageObj.currentPage == undefined || pageObj.currentPage == 1) {
                        $('#pagination').children().eq(1).addClass('active');
                        $('#pagination').children().first().addClass('disabled').hide().children().last().removeClass('disabled').show();
                    } else if (pageObj.currentPage && pageObj.currentPage == all) {
                        $('#pagination').children().eq(pageObj.currentPage).addClass('active').siblings().removeClass('active');
                        $('#pagination').children().last().addClass('disabled').hide().children().first().removeClass('disabled').show();
                    } else if (pageObj.currentPage && pageObj.currentPage > 1 && pageObj.currentPage < all) {
                        $('#pagination').children().eq(pageObj.currentPage).addClass('active').siblings().removeClass('active');
                    }
                }
            })
        }

        //产品成交
        function rightTop(year, month) {
            $.ajax({
                url: Base.sitUrl + '/api/product/v1/product/statistics',
                type: 'POST',
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
                            html += '<tr data-id="' + i + '">' +
                                '<td>' + data[i].name + '</td>' +
                                '<td>' + data[i].amount + '</td>' +
                                '<td>' + data[i].orderCount + '</td>' +
                                '<td>' + data[i].unitAmount + '</td>' +
                                '<td>' + data[i].quotationCount + '</td>' +
                                '<td>' + data[i].num + '</td>' +
                                '<td>' + data[i].conversionRate + '%</td>' +
                                '</tr>';
                        }
                        $("#pdt tbody").empty();
                        $("#pdt tbody").append(html);
                    } else {
                        var none = '<img src="../../images/statisticsNone.png">';
                        $("#pdt tbody").empty();
                        $("#pdt tbody").append(none);
                    }
                    var pageNum = res.data.totalItem;
                    var total = pageNum,
                        cp = 1,
                        ps = pageObj.pageSize,
                        all = Math.ceil(total / ps);
                    pageObj.lastpage = all;
                    if (all > 1) {
                        var pas = '';
                        pas = '<li><a href="javascript:;" data-page="1">&laquo;</a></li>';
                        for (var j = 0; j < all; j++) {
                            pas += '<li><a href="javascript:;" data-page="' + (j + 1) + '">' + (j + 1) + '</a></li>';
                        }
                        pas += '<li><a href="javascript:;" data-page="' + pageObj.lastpage + '">&raquo;</a></li>';
                    }
                    $('#pagination1').empty();
                    $('#pagination1').append(pas);
                    $('.i-content-wrapper').stop().animate({'scrollTop': 0}, 500);
                    if (pageObj.currentPage == undefined || pageObj.currentPage == 1) {
                        $('#pagination1').children().eq(1).addClass('active');
                        $('#pagination1').children().first().addClass('disabled').hide().children().last().removeClass('disabled').show();
                    } else if (pageObj.currentPage && pageObj.currentPage == all) {
                        $('#pagination1').children().eq(pageObj.currentPage).addClass('active').siblings().removeClass('active');
                        $('#pagination').children().last().addClass('disabled').hide().children().first().removeClass('disabled').show();
                    } else if (pageObj.currentPage && pageObj.currentPage > 1 && pageObj.currentPage < all) {
                        $('#pagination1').children().eq(pageObj.currentPage).addClass('active').siblings().removeClass('active');
                    }
                }
            })
        }

        //  分页
        $('#pagination').delegate('li', 'click', function (e) {
            var _ev = e || window.event;
            _ev.preventDefault();

            if ($(this).hasClass('active') || $(this).hasClass('disabled')) {
                return;
            } else {
                pageObj.currentPage = $(this).children().attr('data-page');
                var year = $('#pdtGroup').find(".years").val();
                var month = $('#pdtGroup').find(".month").val();
                leftTop(year, month)
                $(this).addClass('active').siblings().removeClass('active');
            }
        });
        //  分页1
        $('#pagination1').delegate('li', 'click', function (e) {
            var _ev = e || window.event;
            _ev.preventDefault();

            if ($(this).hasClass('active') || $(this).hasClass('disabled')) {
                return;
            } else {
                pageObj.currentPage = $(this).children().attr('data-page');
                var year = $('#pdt').find(".years").val();
                var month = $('#pdt').find(".month").val();
                rightTop(year, month)
                $(this).addClass('active').siblings().removeClass('active');
            }
        });
        $("#pdtGroup .years").on('change', function () {
            var year = $(this).val();
            var month = $("#pdtGroup .month").val();
            leftTop(year, month);
        })
        $("#pdtGroup .month").on('change', function () {
            var month = $(this).val();
            var year = $("#pdtGroup .years").val();
            leftTop(year, month);
        })
        $("#pdt .years").on('change', function () {
            var year = $(this).val();
            var month = $("#pdtGroup .month").val();
            rightTop(year, month);
        })
        $("#pdt .month").on('change', function () {
            var month = $(this).val();
            var year = $("#pdtGroup .years").val();
            rightTop(year, month);
        })
        dateTime();
        money();
        chart();
        chartTable();
        leftTop(0, 0);
        rightTop(0, 0);
        //排序
        $(document).ready(function () {
            //产品分组
            $(".table1 thead th").unbind('click').on('click', function (e) {
                $.EventFn(e);
                var trIndex = $(this).index() + 1;
                var NumArr = new Array();
                var trNum = $(".table1 tbody tr");
                var Num = "";
                if (trIndex == 1 || trIndex == 2) {
                    return;
                }
                for (var i = 0; i < trNum.length; i++) {
                    Num += parseInt($(".table1 tbody tr").eq(i).find('td:nth-child(' + trIndex + ')').text()) + '.' + $(".table1 tbody tr").eq(i).attr('data-id') + ',';
                }
                Num = Num.substring(0, Num.length - 1);
                NumArr = Num.split(",");
                function sortNumber(a, b) {
                    return a - b
                }

                NumArr = NumArr.sort(sortNumber);
                var trList;
                if ($(this).hasClass("up")) {
                    $(this).removeClass("up");
                    $(this).find(".i-jiantou").css('transform', 'rotate(0deg)');
                    var trLength = trNum.length;
                    for (var i = 0; i < trLength; i++) {
                        for (var j = 0; j < trLength; j++) {
                            var x = trLength - i;
                            var Id = NumArr[i].substring(NumArr[i].search(/\./) + 1, NumArr[i].length);
                            if ($(".table1 tbody tr").eq(j).attr("data-id") == Id) {
                                trList += '<tr data-id="' + $(".table1 tbody tr").eq(j).attr("data-id") + '">' + $(".table1 tbody tr").eq(j).html() + '</tr>';
                            }
                        }
                    }
                    $(".table1 tbody").empty();
                    $(".table1 tbody").append(trList);
                } else {
                    $(this).addClass("up");
                    $(this).find(".i-jiantou").css('transform', 'rotate(180deg)');
                    var trLength = trNum.length;
                    for (var i = 0; i < trLength; i++) {
                        for (var j = 0; j < trLength; j++) {
                            var x = trLength - i;
                            var Id = NumArr[x - 1].substring(NumArr[x - 1].search(/\./) + 1, NumArr[x - 1].length);
                            if ($(".table1 tbody tr").eq(j).attr("data-id") == Id) {
                                trList += '<tr data-id="' + $(".table1 tbody tr").eq(j).attr("data-id") + '">' + $(".table1 tbody tr").eq(j).html() + '</tr>';
                            }
                        }
                    }
                    $(".table1 tbody").empty();
                    $(".table1 tbody").append(trList);

                }
            });
            //产品成交综合
            $(".table2 thead th").unbind('click').on('click', function (e) {
                $.EventFn(e);
                var trIndex = $(this).index() + 1;
                var NumArr = new Array();
                var trNum = $(".table2 tbody tr");
                var Num = "";
                if (trIndex == 1 || trIndex == 2) {
                    return;
                }
                for (var i = 0; i < trNum.length; i++) {
                    Num += parseInt($(".table2 tbody tr").eq(i).find('td:nth-child(' + trIndex + ')').text()) + '.' + $(".table2 tbody tr").eq(i).attr('data-id') + ',';
                }
                Num = Num.substring(0, Num.length - 1);
                NumArr = Num.split(",");
                function sortNumber(a, b) {
                    return a - b
                }

                NumArr = NumArr.sort(sortNumber);
                var trList;
                if ($(this).hasClass("up")) {
                    $(this).removeClass("up");
                    $(this).find(".i-jiantou").css('transform', 'rotate(0deg)');
                    var trLength = trNum.length;
                    for (var i = 0; i < trLength; i++) {
                        for (var j = 0; j < trLength; j++) {
                            var x = trLength - i;
                            var Id = NumArr[i].substring(NumArr[i].search(/\./) + 1, NumArr[i].length);
                            if ($(".table2 tbody tr").eq(j).attr("data-id") == Id) {
                                trList += '<tr data-id="' + $(".table2 tbody tr").eq(j).attr("data-id") + '">' + $(".table2 tbody tr").eq(j).html() + '</tr>';
                            }
                        }
                    }
                    $(".table2 tbody").empty();
                    $(".table2 tbody").append(trList);
                } else {
                    $(this).addClass("up");
                    $(this).find(".i-jiantou").css('transform', 'rotate(180deg)');
                    var trLength = trNum.length;
                    for (var i = 0; i < trLength; i++) {
                        for (var j = 0; j < trLength; j++) {
                            var x = trLength - i;
                            var Id = NumArr[x - 1].substring(NumArr[x - 1].search(/\./) + 1, NumArr[x - 1].length);
                            if ($(".table2 tbody tr").eq(j).attr("data-id") == Id) {
                                trList += '<tr data-id="' + $(".table2 tbody tr").eq(j).attr("data-id") + '">' + $(".table2 tbody tr").eq(j).html() + '</tr>';
                            }
                        }
                    }
                    $(".table2 tbody").empty();
                    $(".table2 tbody").append(trList);
                }
            });
        });
    });
});
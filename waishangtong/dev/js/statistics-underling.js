require([ 'common' ], function () {
    require([ 'maintab'], function (mainTab) {
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
            $("#month").append('<option value="19">全部</option>');
            $("#month").append(htmlMonth);
        }

        //  分页
        var $content = $('.page-content');
        var pageObj = {
            homepage: 1,
            currentPage: 1,
            lastpage: null,
            pageSize: 10
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
        function tableData(year, subyear) {
            var year = year.toString();
            var page = pageObj.currentPage.toString();
            var pageSize = pageObj.pageSize.toString();
            var data = {year: year, subyear: subyear, currentPage: page, pageSize: pageSize};
            $.ajax({
                url: Base.sitUrl + '/api/org/v1/org/user/subordinate/statistics',
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

                    var data = res.data.results;
                    var html = '';
                    for (var i = 0; i < data.length; i++) {
                        html += '<tr data-id="' + i + '">' +
                            '<td>' + data[i].staffName + '</td>' +
                            '<td>' + data[i].loginTimes + '</td>' +
                            '<td>' + data[i].emailCount + '</td>' +
                            '<td>' + data[i].edmCount + '</td>' +
                            '<td>' + data[i].newCustomerCount + '</td>' +
                            '<td>' + data[i].quotationCount + '</td>' +
                            '<td>' + data[i].orderCount + '</td>' +
                            '<td>' + data[i].orderMoney + '</td>' +
                            '</tr>';
                    }
                    $('.table tbody').empty().append(html);
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

        var nowYear = new Date().getFullYear();
        tableData(nowYear, '19');
        dateTime();
        $("#years").on('change', function () {
            var year = $(this).val();
            var subyear = $('#month').val();
            tableData(year, subyear);
        })
        $("#month").on('change', function () {
            var subyear = $(this).val();
            var year = $('#years').val();
            tableData(year, subyear);
        });
        //排序
        $(document).ready(function () {
            //联系人
            $(".table thead th").unbind('click').on('click', function (e) {
                $.EventFn(e);
                var NumArr = new Array();
                var trNum = $(".table tbody tr");
                var Num = "";
                if ($(this).attr("id") == 'sendNum') {
                    var trIndex = 3
                } else if ($(this).attr("id") == 'saleNum') {
                    var trIndex = 4
                } else if ($(this).attr("id") == 'custNum') {
                    var trIndex = 5
                } else if ($(this).attr("id") == 'quoteNum') {
                    var trIndex = 6
                } else if ($(this).attr("id") == 'orderNum') {
                    var trIndex = 7
                } else if ($(this).attr("id") == 'orderMoney') {
                    var trIndex = 8
                } else {
                    return;
                }
                for (var i = 0; i < trNum.length; i++) {
                    Num += $(".table tbody tr").eq(i).find('td:nth-child(' + trIndex + ')').text() + '.' + $(".table tbody tr").eq(i).attr('data-id') + ',';
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
                            if ($(".table tbody tr").eq(j).attr("data-id") == Id) {
                                trList += '<tr data-id="' + $(".table tbody tr").eq(j).attr("data-id") + '">' + $(".table tbody tr").eq(j).html() + '</tr>';
                            }
                        }
                    }
                    $(".table tbody").empty();
                    $(".table tbody").append(trList);
                } else {
                    $(this).addClass("up");
                    $(this).find(".i-jiantou").css('transform', 'rotate(180deg)');
                    var trLength = trNum.length;
                    for (var i = 0; i < trLength; i++) {
                        for (var j = 0; j < trLength; j++) {
                            var x = trLength - i;
                            var Id = NumArr[x - 1].substring(NumArr[x - 1].search(/\./) + 1, NumArr[x - 1].length);
                            if ($(".table tbody tr").eq(j).attr("data-id") == Id) {
                                trList += '<tr data-id="' + $(".table tbody tr").eq(j).attr("data-id") + '">' + $(".table tbody tr").eq(j).html() + '</tr>';
                            }
                        }
                    }
                    $(".table tbody").empty();
                    $(".table tbody").append(trList);
                }
            });
        });
    });
});
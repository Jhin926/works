/* !
 *  用于营销信
 */
require([ 'common' ], function () {
    require(['maintab','ueditorLang', 'blockUI'], function (maintab) {
        maintab.init();
        //  分页
        var pageObj = {
            homepage: 1,
            currentPage: 1,
            lastpage: null,
            pageSize: 10
        };
        //  查询列表
        var quoObj = {
            /*
             * @filter 获取营销信列表
             */
            filter: function () {
                var data = {
                    currentPage: pageObj.currentPage,
                    pageSize: pageObj.pageSize
                };
                $.ajax({
                    url: Base.sitUrl + '/api/edm/v1/list',
                    data: {
                        data: JSON.stringify(data)
                    },
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var data = res.data.results;
                        var page = res.data.totalItem;
                        if (data.length > 0) {
                            devLetterRe(data, page);
                        } else {
                            var none = '<div style="text-align:center;">' +
                                '<img src="../images/devNone.png" />' +
                                '<div style="margin-top:20px">' +
                                '<a href="pop-letter-new.html" class="btn btn-primary" id="addEmail-none" data-maintab="">' +
                                '<i class="pub-icon newemail-icon"></i>' +
                                '&nbsp;<span>新建营销信</span>' +
                                '</a>' +
                                '</div></div>';
                            $('.page_info>table').after(none);
                        }
                    }
                });
            }
        };
        $.reHtml = function () {
            var data = {
                currentPage: pageObj.currentPage,
                pageSize: pageObj.pageSize
            };
            $.ajax({
                url: Base.sitUrl + '/api/edm/v1/list',
                data: {
                    data: JSON.stringify(data)
                },
                type: 'POST',
                dataType: 'json',
                async: false,
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var data = res.data.results;
                    var page = res.data.totalItem;
                    if (data.length > 0) {
                        devLetterRe(data, page);
                    } else {
                        var none = '<div style="text-align:center;">' +
                            '<img src="../images/devNone.png" />' +
                            '<div style="margin-top:20px">' +
                            '<a href="pop-letter-new.html" class="btn btn-primary" id="addEmail-none" data-maintab="">' +
                            '<i class="pub-icon newemail-icon"></i>' +
                            '&nbsp;<span>新建营销信</span>' +
                            '</a>' +
                            '</div></div>';
                        $('.page_info>table').after(none);
                    }
                }
            });
        }
        //列表渲染
        function devLetterRe(dataJson, pageNum) {
            var html = "";
            $.each(dataJson, function (index, content) {
                var send = "";
                var sendSuccess;
                var statusImg = "";
                if (content.emailSum > 0) {//送达率
                    sendSuccess = (content.deliverySum / content.emailSum).toFixed(2) * 100 + '%';
                } else {
                    sendSuccess = '0.00';
                }
                if (content.status == 0) {
                    send = "发送中";
                    statusImg = 'sending-icon';
                } else if (content.status == 1) {
                    send = "发送中";
                    statusImg = 'sending-icon';
                } else if (content.status == 2) {
                    send = "已发送";
                    statusImg = 'sended-icon';
                } else {
                    send = "已发送";
                }
                var time = content.createTime.substring(0, content.createTime.length - 2)
                html += '<tr data-id="' + content.id + '">' +
                    '<td>' +
                    '<i class="pub-icon ' + statusImg + '" title="'+send+'"></i>' +
                    '</td>' +
                    '<td>' +
                    '<a class="link-l-detal" href="pop-letter-detail.html?id=' + content.id + '&v=' + window.ver + '" data-maintab>' +
                    content.subject +
                    '</a>' +
                    '</td>' +
                    '<td class="text-center">' + content.emailSum + '</td>' +
                    '<td class="text-center"><span class="send-rate">' + sendSuccess + '</span></td>' +
                    '<td class="text-center"><span class="open-num">' + content.openSum + '</span></td>' +
                    '<td class="text-right send-time"><span class="sortsTime">' + time + '</span></td>' +
                    '</tr>';
            });
            $(".trNone").remove();
            $('.page_info>table>tbody').empty().append(html);

            var total = pageNum,
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
                    quoObj.filter();
                }
            });
        }

        //页面起始
        quoObj.filter();

        //筛选
            var getHref = $('#new-develop').attr('href') + '?v=' + window.ver;
            $('#new-develop').attr('href', getHref);
            //联系人
            $(".table thead th").unbind('click').on('click', function () {
                var timeArr = new Array();
                var sendArr = new Array();
                var openArr = new Array();
                var trNum = $(".table tbody tr");
                var time = "";
                var open = "";
                var send = "";
                for (var i = 0; i < trNum.length; i++) {
                    var timeNum = Date.parse(new Date($(".table tbody tr").eq(i).find(".sortsTime").text()))
                    time += timeNum + $(".table tbody tr").eq(i).attr("data-id") + ",";
                }
                time = time.substring(0, time.length - 1);
                timeArr = time.split(",");
                function sortNumber(a, b) {
                    return a - b
                }

                timeArr = timeArr.sort(sortNumber);
                var trList;
                if ($(this).attr("id") == "sortsTime") {//时间筛选
                    $("#sortsTime").find(".s-orderList").addClass("s-reorderList");
                    $("#sortsTime").find(".s-reorderList").removeClass("s-orderList");
                    if ($("#sortsTime").attr("class") == "" || $("#sortsTime").attr("class") == undefined) {
                        $("#sortsTime").addClass("up");
                        for (var i = 0; i < trNum.length; i++) {
                            for (var j = 0; j < trNum.length; j++) {
                                var timeId = timeArr[i].substring(13, timeArr[i].length);
                                if ($(".table tbody tr").eq(j).attr("data-id") == timeId) {
                                    trList += '<tr data-id="' + $(".table tbody tr").eq(j).attr("data-id") + '">' + $(".table tbody tr").eq(j).html() + '</tr>';
                                }
                            }
                        }
                        $(".table tbody").empty();
                        $(".table tbody").append(trList);
                    } else if ($("#sortsTime").attr("class") == "up") {
                        $("#sortsTime").find(".s-reorderList").addClass("s-orderList");
                        $("#sortsTime").find(".s-orderList").removeClass("s-reorderList");
                        $("#sortsTime").removeClass("up");
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
                        $(".table tbody").empty();
                        $(".table tbody").append(trList);
                    }
                } else if ($(this).attr("id") == "open-num") {//已打开数
                    for (var i = 0; i < trNum.length; i++) {
                        var openNum = $(".table tbody tr").eq(i).find(".open-num").text();
                        open += openNum + '.' + $(".table tbody tr").eq(i).attr("data-id") + ",";
                    }
                    open = open.substring(0, open.length - 1);
                    openArr = open.split(",");
                    function sortNumber(a, b) {
                        return a - b
                    }

                    openArr = openArr.sort(sortNumber);
                    var trLength = trNum.length;
                    $("#open-num").find(".s-orderList").addClass("s-reorderList");
                    $("#open-num").find(".s-reorderList").removeClass("s-orderList");
                    if (!$("#open-num").hasClass('up')) {
                        $("#open-num").addClass("up");
                        for (var i = 0; i < trLength; i++) {
                            for (var j = 0; j < trLength; j++) {
                                var x = trLength - i;
                                var Id = openArr[i].substring(openArr[i].search(/\./) + 1, openArr[i].length);
                                if ($(".table tbody tr").eq(j).attr("data-id") == Id) {
                                    trList += '<tr data-id="' + $(".table tbody tr").eq(j).attr("data-id") + '">' + $(".table tbody tr").eq(j).html() + '</tr>';
                                }
                            }
                        }
                        $(".table tbody").empty();
                        $(".table tbody").append(trList);
                    } else if ($("#open-num").hasClass('up')) {
                        $("#open-num").find(".s-reorderList").addClass("s-orderList");
                        $("#open-num").find(".s-orderList").removeClass("s-reorderList");
                        $("#open-num").removeClass("up");
                        for (var i = 0; i < trLength; i++) {
                            for (var j = 0; j < trLength; j++) {
                                var x = trLength - i;
                                var Id = openArr[x - 1].substring(openArr[x - 1].search(/\./) + 1, openArr[x - 1].length);
                                if ($(".table tbody tr").eq(j).attr("data-id") == Id) {
                                    trList += '<tr data-id="' + $(".table tbody tr").eq(j).attr("data-id") + '">' + $(".table tbody tr").eq(j).html() + '</tr>';
                                }
                            }
                        }
                        $(".table tbody").empty().append(trList);
                    }
                } else if ($(this).attr("id") == "send-rate") {//送达
                    for (var i = 0; i < trNum.length; i++) {
                        var sendNum = $(".table tbody tr").eq(i).find(".send-rate").text();
                        sendNum = sendNum.replace(/\%/i, '0')
                        send += sendNum + '.' + $(".table tbody tr").eq(i).attr("data-id") + ",";
                    }
                    send = send.substring(0, send.length - 1);
                    sendArr = send.split(",");
                    function sortNumber(a, b) {
                        return a - b
                    }

                    sendArr = sendArr.sort(sortNumber);
                    var trLength = trNum.length;
                    $("#send-rate").find(".s-orderList").addClass("s-reorderList");
                    $("#send-rate").find(".s-reorderList").removeClass("s-orderList");
                    if (!$("#send-rate").hasClass('up')) {
                        $("#send-rate").addClass("up");
                        for (var i = 0; i < trLength; i++) {
                            for (var j = 0; j < trLength; j++) {
                                var x = trLength - i;
                                var Id = sendArr[i].substring(sendArr[i].search(/\./) + 1, sendArr[i].length);
                                if ($(".table tbody tr").eq(j).attr("data-id") == Id) {
                                    trList += '<tr data-id="' + $(".table tbody tr").eq(j).attr("data-id") + '">' + $(".table tbody tr").eq(j).html() + '</tr>';
                                }
                            }
                        }
                        $(".table tbody").empty();
                        $(".table tbody").append(trList);
                    } else if ($("#send-rate").hasClass('up')) {
                        $("#send-rate").find(".s-reorderList").addClass("s-orderList");
                        $("#send-rate").find(".s-orderList").removeClass("s-reorderList");
                        $("#send-rate").removeClass("up");
                        for (var i = 0; i < trLength; i++) {
                            for (var j = 0; j < trLength; j++) {
                                var x = trLength - i;
                                var Id = sendArr[x - 1].substring(sendArr[x - 1].search(/\./) + 1, sendArr[x - 1].length);
                                if ($(".table tbody tr").eq(j).attr("data-id") == Id) {
                                    trList += '<tr data-id="' + $(".table tbody tr").eq(j).attr("data-id") + '">' + $(".table tbody tr").eq(j).html() + '</tr>';
                                }
                            }
                        }
                        $(".table tbody").empty();
                        $(".table tbody").append(trList);
                    }
                }
            });
        //查看详情
        $(document).on('click', 'tr', function () {
            $(this).find("a").click();
        });
    });
});
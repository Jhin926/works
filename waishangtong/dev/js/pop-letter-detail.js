/* !
 *  用于营销信详情
 */
require([ 'common' ], function () {
    require(['maintab', 'ZeroClipboard', 'ueditorLang', 'blockUI', 'jqform'], function (maintab, ZeroClipboard) {
        window['ZeroClipboard'] = ZeroClipboard;
        maintab.init();

        //切换时区
        $('.letter-detail').on('click', '.sender-time-icon', function (e) {
            $.EventFn(e);
            $('.check-time').css('display', 'inline-block');
        });
        $('.check-time').change(function () {
            var getOffset = $(this).val();
            var getTime = $(this).prev().prev();
            var getOldOffset = Number(getTime.attr('data-time'));
            getTime.text($.calcTime(getTime.text(), getOldOffset, getOffset)).attr('data-time', getOffset);
        });

        var letterId = $.GetQueryString('id');
        //获取统计条数据
        function ledgementNum() {
            $.ajax({
                url: Base.sitUrl + '/api/edm/v1/send/detail',
                type: 'POST',
                dataType: 'json',
                async: false,
                data: {
                    id: letterId
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
                    var data = res.data;
                    $(".totalEmail").text(data.emailSum);
                    $(".sendEmail").text(data.deliverySum);
                    $(".openEmail").text(data.openSum);
                    $(".backEmail").text(data.replySum);
                    $(".sendFailedSum").text(data.sendFailedSum);
                    $(".deliveryRate").text(data.deliveryRate + '%');
                    $(".replyRate").text(data.replyRate + '%');
                    $(".openRate").text(data.openRate + '%');
                    $(".failedRate").text(data.failedRate + '%');
                    $("#letterTitle").text(data.subject);
                    if (data.status == 2) {
                        var status = 'letterSend';
                        var letterTitleStatus = '已发送完毕'
                        var img = '<img src="../images/' + status + '.png" class="left" />';
                        $("#letterTitle").parent().before(img);
                    } else {
                        var status = 'letterSending_detail';
                        var letterTitleStatus = '发送失败'
                        var img = '<img src="../images/' + status + '.png" class="left" style="width:50px"/>';
                        $("#letterTitle").parent().before(img);
                    }
                    ledgement();
                }
            })
        }

        //统计条计算
        function ledgement() {
            $(".ledgement").show();
            var total = $("#totalEmail span").text();
            var send = $("#sendEmail span").text();
            var open = $("#openEmail span").text();
            var back = $("#backEmail span").text();
            var sendW = send / total * 750;
            var openW = open / total * 750;
            var backW = back / total * 750;
            if (sendW > 750) {
                sendW = 750
            }
            if (openW > 750) {
                openW = 750;
            }
            if (backW >= 750) {
                backW = 750;
                $("#backEmail .ledgementNo").hide()
            }
            var sendWNo = 750 - sendW - 5;
            var openWNo = 750 - openW - sendWNo - 10;
            var backWNo = 750 - backW - openWNo - sendWNo - 15;
            $("#totalEmail .ledgement").css("width", "750px");
            $("#sendEmail .ledgement").css("width", sendW + "px");
            $("#sendEmail .ledgementNo").css("width", sendWNo + "px");
            $("#openEmail .ledgement").css("width", openW - 5 + "px");
            $("#openEmail .ledgementNo").css("width", openWNo + 5 + "px");
            $("#openEmail .ledgementNo").css("right", sendWNo + 5 + "px");
            $("#backEmail .ledgement").css("width", backW + "px");
            $("#backEmail .ledgementNo").css("width", backWNo + "px");
            if (sendW == 0) {
                $("#sendEmail .ledgementNo").siblings(".ledgement").hide();
                $("#openEmail .ledgementNo").hide();
                $("#backEmail .ledgementNo").hide();
                $("#sendEmail .ledgementNo").css("width", "750px");
            }
            if (openW == 0 && sendWNo <= 0) {
                $("#openEmail .ledgementNo").siblings(".ledgement").hide();
                $("#backEmail .ledgementNo").hide();
                $("#openEmail .ledgementNo").css("width", "750px");
            }
            if (backW == 0 && openWNo <= 0) {
                $("#backEmail .ledgementNo").siblings(".ledgement").hide();
                $("#backEmail .ledgementNo").css("marginLeft", "0");
                $("#backEmail .ledgementNo").css("width", "750px");
            } else if (backW == 0 && backWNo !== 0 && openWNo !== 0 && sendWNo !== 0) {
                $("#backEmail .ledgement").remove();
                $("#backEmail .ledgementNo").css("marginLeft", "0");
            }
            if(backWNo == 0){
                $("#backEmail .ledgementNo").eq(0).remove();
            }
            for (var i = 0; i < $('.letter-statistics').find('.ledgement').length; i++) {
                if ($('.letter-statistics').find('.ledgement').eq(i).width() <= 0) {
                    $('.letter-statistics').find('.ledgement').eq(i).hide();
                }
            }
        }

        //时间戳转换
        function formatDate(now) {
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var date = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();
            var second = now.getSeconds();
            return   year + "-" + month + "-" + date + "   " + hour + ":" + minute + ":" + second;
        }
        //按钮切换
        $(".contUl li").eq(0).on('click', function () {
            $(".letterAll").css('display', 'inline-block');
            $(".letterAll").siblings().css('display', 'none');
            $(".letterDown").css('display', 'inline-block');
        });
        $(".contUl li").eq(1).on('click', function () {
            $(".letterSend1").css('display', 'inline-block');
            $(".letterSend1").siblings().css('display', 'none');
            $(".letterSend0").css('display', 'inline-block');
            $(".letterDown").css('display', 'inline-block');
        });
        $(".contUl li").eq(2).on('click', function () {
            $(".letterOpen1").css('display', 'inline-block');
            $(".letterOpen1").siblings().css('display', 'none');
            $(".letterOpen0").css('display', 'inline-block');
            $(".letterDown").css('display', 'inline-block');
        });
        $(".contUl li").eq(3).on('click', function () {
            $(".letterBack0").css('display', 'inline-block');
            $(".letterBack0").siblings().css('display', 'none');
            $(".letterDown").css('display', 'inline-block');
        });
        $(".contUl li").eq(4).on('click', function () {
            $(".letterFaile").css('display', 'inline-block');
            $(".letterFaile").siblings().css('display', 'none');
            $(".letterDown").css('display', 'inline-block');
        });
        //导出联系人
        $.daochu = function () {
            var type = $(".contUl").find("li.active").attr("data-type");
            window.location.href = Base.sitUrl + '/api/edm/v1/export/contacts?id=' + letterId + '&type=' + type;

        };
        //  分页
        var pageObj = {
            homepage: 1,
            currentPage: 1,
            lastpage: null,
            pageSize: 10
        };
        //信件状态导航切换&&获取列表信息
        var arr=["#6289FF","#35C274","#35B0C2","#FFAB17","#FF586C"];
        $(".contUl li").on('click', function () {
            var index=$(".contUl li").index(this);
            $(".contUl li").css("background","");
            $(".contUl li").eq(index).css("background",arr[index]);
            $(".con_icon div").hide();
            $(".con_icon div").eq(index).show();
            $(this).addClass("active").siblings().removeClass("active");
            pageObj.currentPage = 1;
            var type = $(this).attr("data-type");
            detaileEmail(type);
        });
        //归属地--
        function testElse(test) {
            if (test == null) {
                return "&nbsp;-&nbsp;-";
            } else {
                return test;
            }
        }
        //信件详情
        var img='';
        function detaileEmail(type) {
            $.ajax({
                url: Base.sitUrl + '/api/edm/v1/email/detail',
                type: 'POST',
                datType: 'json',
                data: {
                    id: letterId,
                    type: type,
                    currentPage: pageObj.currentPage,
                    pageSize: pageObj.pageSize
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var data = res.data.results;
                    var html = "";
                    if (data.length < 1) {
                        if (type == 2) {
                            $(".letterSend1").attr('disabled', 'disabled');
                            $(".letterSend1").unbind('click');
                            $(".letterSend0").attr('disabled', 'disabled');
                            $(".letterSend0").unbind('click');
                            $(".letterDown").attr('disabled', 'disabled');
                        } else if (type == 3) {
                            $(".letterOpen1").attr('disabled', 'disabled');
                            $(".letterOpen0").attr('disabled', 'true');
                            $(".letterOpen1").unbind('click');
                            $(".letterOpen0").unbind('click');
                            $(".letterDown").attr('disabled', 'disabled');
                        } else if (type == 4) {
                            $(".letterBack0").attr('disabled', 'disabled');
                            $(".letterBack0").unbind('click');
                            $(".letterDown").attr('disabled', 'disabled');
                        } else if (type == 5) {
                            $(".letterFaile").attr('disabled', 'disabled');
                            $(".letterFaile").unbind('click');
                            $(".letterDown").attr('disabled', 'disabled');
                        }
                        html = '<li class="text-center" style="margin-top:15px;background:none;">无营销信件</li>'
                    } else {
                        $(".letterDown").attr('disabled', false);
                        for (var i = 0; i < data.length; i++) {
                            if (i == data.length - 1) {
                                var dataNum = 1
                            } else {
                                var dataNum = 0
                            }
                            var status = "";
                            var sendStatus = "";
                            if (data[i].isDelivery == 1) {
                                var time = formatDate(new Date(data[i].createTime));
                            } else if (data[i].isDelivery == 0) {
                                var time = formatDate(new Date(data[i].createTime));
                            }
                            if (type == 3 && data[i].isDelivery == 3) {
                                sendStatus = 'letterSend';
                                status = '已送达';
                            }
                            if (type == 1) {
                                if(data[i].status == 1){
                                    sendStatus = 'letterSend';
                                }else if(data[i].status ==2){
                                    sendStatus = 'letterFailed';
                                }
                                //sendStatus = 'letterSend';
                                //status = '已发送'
                            }
                            if (type == 2) {
                                sendStatus = 'letterSend';
                                status = '已发送'
                            } else if (type == 3) {
                                sendStatus = 'letterOpen';
                                status = '已打开'+data[i].openSum+"次";
                            } else if (type == 4) {
                                sendStatus = 'letterBack';
                                status = '已回复'+data[i].replaySum+"次";
                            } else if (type == 5) {
                                sendStatus = 'letterFailed';
                                status = '发送失败'
                            }

                            html += '<li data-id="' + data[i].id + '" data-edmEmailId="' + data[i].edmEmailId + '" data-num="' + dataNum + '">' +
                                '<div class="liTags">' +
                                '<img src="../images/' + sendStatus + '.png" class="tableContUl-img">' +
                                '<div class="liTitle">' +
                                '<span class="liTime">' + testNull(time) + '</span>'+
                                '<span class="liEmail"><a class="liEmailLabel" style="color:#4b73ec;">' + testNull(data[i].address) + '</a>' +
                                '<span class="li_TraceLocation">' +testElse(data[i].lastTraceLocation) + '</span>' +
                                '<div class="sender-condition-style" style="display: none;top:6px;left:187px;"></div>' +
                                '</div>' +
                                '<div class="liMain">' +
                                '<span class="liStaus">' + testNull(status) + '</span>'+
                                '<span class="liMain_con">' + testNull(data[i].subject) + '</span>' +
                                '</div>' +
                                '</div>' +
                                '</li>';
                        }
                    }
                    $(".tableContUl").empty();
                    $(".tableContUl").append(html);
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
                            var type = $(".contUl").find('li.active').attr('data-type');
                            detaileEmail(type);
                        }
                    });
                }
            });
        }

        //返回统计页
        $(".i-left").unbind('click').on("click", function () {
            $("#letterContent").hide();
            $("#letterStatistics").show();
        })
        //打开内容页
        $("#letterContentBtn").on('click', function () {
            $("#letterContent").show();
            $("#letterStatistics").hide();
            //邮件详情
            $('.email-detail-main-content').attr('src', Base.sitUrl + '/html/read.html?type=3&id=' + letterId + "&v=" + window.ver)
        });
        $.devLetterDetail = function (data) {
            var html = "";
            $(".detailSender").val(data.from);
            $("#ltContTitle").text(data.subject);
            $("#ltContTitle1").val(data.subject1);
            $("#ltContTitle2").val(data.subject2);
            $("#ltContTitle3").val(data.subject3);
            $(".sender-info-time").text(formatDate(new Date(data.createTime)));
            for (var i = 0; i < data.attachments.length; i++) {
                var size = data.attachments[i].attachmentSize / 1024;
                size = size.toFixed(2) + 'MB';
                html += '<div class="fujian">' +
                    '<i class="pub-icon fujian2-icon"></i>' +
                    '<span class="fujianName" data-url="' + data.attachments[i].attachment + '">' + data.attachments[i].attachmentName + '</span>' +
                    '<span>(' + size + ')</span>' +
                    '<a href="#" class="blue">另存为</a>' +
                    '</div>';
            }
            $("#fujian").empty().append(html);
        }
        //下载附件
        $(document).on('click', ".fujian>a", function () {
            var name = $(this).parent().find(".fujianName").text();
            var attachment = $(this).parent().find(".fujianName").attr("data-url");
            var data = {
                name: name,
                value: attachment
            }
            data = JSON.stringify(data)
            window.location.href = Base.sitUrl + '/api/file/download?data=' + data;
        });
        ledgementNum();
        $(".contUl li").eq(0).click();
        //全部二次营销
        var addressModeData = "";
        $(".letterAll").on('click', function () {
            $("#letterStatistics").hide();
            $("#secondLetter").show();
            //数据获取
            insertModel();//已选择邮箱
            surplusNum();//剩余开发信
            $.ajax({
                url: Base.sitUrl + '/api/edm/v1/secondary/marketing',
                type: 'POST',
                dataType: 'json',
                async: false,
                data: {
                    id: letterId,
                    type: 1,
                    status: 0
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    var data = res.data;
                    $("#emailAccountNum").text(data.length);
                    for (var i = 0; i < data.length; i++) {
                        addressModeData += '"' + data[i] + '":' + '""' + ','
                    }
                    addressModeData = addressModeData.substring(0, addressModeData.length - 1);
                }
            })
        });
        $(".letterSend1").on('click', function () {
            $("#letterStatistics").hide();
            $("#secondLetter").show();
            //数据获取
            insertModel();//已选择邮箱
            surplusNum();//剩余开发信
            $.ajax({
                url: Base.sitUrl + '/api/edm/v1/secondary/marketing',
                type: 'POST',
                dataType: 'json',
                async: false,
                data: {
                    id: letterId,
                    type: 2,
                    status: 1
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    var data = res.data;
                    $("#emailAccountNum").text(data.length);
                    for (var i = 0; i < data.length; i++) {
                        addressModeData += '"' + data[i] + '":' + '""' + ','
                    }
                    addressModeData = addressModeData.substring(0, addressModeData.length - 1);
                }
            })
        });
        $(".letterSend0").on('click', function () {
            $("#letterStatistics").hide();
            $("#secondLetter").show();
            //数据获取
            insertModel();//已选择邮箱
            surplusNum();//剩余开发信
            $.ajax({
                url: Base.sitUrl + '/api/edm/v1/secondary/marketing',
                type: 'POST',
                dataType: 'json',
                async: false,
                data: {
                    id: letterId,
                    type: 2,
                    status: 2
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    var data = res.data;
                    $("#emailAccountNum").text(data.length);
                    for (var i = 0; i < data.length; i++) {
                        addressModeData += '"' + data[i] + '":' + '""' + ','
                    }
                    addressModeData = addressModeData.substring(0, addressModeData.length - 1);
                }
            })
        });
        $(".letterOpen1").on('click', function () {
            $("#letterStatistics").hide();
            $("#secondLetter").show();
            //数据获取
            insertModel();//已选择邮箱
            surplusNum();//剩余开发信
            $.ajax({
                url: Base.sitUrl + '/api/edm/v1/secondary/marketing',
                type: 'POST',
                dataType: 'json',
                async: false,
                data: {
                    id: letterId,
                    type: 3,
                    status: 1
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    var data = res.data;
                    $("#emailAccountNum").text(data.length);
                    for (var i = 0; i < data.length; i++) {
                        addressModeData += '"' + data[i] + '":' + '""' + ','
                    }
                    addressModeData = addressModeData.substring(0, addressModeData.length - 1);
                }
            })
        });
        $(".letterOpen0").on('click', function () {
            $("#letterStatistics").hide();
            $("#secondLetter").show();
            //数据获取
            insertModel();//已选择邮箱
            surplusNum();//剩余开发信
            $.ajax({
                url: Base.sitUrl + '/api/edm/v1/secondary/marketing',
                type: 'POST',
                dataType: 'json',
                async: false,
                data: {
                    id: letterId,
                    type: 3,
                    status: 2
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    var data = res.data;
                    $("#emailAccountNum").text(data.length);
                    for (var i = 0; i < data.length; i++) {
                        addressModeData += '"' + data[i] + '":' + '""' + ','
                    }
                    addressModeData = addressModeData.substring(0, addressModeData.length - 1);
                }
            })
        });
        $(".letterBack0").on('click', function () {
            $("#letterStatistics").hide();
            $("#secondLetter").show();
            //数据获取
            insertModel();//已选择邮箱
            surplusNum();//剩余开发信
            $.ajax({
                url: Base.sitUrl + '/api/edm/v1/secondary/marketing',
                type: 'POST',
                dataType: 'json',
                async: false,
                data: {
                    id: letterId,
                    type: 4,
                    status: 0
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    var data = res.data;
                    $("#emailAccountNum").text(data.length);
                    for (var i = 0; i < data.length; i++) {
                        addressModeData += '"' + data[i] + '":' + '""' + ','
                    }
                    addressModeData = addressModeData.substring(0, addressModeData.length - 1);
                }
            })
        });
        $(".letterFaile").on('click', function () {
            $("#letterStatistics").hide();
            $("#secondLetter").show();
            //数据获取
            insertModel();//已选择邮箱
            surplusNum();//剩余开发信
            $.ajax({
                url: Base.sitUrl + '/api/edm/v1/secondary/marketing',
                type: 'POST',
                dataType: 'json',
                async: false,
                data: {
                    id: letterId,
                    type: 5,
                    status: 0
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    var data = res.data;
                    $("#emailAccountNum").text(data.length);
                    for (var i = 0; i < data.length; i++) {
                        addressModeData += '"' + data[i] + '":' + '""' + ','
                    }
                    addressModeData = addressModeData.substring(0, addressModeData.length - 1);
                }
            })
        });
        var editors = {
            letter: null,
            type: null,
            toolbars: [
                [
                    'fontsize', //字号
                    'forecolor', //字体颜色
                    'backcolor', //背景色
                    '|',
                    'bold', //加粗
                    'italic', //斜体
                    '|',
                    'underline', //下划线
                    'formatmatch',//格式刷
                    'insertorderedlist', //有序列表
                    'insertunorderedlist', //无序列表
                    'justifyleft', //居左对齐
                    'justifyright', //居右对齐
                    'justifycenter', //居中对齐
                    'justifyjustify', //两端对齐
                    '|',
                    'link',//超链接
                    'unlink',//取消超链接
                    'inserttable',//表格
                    'fullscreen',//全屏
                    'cleardoc',//清空文档
                    'emotion', //表情
                    'source' //源代码
                ]
            ],
            /*
             * @createEditor 初始化编辑器
             */
            createEditor: function () {
                editors.letter = UE.getEditor('letterEditor', {
                    'toolbars': editors.toolbars,
                    'initialFrameWidth': "100%",
                    'initialFrameHeight': 360
                });
            }
        };
        editors.createEditor();
        //获取编辑器内容
        function getContent() {
            var arr = [];
            arr.push(editors.letter.getContent());
            var contentText = arr.join("\n");
            return contentText;
        }

        //步骤进行
        $("#btnOne .btn").on('click', function () {//进入第二步
            if (parseInt($('#surplusNum').text()) < 0) {
                $.Alert('您的营销信不足')
                return;
            } else {
                $("#stepTwo").show();
                $("#stepTwo").siblings(".stepBlock").hide();
                $("#stepShow").empty();
                $("#stepShow").append('<img src="../images/step2.png">');
            }
        });
        $("#backStepTwo").on('click', function () {//返回第一步
            $("#stepOne").show();
            $("#stepOne").siblings(".stepBlock").hide();
            $("#stepShow").empty();
            $("#stepShow").append('<img src="../images/step1.png">');
        });
        $("#btnTwo .btn").on('click', function () {//进入第三步
            if ($("#subject").val() == "") {
                $.Alert("请填写营销主题")
            } else if ($("#subject1").val() == "" && $("#subject2").val() == "" && $("#subject3").val() == "") {
                $.Alert('至少填写一个邮件主题')
            } else {
                $("#stepThree").show();
                $("#stepThree").siblings(".stepBlock").hide();
                $("#stepShow").empty();
                $("#stepShow").append('<img src="../images/step3.png">');
            }
        });
        $("#backStepThree").on('click', function () {//返回第二步
            $("#stepTwo").show();
            $("#stepTwo").siblings(".stepBlock").hide();
            $("#stepShow").empty();
            $("#stepShow").append('<img src="../images/step2.png">');
        });

        //邮箱验证正则式
        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        //邮箱地址粘贴
        $('.stepCont2 input').on('keydown', function (event) {
            var val = $(this).val();
            if (event.keyCode == 13 && val !== "") {
                if (!reg.test(val)) {
                    $.Alert("邮箱格式错误")
                } else {
                    var spanH = '<span class="emailAccount left"><i class="s-customer left"></i><label class="emailLabel">' + val + '</label><i class="i-emailClose"></i></span>';
                    $(".stepCont2 input").before(spanH);
                    $(".stepCont2 input").val("");
                }
                $("#copyEmail").text($(".stepCont2").find(".emailAccount ").length);
            }
            if (event.keyCode == 8 && val == "") {
                $(this).prev("span").remove();
            }
        });
        //模板选择
        $("#custModels>p>a").on('click', function () {
            $(this).addClass("active");
            $(this).siblings().removeClass('active');
        });
        //添加附件
        $(".add-attachment").unbind('click').on('click', function () {
            if ($("#addFiles").children("li").length > 0) {
                $.Alert("只支持一个上传文件");
                return false;
            } else {
                return $('#up-files').click();
            }
        });
        $('#up-files').on('change', function (e) {
            $.EventFn(e);
            var sign = fileLimit($(this));
            var filepath = $('#up-files').val();
            var extStart = filepath.lastIndexOf(".");
            var ext = filepath.substring(extStart, filepath.length).toUpperCase();
            if (ext != ".XLSX" && ext != ".XLS" && ext != ".TXT") {
                $.Alert("请上传txt或excle文件");
                return false;
            }
            if (sign.flag) {
                uploadFujian(sign.name);
            }
        });
        //  上传附件
        function uploadFujian(name, dictFileUpType) {
            $('#form_file').ajaxForm({
                url: Base.sitUrl + '/api/file/upload',
                beforeSend: function () {
                    $.BlockUI();
                },
                complete: function () {
                    $.UnblockUI();
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var url = 'http://' + res.data;
                    var html = '<li data-url="' + url + '" style="display: inline-block;padding: 5px 0;"><i class=""></i><span class="filesName">' + name + '</span> <span class="file-del">删除</span></li>';
                    $('#addFiles').prepend(html);
                }
            }).submit();
        }

        //添加附件.模板
        $(".add-attachment1").unbind('click').on('click', function () {
            return $('#up-files1').click();
        });
        $('#up-files1').on('change', function (e) {
            $.EventFn(e);
            var sign = fileLimit($(this));
            if (sign.flag) {
                uploadFujian1(sign.name, sign.size);
            }
        });
        //  上传附件
        function uploadFujian1(name, size) {
            $('#form_file1').ajaxForm({
                url: Base.sitUrl + '/api/file/upload',
                beforeSend: function () {
                    $.BlockUI();
                },
                complete: function () {
                    $.UnblockUI();
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var url = 'http://' + res.data;
                    var html = '<li data-url="' + url + '" style="display: inline-block;padding: 5px 0;margin:0 5px;" data-size="' + (size / 1024).toFixed(2) + '"><i class="pub-icon fujian-excl-iocn"></i><span class="filesName">' + name + '</span>&nbsp;&nbsp;<span style="color:#89c682;">文件上传成功！</span> <span class="file-del">删除</span></li>';
                    $('#addFiles1').show();
                    $('#addFiles1').prepend(html);
                }
            }).submit();
        }

        function fileLimit(obj) {
            var flag = true;
            var fileObj = obj.prop('files');
            var size = Math.round(fileObj[0].size / 1024 * 100) / 100 / 1024;//MB
            var sizeS = fileObj[0].size;
            if (size > 5) {
                $.Alert('上传附件需小于5MB');
                flag = false;
            }
            return {flag: flag, name: fileObj[0].name, size: sizeS};
        }

        //删除附件
        $(document).on('click', '.file-del', function () {
            $(this).parents("li").remove();
        });


        //插入图片
        $(".add-images").unbind('click').on('click', function () {
            $('input[name=upImgs]').click();
            $('input[name=upImgs]').unbind('change').on('change', function (e) {
                $.EventFn(e);
                var sign = fileLimit($(this));
                if (sign.flag) {
                    uploadImg(sign.name);
                }
            });
        });
        //  上传图片
        function uploadImg(name, dictFileUpType) {
            $('#form_img').ajaxForm({
                url: Base.sitUrl + '/api/file/upload',
                beforeSend: function () {
                    $.BlockUI();
                },
                complete: function () {
                    $.UnblockUI();
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var url = 'http://' + res.data;
                    var html2 = '<img style="max-width:300px;" src="' + url + '" alt="图片" />';
                    UE.getEditor('letterEditor').execCommand('insertimage', {
                        src: url,
                        width: '300',
                        height: 'auto'
                    });
                }
            }).submit();
        }

        //插入模板
        $(".add-tem").unbind('click').on('click', function (e) {
            $.EventFn(e);
            if ($("#custModels").css("display") == "block") {
                $("#custModels").hide();
            } else {
                $("#custModels").show();
            }

        });
        $('#stepThree').on('click', '.add-model li', function (e) {
            $.EventFn(e);
            var val = $(this).attr('data-value');
            UE.getEditor('letterEditor').execCommand('inserthtml', val);
            $('#custModels').hide();
        });
        //获取模板
        function insertModel() {
            var data = {};
            $.ajax({
                url: Base.sitUrl + '/api/email/setting/v1/templates/search',
                type: 'GET',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var data = res.data;
                    var html = '';
                    for (var i = 0; i < data.length; i++) {
                        html += '<li data-value="' + data[i].value + '">' + data[i].name + '</li>';
                    }
                    $('.add-model').empty();
                    $('.add-model').append(html);
                }
            });
            return data;
        }

        //插入联系人
        $(".add-cont").unbind('click').on('click', function (e) {
            $.EventFn(e);
            var val = '#contactname#';
            UE.getEditor('letterEditor').execCommand('inserthtml', val);
        })
        //获取主题名称
        function themeName() {
            var subject = $("#subject").val();
            var subject1 = $("#subject1").val();
            var subject2 = $("#subject2").val();
            var subject3 = $("#subject3").val();
            var themeName = '"subject":"' + subject + '","subject1":"' + subject1 + '","subject2":"' + subject2 + '","subject3":"' + subject3 + '"';
            return themeName;
        }

        //获取第三部数据
        function temData() {
            var fileLi = $("#addFiles1").find("li");
            var filesData = "";
            var attachments = "";
            for (var i = 0; i < fileLi.length; i++) {
                var url = fileLi.eq(i).attr("data-url");
                var name = fileLi.eq(i).find(".filesName").text();
                var size = fileLi.eq(i).attr("data-size");
                var file = {
                    fileUrl: url,
                    filename: name,
                    size: parseInt(size)
                };
                fileJson = JSON.stringify(file) + ',';
                filesData += fileJson;
            }
            filesData = filesData.substring(0, filesData.length - 1);
            attachments = '[' + filesData + ']'
            return attachments;
        }

        //字段空值
        function testNull(test) {
            if (test == null || test == undefined) {
                return "";
            } else {
                return test;
            }
        }

        //字段为零
        function test0(test) {
            if (test == null || test == undefined || test == "") {
                return 0;
            } else {
                return test;
            }
        }

        function data() {
            var content = getContent();
            content = content.replace(/"/g, "&#39;");
            var theme = themeName();
            var attachments = temData();
            var data = '{' + theme +
                ',"content":"' + content +
                '","addressMode":' + 2 +
                ',"address":' + '{' + addressModeData + '}' +
                ',"attachments":' + attachments +
                '}';
            if (content == "") {
                return $.Alert("邮件内容不能为空")
            } else {
                return data;
            }
        }

        //剩余开发信
        function surplusNum() {
            $.ajax({
                url: Base.sitUrl + '/api/edm/v1/over/count',
                type: 'GET',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    if (res.data == null) {
                        res.data = 0
                    }
                    $("#surplusNum").text(res.data);
                }
            })
        }

        //进入第四步&&发送
        $("#submit").on('click', function () {
            var dataJson = data();
            $.ajax({
                url: Base.sitUrl + '/api/edm/v1/send',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: dataJson
                },
                // beforeSend: function( XHR ){
                //     $.BlockUI();
                // },
                success: function (res) {
                    if (res.success) {
                        $("#stepFour").show();
                        $("#stepFour").siblings(".stepBlock").hide();
                        $("#stepShow").empty();
                        $("#stepShow").append('<img src="../images/step4.png">');
                        setTimeout('$.DestroyPopInPop()', 5000);
                        var maxtime = 5 //一个小时，按秒计算，自己调整!   
                        $.CountDown = function () {
                            if (maxtime >= 0) {
                                seconds = Math.floor(maxtime % 60);
                                seconds = seconds >= 10 ? seconds : '0' + seconds;
                                msg = seconds;
                                $("#setTimeout").text(msg);
                                --maxtime;
                            } else {
                                clearInterval(timer);
                            }
                        }
                        timer = setInterval("$.CountDown()", 1000);
                        setTimeout('parent.location.reload()', 5500);
                    } else {
                        $.unLogin(res);
                    }
                }
            });
        });
        //主题添加联系人
        $("#addContTheme").bind('click', function () {
            if ($(".contTheme").css("display") == 'block') {
                $(".contTheme").hide();
            } else {
                $(".contTheme").show();
            }
        });
        $('#themecheckbox1').bind('click', function () {
            if ($(this).prop('checked') == true) {
                $("#subject1").insertContent("#contactname#");
            } else {
                var subject = $("#subject1").val();
                var noneName = subject.replace(/#contactname#/g, "");
                $("#subject1").val(noneName)
            }
        });
        $('#themecheckbox2').bind('click', function () {
            if ($(this).prop('checked') == true) {
                $("#subject2").insertContent("#contactname#");
            } else {
                var subject = $("#subject2").val();
                var noneName = subject.replace(/#contactname#/g, "");
                $("#subject2").val(noneName)
            }
        });
        $('#themecheckbox3').bind('click', function () {
            if ($(this).prop('checked') == true) {
                $("#subject3").insertContent("#contactname#");
            } else {
                var subject = $("#subject3").val();
                var noneName = subject.replace(/#contactname#/g, "");
                $("#subject3").val(noneName)
            }
        });
        //光标所在位置插入内容
        (function ($) {
            $.fn.extend({
                insertContent: function (myValue, t) {
                    var $t = $(this)[0];
                    if (document.selection) { //ie 
                        this.focus();
                        var sel = document.selection.createRange();
                        sel.text = myValue;
                        this.focus();
                        sel.moveStart('character', -l);
                        var wee = sel.text.length;
                        if (arguments.length == 2) {
                            var l = $t.value.length;
                            sel.moveEnd("character", wee + t);
                            t <= 0 ? sel.moveStart("character", wee - 2 * t - myValue.length) : sel.moveStart("character", wee - t - myValue.length);
                            sel.select();
                        }
                    } else if ($t.selectionStart || $t.selectionStart == '0') {
                        var startPos = $t.selectionStart;
                        var endPos = $t.selectionEnd;
                        var scrollTop = $t.scrollTop;
                        $t.value = $t.value.substring(0, startPos) + myValue + $t.value.substring(endPos, $t.value.length);
                        this.focus();
                        $t.selectionStart = startPos + myValue.length;
                        $t.selectionEnd = startPos + myValue.length;
                        $t.scrollTop = scrollTop;
                        if (arguments.length == 2) {
                            $t.setSelectionRange(startPos - t, $t.selectionEnd + t);
                            this.focus();
                        }
                    } else {
                        this.value += myValue;
                        this.focus();
                    }
                }
            })
        })(jQuery);
        //名片
        $('.tableCont').unbind('mouseenter').on('mouseenter', '.liEmail', function () {
            var val = $(this).find('.liEmailLabel').text();
            var html = emailAccountCard(val);
            $(this).parents('li').find('.sender-condition-style').empty();
            $(this).parents('li').find('.sender-condition-style').append(html);
            if ($(this).parents('li').attr('data-num') == '1') {
                var top = $(this).find('.sender-condition-style').height() - 10;
                var h = '-' + top + 'px';
                $(this).find('.sender-condition-style').css('top', h)
            }
            $(this).parents('li').find('.sender-condition-style').show();
        })
        $('.tableCont').on('mouseleave', '.liEmail', function () {
            $(this).parents('li').find('.sender-condition-style').hide();
        });
        function emailAccountCard(val) {
            var data = {
                value: val
            }
            var html;
            $.ajax({
                url: Base.sitUrl + '/api/email/v1/visitingcard',
                type: 'POST',
                dataType: 'json',
                async: false,
                data: {
                    data: JSON.stringify(data)
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return
                    }
                    ;
                    var data = res.data;
                    var tx = data.status;
                    var gh = data.isHighSeas;
                    var comp = data.customerName;
                    var gonghai = '';
                    if (gh == 1) {
                        gonghai = '<span>公海</span>';
                    }
                    switch (tx) {
                        case 1:
                            html2 = '<ul><li>' +                //陌生发件人
                                '<div class="sender-condition">' +
                                '<div class="sender-condition-img"><span class="ellipsis sender-condition-name">' + data.title + '</span></div>' +
                                '<button type="button" class="btn btn-primary btn-lg btn-block btn-blockAdd">添加为联系人</button>' +
                                '<div class="btn-group condition-cz-btn" role="group" style="margin-left:-118px;"><button type="button" class="btn btn-default newtongxunlu">添加通讯录</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                                '</div>' +
                                '</li></ul>';
                            break;
                        case 2:
                            html2 = '<ul><li>' +                //通讯录好友
                                '<div class="sender-condition">' +
                                '<div class="sender-condition-img"><span class="ellipsis sender-condition-name">' + data.title + '</span></div>' +
                                '<button type="button" class="btn btn-primary btn-lg btn-block btn-blockAdd">添加为联系人</button>' +
                                '<div class="btn-group condition-cz-btn" role="group" style="margin-left:-118px;"><button type="button" class="btn btn-default tongxunlu">通讯录好友</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                                '</div>' +
                                '</li></ul>';
                            break;
                        case 3://我的联系人
                            html2 = '<ul><li data-customer="' + data.customerId + '" data-cont="' + data.customerContactsId + '">' +
                                '<div class="sender-condition">' +
                                '<div class="sender-condition-img"><span class="ellipsis sender-condition-name">' + data.title + '</span></div>' +
                                '<div class="company-info"><i class="pub-icon ding-icon"></i><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                                '<div class="belong-yewuy"><label>所属业务员：</label><span>' + data.salesmanName + '</span></div>' +
                                '<button type="button" class="btn btn-primary btn-lg btn-block btn-blockDetail">查看联系人</button>' +
                                '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin">写跟进</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                                '</div>' +
                                '</li></ul>';
                            break;
                        case 4://我的客户
                            html2 = '<ul><li data-customer="' + data.customerId + '">' +
                                '<div class="sender-condition">' +
                                '<div class="sender-condition-img"><span class="ellipsis sender-condition-name">' + data.title + '</span></div>' +
                                '<div class="company-info"><i class="pub-icon ding-icon"></i><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                                '<div class="belong-yewuy"><label>所属业务员：</label><span>' + data.salesmanName + '</span></div>' +
                                '<button type="button" class="btn btn-primary btn-lg btn-block btn-blockAdd">添加为联系人</button>' +
                                '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin" disabled>写跟进</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                                '</div>' +
                                '</li></ul>';
                            break;
                        case 5://公海联系人
                            html2 = '<ul><li data-id="' + data.id + '" data-customer="' + data.customerId + '">' +
                                '<div class="sender-condition">' +
                                '<div class="sender-condition-img"><i class="pub-icon sender3-icon" style="top:0;"></i><span class="ellipsis sender-condition-name">' + data.title + '</span></div>' +
                                '<div class="company-info"><i class="pub-icon ding-icon"></i><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                                '<div class="belong-yewuy"><label>所属业务员：</label>' + gonghai + '</div>' +
                                '<button type="button" class="btn btn-primary btn-lg btn-block btn-privateCont">添加到私海</button>' +
                                '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin" disabled>写跟进</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                                '</div>' +
                                '</li></ul>';
                            break;
                        case 6://公海客户
                            html2 = '<ul><li data-id="' + data.id + '" data-customer="' + data.customerId + '">' +
                                '<div class="sender-condition">' +
                                '<div class="sender-condition-img"><i class="pub-icon sender3-icon" style="top:0;"></i><span class="ellipsis sender-condition-name">' + data.title + '</span></div>' +
                                '<div class="company-info"><i class="pub-icon ding-icon"></i><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                                '<div class="belong-yewuy"><label>所属业务员：</label>' + gonghai + '</div>' +
                                '<button type="button" class="btn btn-primary btn-lg btn-block btn-privateCust">添加到私海</button>' +
                                '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin" disabled>写跟进</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                                '</div>' +
                                '</li></ul>';
                            break;
                        case 7://同事联系人
                            html2 = '<ul><li data-id="' + data.id + '" data-customer="' + data.customerId + '">' +
                                '<div class="sender-condition">' +
                                '<div class="sender-condition-img"><i class="pub-icon sender2-icon" style="top:0;"></i><span class="ellipsis sender-condition-name">' + data.title + '</span></div>' +
                                '<div class="company-info"><i class="pub-icon ding-icon"></i><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                                '<div class="belong-yewuy"><label>所属业务员：</label><span>' + data.salesmanName + '</span></div>' +
                                '<button type="button" class="btn btn-default btn-lg btn-block btn-blockDetail btn-gray" disabled>查看联系人</button>' +
                                '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin" disabled>写跟进</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go" disabled>往来邮件</button></div>' +
                                '</div>' +
                                '</li></ul>';
                            break;
                        case 8://同事客户
                            html2 = '<ul><li data-id="' + data.id + '" data-customer="' + data.customerId + '">' +
                                '<div class="sender-condition">' +
                                '<div class="sender-condition-img"><i class="pub-icon sender2-icon" style="top:0;"></i><span class="ellipsis sender-condition-name">' + data.title + '</span></div>' +
                                '<div class="company-info"><i class="pub-icon ding-icon"></i><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                                '<div class="belong-yewuy"><label>所属业务员：</label><span>' + data.salesmanName + '</span></div>' +
                                '<button type="button" class="btn btn-default btn-lg btn-block btn-gray btn-blockAdd" disabled>添加联系人</button>' +
                                '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin" disabled>写跟进</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go" disabled>往来邮件</button></div>' +
                                '</div>' +
                                '</li></ul>';
                            break;
                    }
                    html = html2;
                }
            })
            return html;
        }

        //点击卡片写跟进
        $('.tableCont').on('click', '.xiegenjin', function (e) {
            $.EventFn(e);
            var id = $(this).closest('tr').find('input[name=batch]').attr('data-id');
            maintab.showTab(Base.url + '/html/pop-upload.html?id=' + id + "&v=" + window.ver, '写跟进');
        });
        //点击卡片添加通讯录
        $('.tableCont').on('click', '.newtongxunlu', function (e) {
            $.EventFn(e);
            var id = $(this).closest('tr').find('input[name=batch]').attr('data-id');
            maintab.showTab(Base.url + '/html/pop-statistics-new.html?id=' + id + "&v=" + window.ver, '新建通讯录');
        });
        //点击卡片通讯录
        $('.tableCont').on('click', '.tongxunlu', function (e) {
            $.EventFn(e);
            var id = $(this).closest('tr').find('input[name=batch]').attr('data-id');
            maintab.showTab(Base.url + '/html/email-statistics.html' + "?&v=" + window.ver, '通讯录');
        });
        //点击卡片发邮件
        $('.tableCont').on('click', '.fayoujian', function (e) {
            $.EventFn(e);
            var id = $(this).closest('tr').find('input[name=batch]').attr('data-id');
            maintab.showTab(Base.url + '/html/pop-email-new.html?type=0&id=' + id + "&v=" + window.ver, '发邮件');
        });
        //添加客户到私海
        $('.tableCont').on('click', '.btn-privateCust', function (e) {
            $.EventFn(e);
            var id = $(this).closest('tr').find('input[name=batch]').attr('data-id');
            var data = {
                id: id
            }
            var $oThis = $(this)
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/into/private/seas',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: JSON.stringify(data)
                },
                success: function (res) {
                    $oThis.text('已添加到私海')
                }
            })
        });
        //添加联系人到私海
        $('.tableCont').on('click', '.btn-privateCont', function (e) {
            $.EventFn(e);
            var id = $(this).closest('tr').find('input[name=batch]').attr('data-id');
            var data = {
                id: id
            }
            var $oThis = $(this)
            $.ajax({
                url: Base.sitUrl + '/api/customer/contacts/v1/into/private/seas',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: JSON.stringify(data)
                },
                success: function (res) {
                    $oThis.text('已添加到私海')
                }
            })
        });

        //点击卡片往来邮件
        $('.tableCont').on('click', '.come-go', function (e) {
            $.EventFn(e);
            var email = $(this).parent().prevAll('.sender-condition-img').find('.sender-condition-name').text();
            maintab.showTab(Base.url + '/html/pop-come-go-email.html?email=' + email + "&v=" + window.ver, '往来邮件');
        });
        //  添加为联系人
        $('.tableCont').on('click', '.btn-blockAdd', function (e) {
            $.EventFn(e);
            var name = $(this).parents('li').find(".liEmailLabel").text();
            maintab.showTab(Base.url + '/html/pop-contacts-add.html?name=' + name + '&v=' + window.ver, '添加联系人');
        });
        //  查看联系人
        $('.tableCont').on('click', '.btn-blockDetail', function (e) {
            $.EventFn(e);
            var id = $(this).parents('li').attr('data-cont');
            maintab.showTab(Base.url + '/html/pop-relation-detail.html?id=' + id + "&v=" + window.ver, '联系人详情');
        });
        //查看公司
        $('.tableCont').on('click', '.company-name', function (e) {
            $.EventFn(e);
            var id = $(this).parents('li').attr('data-customer');
            maintab.showTab(Base.url + '/html/pop-customer-detail.html?id=' + id + "&v=" + window.ver, '客户详情');
        });

        $.getFrame = function (h) {//frame自适应
            var spaceH = $('html').height() - $('#header-h').height() - 30
            if (spaceH > h) {
                $('.email-detail-main').height(spaceH)
            } else {
                $('.email-detail-main').height(h)
            }
        }
    });
});
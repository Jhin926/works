/* !
 *  用于新建开发信
 */
require([ 'common' ], function () {
    require(['maintab', 'ZeroClipboard', 'ueditorLang', 'blockUI', 'jqform'], function (maintab, ZeroClipboard) {
        window['ZeroClipboard'] = ZeroClipboard;
        maintab.init();
        //设置导航切换
        $('#setLetterNav>li').bind('click', function (e) {
            $.EventFn(e);
            if ($(this).hasClass('current')) {
                return;
            }
            $(this).addClass('current').siblings().removeClass('current');
            var id = $(this).index();
            $('.rightShowList').eq(id).addClass('activities').siblings().removeClass('activities');
        });

        //显示更多邮箱
        $('.showMore').on('click', function (e) {
            $.EventFn(e);
            $('.upLoad-list').css('height', 'auto');
        });

        var editors = {
            letter: null,
            type: null,
            toolbars: [
                [
                    'fontfamily', //字体
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
                var devltnum = $("#surplusNum").text();
                devltnum = parseInt(devltnum);
                if ($(document).find(".bkColor").length < 1) {
                    $.Alert("请选择要发送的客户")
                } else if ($("#addFiles").find("li").length < 1 && $("#groupEmail").text() == "0" && $("#copyEmail").text() == "0" && $("#FilterEmail").text() == "0") {
                    $.Alert("请选择要发送的客户")
                } else {
                    $("#stepTwo").show();
                    $("#stepTwo").siblings(".stepBlock").hide();
                    $("#stepShow").empty();
                    $("#stepShow").append('<img src="../images/step2.png">');
                }
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
                    var spanH = '<span class="emailAccount left errorSpan" title="邮箱格式错误">' +
                        '<label style="float:left;width:16px;height:16px;display:inline-block;color:#fff;' +
                        'border-radius:50%;background:red;padding-top:2px;padding-left:6px;' +
                        'margin-right:3px;font-size:12px;">!</label>' +
                        '<label class="emailLabel" style="color:red">' + val + '</label><i class="i-emailClose"></i><div class="sender-condition-style"></div></span>';
                    $(".stepCont2 input").before(spanH);
                    $(".stepCont2 input").val("");
                } else {
                    var spanH = '<span class="emailAccount left successSpan"><i class="s-customer left"></i><label class="emailLabel">' + val + '</label><i class="i-emailClose"></i><div class="sender-condition-style"></div></span>';
                    $(".stepCont2 input").before(spanH);
                    $(".stepCont2 input").val("");
                }
                $("#copyEmail").parent().show();
                $("#copyEmail").text($(".stepCont2").find(".successSpan ").length);
                var all = $("#surplusNum").text();
                if ($(".stepCont2").find(".successSpan ").length > all) {
                    $("#prompt").show();
                } else {
                    $("#prompt").hide();
                }
            }
            if (event.keyCode == 8 && val == "") {
                $(this).prev("span").remove();
                $("#copyEmail").text($(".stepCont2").find(".successSpan ").length);
            }
        });
        //input焦点
        $(".stepCont2").unbind('click').on('click', function () {
            $(this).find(".inputEmail").focus();
        });
        //第一大步编辑状态切换
        $("#stepOne .step").unbind('click').on('click', function () {
            $(this).find(".stepCont").show();
            $(this).addClass("bkColor");
            $(this).find(".stepTitle").hide();
            $(this).siblings(".step").find(".stepCont").hide();
            $(this).siblings(".step").find(".stepTitle").show();
            $(this).siblings(".step").removeClass("bkColor");
        });
        //删除邮箱粘贴
        $("#accountEmail2").on('click', '.i-emailClose', function () {
            $(this).parents(".emailAccount").remove();
            $("#copyEmail").text($(".stepCont2").find(".successSpan").length);
        });
        //模板选择
        $("#custModels>p>a").on('click', function () {
            $(this).addClass("active");
            $(this).siblings().removeClass('active');
        });
        // $('#tagsUl').click(function(e){
        //     $.EventFn(e);
        // })
        $('body').click(function () {
            $('#tagsUl').hide();
        })
        $(document).unbind('click').on('click', '#tagsUl>li', function () {//单选或者多选
            $('#tagsUl').show();
            var val = $(this).text();
            var id = $(this).attr("data-value");
            var valSpan = '<span data-id="' + id + '" style="display:inline-block;margin:3px 0">' + val + '</span>';
            if ($(this).find("input[type=checkbox]").prop("checked") == true) {
                if ($("#tags").text() == "") {
                    var valSpan = '<span data-id="' + id + '" style="display:inline-block;margin:3px 0">' + val + '</span>';
                    $("#tags").append(valSpan);
                } else {
                    var valSpan = '<span data-id="' + id + '" style="display:inline-block;margin:3px 0">,' + val + '</span>';
                    $("#tags").append(valSpan);
                }
                // $(this).find("input[type=checkbox]").prop("checked",false);
            } else {
                var tags = $("#tags").find("span");
                for (var i = 0; i < tags.length; i++) {
                    var tagsStr = tags.eq(i).text();
                    if (tagsStr.substring(0, 1) == ",") {
                        var tagsStr = tagsStr.substring(1, tagsStr.length);
                    }
                    if (val == tagsStr) {
                        tags.eq(i).remove();
                    }
                }
                var Str = $("#tags").find("span").eq(0).text();
                var firstStr = Str.substring(0, 1);
                if (firstStr == ",") {
                    var id = $("#tags").find("span").eq(0).attr("data-id");
                    var tagsText = Str.substring(1, Str.length);
                    $("#tags").find("span").eq(0).text(tagsText);
                }
            }
        });
        //添加附件
        $(".add-attachment").unbind('click').on('click', function () {
            // if($("#addFiles").children("li").length > 0){
            //     $.Alert("只支持一个上传文件");
            //     return false;
            // }else{
            //     return $('#up-files').click();
            // }
            return $('#up-files').click();
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
                    $('#addFiles').empty();
                    var html = '<li data-url="' + url + '" style="display: inline-block;padding: 5px 0;"><i class=""></i><span class="filesName">' + name + '</span> 上传成功！</li>';
                    $('#addFiles').append(html);
                    $('.add-attachment').text('重新上传');
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
        function emailAccount() {//获取粘贴邮箱账号
            var accountLength = $("#stepOne .successSpan").find(".emailLabel");
            var account = "";
            for (var i = 0; i < accountLength.length; i++) {
                account += '"' + $("#stepOne .successSpan").find(".emailLabel").eq(i).text() + '":"",';
            }
            account = account.substring(0, account.length - 1);
            account = '{' + account + '}'
            return account;
        }

        //获取群发客户
        function attachments3() {
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/customer/email/batch/count',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: '{}'
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    var data = res.data;
                    var highSeasList = "";
                    var noHighSeasList = "";
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].valueI == 1) {
                            highSeasList += '<li style="margin-bottom:10px;"><input type="checkbox" data-id="' + data[i].valueII + '" value="' + data[i].valueV + '" id="highSeas' + i + '"><label for="highSeas' + i + '">' + data[i].valueIII + '</label></li>';
                        } else if (data[i].valueI == 0) {
                            noHighSeasList += '<li style="margin-bottom:10px;"><input type="checkbox" data-id="' + data[i].valueII + '" value="' + data[i].valueV + '" id="noHighSeas' + i + '"><label for="noHighSeas' + i + '">' + data[i].valueIII + '</label></li>';
                        }
                    }
                    $("#noHighSeasUl").empty();
                    $("#noHighSeasUl").append('<li style="margin-bottom:10px;"><input type="checkbox" data-id="" value="0" id="noHighSeasCheckbox"><label for="noHighSeasCheckbox">全部</label></li>');
                    $("#noHighSeasUl").append(noHighSeasList);
                    $("#highSeasUl").empty();
                    $("#highSeasUl").append('<li style="margin-bottom:10px;"><input type="checkbox" data-id="" value="0" id="highSeasCheckbox"><label for="highSeasCheckbox">全部</label></li>');
                    $("#highSeasUl").append(highSeasList);
                }
            })
        }

        $("#starLevel0").on('click', function () {
            if ($(this).parent().attr("class") == 'checked') {
                $("#starLevel").find("input[type=checkbox]").prop("checked", true)
                $("#starLevel").find("input[type=checkbox]").parent().addClass("checked");
            } else {
                $("#starLevel").find("input[type=checkbox]").prop("checked", false)
                $("#starLevel").find("input[type=checkbox]").parent().removeClass("checked");
            }
        })
        function attachments4() {//获取关键词客户
            var star = "";
            var tags = "";
            var productType = "";
            var keyword = $("#noHighSeasName").val();
            var highSeas = $("#seas").find("input[type=radio]:checked").attr("data-highSeas");
            var countries = $("#countryList option:selected").val();
            if ($('#starLevel').find("input[type=checkbox]:checked").length > 0) {
                if ($("#starLevel0").prop("checked") == true) {
                    star = "1,2,3,4,5,";
                } else {
                    for (var i = 0; i < $('#starLevel').find("input[type=checkbox]:checked").length; i++) {
                        star += $('#starLevel').find("input[type=checkbox]:checked").eq(i).attr("data-value") + ',';
                    }
                }
            }
            var starLevel = star.substring(0, star.length - 1);
            var customerGroupId = $("#f-group option:selected").val();
            var containsTags = $("#containsTags").find("input[type=radio]:checked").attr("data-id");
            if ($("#tags").find("span").length > 0) {
                for (var i = 0; i < $("#tags").find("span").length; i++) {
                    tags += $("#tags").find("span").eq(i).attr("data-id") + ',';
                }
            } else {
                tags += '0'
            }
            var tagIds = tags.substring(0, tags.length - 1);
            var latestContactDays = $("#latestContactDays option:selected").val();
            var customerType = $("#f-kinds option:selected").val();
            var status = $("#statusList option:selected").attr("data-id");
            var customerSource = $("#sourceList option:selected").val();
            var productType1 = $("#pdt1 option:selected").val();
            var productType2 = $("#pdt2 option:selected").val();
            var productType3 = $("#pdt3 option:selected").val();
            var productType4 = $("#pdt4 option:selected").val();
            if (productType4 !== undefined && productType4 !== "") {
                productType = productType4;
            } else if (productType3 !== undefined && productType3 !== "") {
                productType = productType3;
            } else if (productType2 !== undefined && productType2 !== "") {
                productType = productType2;
            } else if (productType1 !== undefined && productType1 !== "") {
                productType = productType1;
            }
            var followStatus = $("#seas").find("input[type=radio]:checked").attr("data-highSeas");
            var originalFollowUpUser = $("#followerList option:selected").val();
            var attachments4 = {
                keyword: keyword,
                highSeas: parseInt(test0(highSeas)),
                countries: parseInt(test0(countries)),
                starLevels: starLevel,
                customerGroupId: parseInt(test0(customerGroupId)),
                containsTags: parseInt(test0(containsTags)),
                tagIds: tagIds,
                latestContactDays: parseInt(test0(latestContactDays)),
                customerType: parseInt(test0(customerType)),
                status: parseInt(test0(status)),
                customerSource: parseInt(test0(customerSource)),
                productType: parseInt(test0(productType)),
                followStatus: parseInt(test0(followStatus)),
                originalFollowUpUser: parseInt(test0(originalFollowUpUser))
            }
            var address = JSON.stringify(attachments4);
            return address;
        }

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
            if ($("#myModal").css('display') == 'block') {
                $("#myModal").hide();
                $("#myModal").css('opacity', '0');
            } else {
                $("#myModal").show();
                $("#myModal").css('opacity', '1');
                $("#myModal").css('background', 'rgba(0,0,0,.3)');
            }
        });
        $('#myModal .close,#closeModal').bind('click', function () {
            $("#myModal").hide();
            $("#myModal").css('opacity', '0');
        })
        $('#saveModal').bind('click', function (e) {
            $.EventFn(e);
            var val = $(".add-model").find("input[type=radio]:checked").parents('li').attr('data-value');
            UE.getEditor('letterEditor').execCommand('inserthtml', val);
            $("#myModal").hide();
            $("#myModal").css('opacity', '0');
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
                        html += '<li data-value="' + data[i].value + '"><input type="radio" id="radio' + i + '" style="margin-right:5px;" name="modal"><label for="radio' + i + '" style="display:inline-block;">' + data[i].name + '</label></li>';
                    }
                    $('.add-model').empty();
                    $('.add-model').append(html);
                }
            });
            return data;
        }

        //获取标签
        function leftInfo() {
            $.ajax({
                url: Base.sitUrl + '/api/user/v1/user/tag/list',
                type: 'POST',
                dataType: 'json',
                data: {
                    tagType: 1
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    var tags = res.data,
                        tagsList = "";
                    for (var i = 0; i < tags.length; i++) {
                        tagsList += '<li data-value="' + tags[i].id + '"><input type="checkbox" name="tagsName" id="tagsLi' + i + '"><label for="tagsLi' + i + '">' + tags[i].name + '</label></li>'
                    }
                    $("#tagsUl").empty();
                    $("#tagsUl").append(tagsList);
                }
            })
        }

        //插入联系人
        $(".add-cont").unbind('click').on('click', function (e) {
            $.EventFn(e);
            var val = '#contactname#';
            UE.getEditor('letterEditor').execCommand('inserthtml', val);
        })
        function highseasNum() {//获取群发账号
            var highSeasUl = $("#highSeasUl").find("input[type=checkbox]:checked");
            var noHighSeasUl = $("#noHighSeasUl").find("input[type=checkbox]:checked");
            var highSeas = "";
            var noHighSeas = "";
            var address = ""
            if ($("#highSeasCheckbox").prop("checked") == true) {
                for (var i = 1; i < highSeasUl.length; i++) {
                    highSeas += highSeasUl.eq(i).attr("data-id") + ',';
                }
                highSeas = highSeas.substring(0, highSeas.length - 1);
            } else {
                for (var i = 0; i < highSeasUl.length; i++) {
                    highSeas += highSeasUl.eq(i).attr("data-id") + ',';
                }
                highSeas = highSeas.substring(0, highSeas.length - 1);
            }
            if ($("#noHighSeasCheckbox").prop("checked") == true) {
                for (var i = 1; i < noHighSeasUl.length; i++) {
                    noHighSeas += noHighSeasUl.eq(i).attr("data-id") + ',';
                }
                noHighSeas = noHighSeas.substring(0, noHighSeas.length - 1);
            } else {
                for (var i = 0; i < noHighSeasUl.length; i++) {
                    noHighSeas += noHighSeasUl.eq(i).attr("data-id") + ',';
                }
                noHighSeas = noHighSeas.substring(0, noHighSeas.length - 1);
            }
            address = '{"highSeas":"' + testNull(highSeas) + '","noHighSeas":"' + (noHighSeas) + '"}'
            return address;
        }

        //全选
        $(document).on('click', '#noHighSeasCheckbox', function () {
            if ($(this).prop("checked") == true) {
                $("#noHighSeasUl").find("input[type=checkbox]").prop("checked", true);
            } else {
                $("#noHighSeasUl").find("input[type=checkbox]").prop("checked", false);
            }
        });
        $(document).on('click', '#highSeasCheckbox', function () {
            if ($(this).prop("checked") == true) {
                $("#highSeasUl").find("input[type=checkbox]").prop("checked", true);
            } else {
                $("#highSeasUl").find("input[type=checkbox]").prop("checked", false);
            }
        });
        //选择群发用户数
        $(document).on('click', '#noHighSeasUl input,#highSeasUl input', function () {
            var num1 = 0;
            var num2 = 0;
            for (var i = 0; i < $("#noHighSeasUl").find("input[type=checkbox]:checked").length; i++) {
                num1 += parseInt($("#noHighSeasUl").find("input[type=checkbox]:checked").eq(i).val());
            }
            for (var i = 0; i < $("#highSeasUl").find("input[type=checkbox]:checked").length; i++) {
                num2 += parseInt($("#highSeasUl").find("input[type=checkbox]:checked").eq(i).val());
            }
            var num = num1 + num2;
            $("#groupEmail").parent().show();
            $("#groupEmail").text(num);
            var all = $("#surplusNum").text();
            if (num > all) {
                $("#prompt").show();
            } else {
                $("#prompt").hide();
            }
        });
        //清除选中客户
        $('.blueClose').on('click', function () {
            $(this).prev().text("0");
            var step = $(".bkColor").attr("data-addressmode");
            if (step == 2) {
                $(".stepCont2").find(".emailAccount").remove();
            } else if (step == 3) {
                $("#noHighSeasUl").find("input[type=checkbox]").prop("checked", false);
                $("#highSeasUl").find("input[type=checkbox]").prop("checked", false);
            }
        });
        //选择标签
        $("#tags").on('click', function (e) {
            $.EventFn(e);
            if ($("#tagsRadios1").prop("checked") || $("#tagsRadios2").prop("checked")) {
                if ($(this).attr("data-on") == 1) {
                    $(this).find('span').remove();
                    $(this).attr("data-on", 0);
                }
                if ($("#tagsUl").css("display") == "block") {
                    $("#tagsUl").hide();
                } else {
                    $("#tagsUl").show();
                }
            }
        });
        // //客户标签类型
        // $("#containsTags input").on('click',function(){
        //     if($("#containsTags").find("input").prop(""))
        //     var click = "click";

        // });
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

        //获取状态列表
        function statusList() {
            $.ajax({
                url: Base.sitUrl + '/api/org/v1/org/staff/customer/status/list',
                type: 'POST',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    var data = res.data,
                        list = "";
                    for (var i = 0; i < data.length; i++) {
                        list += '<option data-id="' + data[i].id + '" data-color="' + data[i].colour + '">' + data[i].name + '</option>'
                    }
                    var none = '<option value="">不限</option>';
                    $("#statusList").empty();
                    $("#statusList").append(none);
                    $("#statusList").append(list);
                }
            })
        }

        //获取客户来源
        function clientSource() {
            $.ajax({
                url: Base.sitUrl + '/api/org/v1/org/staff/customer/source/list',
                type: 'POST',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    var data = res.data,
                        list = "";
                    for (var i = 0; i < data.length; i++) {
                        list += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                    }
                    var none = '<option value="">不限</option>';
                    $("#sourceList").empty();
                    $("#sourceList").append(none);
                    $("#sourceList").append(list);
                }
            })
        }

        //获取国家地区列表
        function clientCountry() {
            $.ajax({
                url: Base.sitUrl + '/api/sys/v1/sys/countries/get',
                type: 'POST',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    var data = res.data,
                        list = "";
                    for (var i = 0; i < data.length; i++) {
                        list += '<option value="' + data[i].id + '">' + data[i].cn + ' - ' + data[i].en + '</option>'
                    }
                    var none = '<option value="">不限</option>';
                    $("#countryList").empty();
                    $("#countryList").append(none);
                    $("#countryList").append(list);
                }
            })
        }

        //获取跟进人列表
        function followerList() {
            $.ajax({
                url: Base.sitUrl + '/api/org/v1/org/staff/list',
                type: 'POST',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    var data = res.data,
                        option = "",
                        list = "";
                    for (var i = 0; i < data.length; i++) {
                        option += '<option value="' + data[i].id + '">' + data[i].name + '</option>';
                        list += '<li data-value="' + data[i].id + '">' + data[i].name + '</li>';
                    }
                    var none = '<option value="">不限</option>';
                    $("#followerList").empty();
                    $("#followerList").append(none);
                    $("#followerList").append(option);
                }
            })
        }

        //获取客户类型
        function clientKinds() {
            $.ajax({
                url: Base.sitUrl + '/api/sys/v1/sys/dictionary/get',
                type: 'POST',
                dataType: 'json',
                data: {
                    group: 'customer.type'
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    var data = res.data,
                        list = "";
                    for (var i = 0; i < data.length; i++) {
                        list += '<option value="' + data[i].name + '">' + data[i].value + '</option>'
                    }
                    var none = '<option value="">不限</option>';
                    $("#f-kinds").empty();
                    $("#f-kinds").append(none);
                    $("#f-kinds").append(list);
                }
            })
        }

        //获取分组列表
        function clientGroup() {
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/customer/group/list',
                type: 'POST',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    var data = res.data,
                        list = "";
                    for (var i = 0; i < data.length; i++) {
                        list += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                    }
                    var none = '<option value="">不限</option>';
                    $("#f-group").empty();
                    $("#f-group").append(none);
                    $("#f-group").append(list);
                }
            })
        }

        //获取产品类型
        function pdt1() {
            $.ajax({
                url: Base.sitUrl + '/api/product/v1/product/type/sublist?pid=0',
                type: 'POST',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    var data = res.data,
                        list = "";
                    for (var i = 0; i < data.length; i++) {
                        list += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                    }
                    $("#pdt1").empty();
                    $("#pdt1").append('<option value="">请选择产品类型</option>');
                    $("#pdt1").append(list);
                }
            })
        }

        $("#pdt1").on('change', function () {
            var id = $("#pdt1 option:selected").val();
            $.ajax({
                url: Base.sitUrl + '/api/product/v1/product/type/sublist?pid=' + id,
                type: 'POST',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var data = res.data,
                        list = "";
                    for (var i = 0; i < data.length; i++) {
                        list += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                    }
                    $("#pdt2").empty();
                    $("#pdt2").append('<option value="">请选择产品类型</option>');
                    $("#pdt2").append(list);
                }
            })
        })
        $("#pdt2").on('change', function () {
            var id = $("#pdt2 option:selected").val();
            $.ajax({
                url: Base.sitUrl + '/api/product/v1/product/type/sublist?pid=' + id,
                type: 'POST',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var data = res.data,
                        list = "";
                    for (var i = 0; i < data.length; i++) {
                        list += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                    }
                    $("#pdt3").empty();
                    $("#pdt3").append('<option value="">请选择产品类型</option>');
                    $("#pdt3").append(list);
                }
            })
        })
        $("#pdt3").on('change', function () {
            var id = $("#pdt3 option:selected").val();
            $.ajax({
                url: Base.sitUrl + '/api/product/v1/product/type/sublist?pid=' + id,
                type: 'POST',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    var data = res.data,
                        list = "";
                    for (var i = 0; i < data.length; i++) {
                        list += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                    }
                    $("#pdt4").empty();
                    $("#pdt4").append('<option value="">请选择产品类型</option>');
                    $("#pdt4").append(list);
                }
            })
        })
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
            var addressMode = $(".bkColor").attr("data-addressMode");
            var addressMode1 = '{"url":"' + $("#addFiles").children("li").attr("data-url") + '"}';
            var addressMode2 = emailAccount();
            var addressMode3 = highseasNum();
            var addressMode4 = attachments4();
            var attachments = temData();
            var addressModeData;
            if (addressMode == 1) {
                addressModeData = addressMode1;
            } else if (addressMode == 2) {
                addressModeData = addressMode2;
            } else if (addressMode == 3) {
                addressModeData = addressMode3;
            } else if (addressMode == 4) {
                addressModeData = addressMode4;
            }
            var data = '{' + theme +
                ',"content":"' + content +
                '","addressMode":' + addressMode +
                ',"address":' + addressModeData +
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

        //页面起始
        attachments3();
        statusList();
        clientSource();
        clientGroup();
        clientKinds();
        followerList();
        clientCountry();
        clientSource();
        leftInfo();
        insertModel();
        pdt1();
        surplusNum();


        //筛选
        $("#Filter").on('click', function () {
            var data = attachments4();
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/customer/email/keyword/count',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: data
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    $("#FilterEmail").parent().show();
                    $("#FilterEmail").text(res.data);
                    var all = $("#surplusNum").text();
                    if (res.data > all) {
                        $("#prompt").show();
                    } else {
                        $("#prompt").hide();
                    }
                }
            })
        })
       $(".stepCont").on("change",function(){
           $("#Filter").click();
       })
        //重置
        $("#reset,#resetClose").on('click', function () {
            $(".step-ul").find("input[type=checkbox]").prop("checked", false);
            $(".step-ul").find("input[type=checkbox]").parent().removeClass("checked");
            $("#noHighSeasName").val();
            $("#tagsRadios1").attr("checked", false);
            $("#tagsRadios1").parent().removeClass("checked");
            $("#tagsRadios2").attr("checked", false);
            $("#tagsRadios2").parent().removeClass("checked");
            $("#statusList").find("option").eq(0).attr("selected", "selected");
            $("#latestContactDays").find("option").eq(0).attr("selected", "selected");
            $("#followerList").find("option").eq(0).attr("selected", "selected");
            $("#countryList").find("option").eq(0).attr("selected", "selected");
            $("#sourceList").find("option").eq(0).attr("selected", "selected");
            $("#f-kinds").find("option").eq(0).attr("selected", "selected");
            $("#f-group").find("option").eq(0).attr("selected", "selected");
            $("#pdt1").find("option").eq(0).attr("selected", "selected");
            $("#optionsRadios1").attr("checked", false);
            $("#optionsRadios1").parent().removeClass("checked");
            $("#optionsRadios2").attr("checked", false);
            $("#optionsRadios2").parent().removeClass("checked");
            $("#FilterEmail").text("0");
        })
        //进入第四步&&发送
        $("#submit").on('click', function () {
            $("#stepFour").show().siblings(".stepBlock").hide();
            $("#stepShow").empty().append('<img src="../images/step4.png">');

            var maxtime = 4; //一个小时，按秒计算，自己调整!
            $.CountDown = function () {
                if (maxtime > 0) {
                    $("#setTimeout").text(maxtime);
                    --maxtime;
                } else {
                    clearInterval(timer);
                    parent.location.reload();
                }
            }
            var timer = setInterval("$.CountDown()", 1000);

            var dataJson = data();
            $.ajax({
                url: Base.sitUrl + '/api/edm/v1/send',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: dataJson
                },
                success: function (res) {
                    if (res.success) {

                    } else {
                        clearInterval(timer);
                        $.Alert('发送失败，请重新发送！','',function(){
                            $("#stepThree").show().next().hide();
                            $("#stepThree").siblings(".stepBlock").hide();
                        });
                    }
                }
            });
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

        $(document).on('mouseenter', '.successSpan', function () {
            var val = $(this).find(".emailLabel").text();
            $(this).find(".s-customer").css("background-position", "-45px -52px");
            $(this).css("border", "1px solid #4b73ec");
            $(this).css("color", "#4b73ec");
            $(this).find(".i-emailClose").css("background", "url(../images/blueClose.png) no-repeat 2px 2px");
            if ($(this).find('ul').length > 0) {
                $(this).find('.sender-condition-style').show();
            } else {
                var html = emailAccountCard(val);
                $(this).find('.sender-condition-style').empty();
                $(this).find('.sender-condition-style').append(html);
                $(this).find('.sender-condition-style').show();
            }
        })
        $(document).on('mouseleave', '.successSpan', function () {
            $(this).find(".s-customer").css("background-position", "-27px -110px");
            $(this).css("border", "1px solid #ccc");
            $(this).css("color", "");
            $(this).find(".i-emailClose").css("background", "url(../images/new-icon.png) -317px 2px no-repeat");
            $(this).find('.sender-condition-style').hide();
        });

        //点击卡片写跟进
        $('#accountEmail2').on('click', '.xiegenjin', function (e) {
            $.EventFn(e);
            var id = $(this).closest('tr').find('input[name=batch]').attr('data-id');
            maintab.showTab(Base.url + '/html/pop-upload.html?id=' + id + "&v=" + window.ver, '写跟进');
        });
        //点击卡片添加通讯录
        $('#accountEmail2').on('click', '.newtongxunlu', function (e) {
            $.EventFn(e);
            var name = $(this).parents(".successSpan").find(".emailLabel").text();
            maintab.showTab(Base.url + '/html/pop-statistics-new.html?name=' + name + "&v=" + window.ver, '新建通讯录');
        });
        //点击卡片通讯录
        $('#accountEmail2').on('click', '.tongxunlu', function (e) {
            $.EventFn(e);
            var id = $(this).closest('tr').find('input[name=batch]').attr('data-id');
            maintab.showTab(Base.url + '/html/email-statistics.html' + "?&v=" + window.ver, '通讯录');
        });
        //点击卡片发邮件
        $('#accountEmail2').on('click', '.fayoujian', function (e) {
            $.EventFn(e);
            var id = $(this).closest('tr').find('input[name=batch]').attr('data-id');
            maintab.showTab(Base.url + '/html/pop-email-new.html?type=0&id=' + id + "&v=" + window.ver, '发邮件');
        });

        //点击卡片往来邮件
        $('#accountEmail2').on('click', '.come-go', function (e) {
            $.EventFn(e);
            var email = $(this).parent().prevAll('.sender-condition-img').find('.sender-condition-name').text();
            maintab.showTab(Base.url + '/html/pop-come-go-email.html?email=' + email + "&v=" + window.ver, '往来邮件');
        });
        //  添加为联系人
        $('#accountEmail2').on('click', '.btn-blockAdd', function (e) {
            $.EventFn(e);
            var name = $(this).parents(".successSpan").find(".emailLabel").text();
            maintab.showTab(Base.url + '/html/pop-contacts-add.html?name=' + name + "&v=" + window.ver, '添加联系人');
        });
        //  查看联系人
        $('#accountEmail2').on('click', '.btn-blockDetail', function (e) {
            $.EventFn(e);
            var id = $(this).parents('li').attr('data-cont');
            maintab.showTab(Base.url + '/html/pop-relation-detail.html?id=' + id + "&v=" + window.ver, '联系人详情');
        });
        //查看公司
        $('#accountEmail2').on('click', '.company-name', function (e) {
            $.EventFn(e);
            var id = $(this).parents('li').attr('data-customer');
            maintab.showTab(Base.url + '/html/pop-customer-detail.html?id=' + id + "&v=" + window.ver, '客户详情');
        });
        //添加客户到私海
        $('.accountEmail2').on('click', '.btn-privateCust', function (e) {
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
        $('.accountEmail2').on('click', '.btn-privateCont', function (e) {
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
        })(jQuery)
    });
});



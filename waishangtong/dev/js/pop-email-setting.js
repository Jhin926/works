/* !
 *  用于邮件设置
 */
require([ 'common' ], function () {
    require(['maintab', 'ZeroClipboard', 'ueditorLang', 'blockUI', 'jqform', 'evol'], function (maintab, ZeroClipboard) {
        window['ZeroClipboard'] = ZeroClipboard;
        var taskId = $.GetQueryString('taskId'),
            targetType = 0;
        //选色器
        $(".select-font-color").on('click', function (evt) {
            $(this).find('.cpOther').colorpicker({showOn: 'none'});
            evt.stopImmediatePropagation();
            $(this).find('.cpOther').colorpicker("showPalette");
            $(this).find('.cpOther').on("change.color", function (event, color) {
                $(".color-show").css("background", color);
            });
        });
        //设置导航切换
        $('#setLeftNav>li').bind('click', function () {
            if ($(this).hasClass('current')) {
                return;
            }
            $(this).addClass('current').siblings().removeClass('current');
            var id = $(this).index();
            $('.rightShowList').eq(id).addClass('activities').siblings().removeClass('activities');
        });

        //添加模版
        $('#add-model-btn').on('click', function () {
            $('#add-model-one').hide();
            $('#add-model-two').show();
        });
        $('.glyphicon-menu-left').on('click', function () {
            $('#add-model-one').show();
            $('#add-model-two').hide();
        });

        //添加规则
        $('#add-rule-btn').on('click', function () {
            $('#add-rule-one').hide();
            $('#add-rule-two').show();
        });
        $('.glyphicon-menu-left').on('click', function () {
            $('#add-rule-one').show();
            $('#add-rule-two').hide();
        });

        //自动回复
        $('#add-re-btn').on('click', function () {
            $('#add-re-one').hide();
            $('#add-re-two').show();
        });
        $('.glyphicon-menu-left').on('click', function () {
            $('#add-re-one').show();
            $('#add-re-two').hide();
        });

        //添加附件
        $(".add-attachment").on('click', function () {
            return $('#form_file input[name=upFiles]').click();
        });
        $('#form_file input[name=upFiles]').on('change', function (e) {
            $.EventFn(e);
            var sign = fileLimit($(this));
            if (sign.flag) {
                uploadFujian(sign.name);
            }
        });
        //添加快速文本
        $('.add-files').on('click', '.add-text', function (e) {
            $.EventFn(e);
            $('.textDwon').slideToggle("slow");
            fastText();
        });
        $('.add-files').on('click', '.add-text>.textDwon>li', function (e) {
            $.EventFn(e);
            var val = $(this).attr('data-value');
            UE.getEditor('szidonghuifuEditor').execCommand('inserthtml', val);
            $('.textDwon').hide();
        });
        //获取快速文本
        function fastText() {
            var data = {};
            $.ajax({
                url: Base.sitUrl + '/api/email/setting/v1/qtexts/search',
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
                    $('.textDwon').empty().append(html);
                }
            });
        }

        //  上传附件
        function uploadFujian(name) {
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
                    var html = '<li data-url="' + url + '"><i class="pub-icon fujian-excl-iocn"></i><span>' + name + '</span> <span class="file-del">删除</span></li>';
                    $('#added-files').show();
                    $('#added-files').css('display', 'inline-block');
                    $('#added-files').prepend(html);
                }
            }).submit();
        }

        //删除附件
        $(document).on('click', '.file-del', function () {
            $(this).parents("li").remove();
        })
        //插入图片
        $(".add-images").click(function () {
            $(this).parent().siblings(".form-horizontal").find('input[name=upImgs]').click();
            $(this).parent().siblings(".form-horizontal").find('input[name=upImgs]').on('change', function (e) {
                $.EventFn(e);
                var sign = fileLimit($(this));
                if (sign.flag) {
                    uploadImg(sign.name);
                }
            });
        });

        $(".add-images1").click(function () {
            $(this).parent().siblings(".form-horizontal").find('input[name=upImgs]').click();
            $(this).parent().siblings(".form-horizontal").find('input[name=upImgs]').on('change', function (e) {
                $.EventFn(e);
                var sign = fileLimit($(this));
                if (sign.flag) {
                    uploadImg1(sign.name);
                }
            });
        });
        $(".add-images3").click(function () {
            $(this).parent().siblings(".form-horizontal").find('input[name=upImgs]').click();
            $(this).parent().siblings(".form-horizontal").find('input[name=upImgs]').on('change', function (e) {
                $.EventFn(e);
                var sign = fileLimit($(this));
                if (sign.flag) {
                    uploadImg3(sign.name);
                }
            });
        });

        //添加模板
        $('.add-files').on('click', '.add-model', function (e) {
            $.EventFn(e);
            $('.modelDwon').slideToggle();
            insertModel();
        });
        $('.add-files').on('click', '.add-model>.modelDwon>li', function (e) {
            $.EventFn(e);
            var val = $(this).attr('data-value');
            UE.getEditor('szidonghuifuEditor').execCommand('inserthtml', val);
            $('.modelDwon').hide();
        });
        $('.add-files').on('click', '.add-model1', function (e) {
            $.EventFn(e);
            $('.modelDwon').slideToggle();
            insertModel();
        });
        $('.add-files').on('click', '.add-model1>.modelDwon>li', function (e) {
            $.EventFn(e);
            var val = $(this).attr('data-value');
            UE.getEditor('modelSetEditor').execCommand('inserthtml', val);
            $('.modelDwon').hide();
        });
        //  上传图片
        function uploadImg(name) {
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

                    UE.getEditor('szidonghuifuEditor').execCommand('insertimage', {
                        src: url,
                        width: '300'
                    });
                }
            }).submit();
        }

        function uploadImg1(name) {
            $('#form_img1').ajaxForm({
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

                    UE.getEditor('modelSetEditor').execCommand('insertimage', {
                        src: url,
                        width: '300'
                    });
                }
            }).submit();
        }

        function uploadImg3(name) {
            $('#form_img3').ajaxForm({
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

                    UE.getEditor('qianmingEditor').execCommand('insertimage', {
                        src: url,
                        width: '300'
                    });
                }
            }).submit();
        }

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
                    $('.modelDwon').empty().append(html);
                }
            });
        }

        function fileLimit(obj) {
            var flag = true;
            var fileObj = obj.prop('files');

            var size = Math.round(fileObj[0].size / 1024 * 100) / 100 / 1024;//MB
            if (size > 1) {
                $.Alert('上传附件需小于1MB');
                flag = false;
            }
            return {flag: flag, name: fileObj[0].name};
        }

        var editors = {
            qianming: null,
            zidonghuifu: null,
            zidonghuifus: null,
            modelSet: null,
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
                    'emotion' //表情
                ]
            ],
            /*
             * @createEditor 初始化编辑器
             */
            createEditor: function () {
                editors.qianming = UE.getEditor('qianmingEditor', {
                    'toolbars': editors.toolbars,
                    'initialFrameWidth': "100%",
                    'initialFrameHeight': 200
                });
                editors.zidonghuifus = UE.getEditor('szidonghuifuEditor', {
                    'toolbars': editors.toolbars,
                    'initialFrameWidth': "100%",
                    'initialFrameHeight': 200
                });
                editors.modelSet = UE.getEditor('modelSetEditor', {
                    'toolbars': editors.toolbars,
                    'initialFrameWidth': "100%",
                    'initialFrameHeight': 200
                });
            }
        };
        editors.createEditor();
        var qianming = UE.getEditor('qianmingEditor', {

        });
        var modelSet = UE.getEditor('modelSetEditor', {

        });
        var autoRes = UE.getEditor('szidonghuifuEditor', {

        });
        //常规设置.获取常规
        function normalRe() {
            $.ajax({
                url: Base.sitUrl + '/api/email/setting/v1/config/get',
                type: 'POST',
                dataType: 'json',
                cache: false,
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }
                    var data = result.data;
                    $.ajax({ //模板列表获取
                        url: Base.sitUrl + '/api/email/setting/v1/templates/search',
                        type: 'POST',
                        async: false,
                        dataType: 'json',
                        cache: false,
                        success: function (result) {
                            if (!result.success) {
                                $.Alert(result.message);
                                return;
                            }
                            var data = result.data;
                            for (var i = 0; i < data.length; i++) {
                                var listOption = '<option data-id="' + data[i].id + '" value="' + data[i].name + '">' +
                                    data[i].name + '</option>'
                                $("#defaultTemplate").append(listOption);
                            }
                        }
                    });
                    if (data == "" || data == undefined || data == null) { //id为空时
                        $("#receiveInterval").val();
                        $("#nickname").val();
                        $("#defaultCc").val();
                        $("#defaultBcc").val();
                    } else {
                        $("#receiveInterval").val(data.receiveInterval);
                        $("#font-family option[value=" + data.fontStyle + "]").attr("selected", "selected");
                        $("#font-size option[value=" + data.fontSize + "]").attr("selected", "selected");
                        $(".color-show").css("background", data.fontColour);
                        $(".cpOther").val(data.fontColour);
                        $("#nickname").val(data.nickname);
                        $("#defaultCc").val(data.defaultCc);
                        $("#defaultBcc").val(data.defaultBcc);
                        for (var x = 0; x < $("#defaultTemplate").find("option").length; x++) {
                            if ($("#defaultTemplate").find("option").eq(x).attr("data-id") == data.defaultTemplate) {
                                $("#defaultTemplate").find("option").eq(x).attr("selected", "selected");
                            }
                        }
                    }
                }
            });
        }

        //自动接受间隔时间设定
        $("#receiveInterval").bind('change', function () {
            var val = $(this).val();
            if (val > 60 || val < 5) {
                $.Alert('自动接受间隔时间范围为5-60分钟');
                $(this).val("");
            }
        })
        //常规设置
        $.ajax({
            url: Base.sitUrl + '/api/email/setting/v1/config/get',
            type: 'POST',
            dataType: 'json',
            cache: false,
            success: function (result) {
                if (!result.success) {
                    $.Alert(result.message);
                    return;
                }
                var data = result.data;
                $.ajax({ //模板列表获取
                    url: Base.sitUrl + '/api/email/setting/v1/templates/search',
                    type: 'POST',
                    async: false,
                    dataType: 'json',
                    cache: false,
                    success: function (result) {
                        if (!result.success) {
                            $.Alert(result.message);
                            return;
                        }
                        var data = result.data;
                        for (var i = 0; i < data.length; i++) {
                            var listOption = '<option data-id="' + data[i].id + '" value="' + data[i].name + '">' +
                                data[i].name + '</option>'
                            $("#defaultTemplate").append(listOption);
                        }
                    }
                });
                if (data == "" || data == undefined || data == null) { //id为空时
                    $("#receiveInterval").val('5');
                    $("#nickname").val();
                    $("#defaultCc").val();
                    $("#defaultBcc").val();
                    $("#normolset-save").on('click', function () {
                        var receiveInterval = $("#receiveInterval").val();
                        var replyForwardPrefixStyle = $("#normolset .sf-set-info").find("input[name=1]:checked").attr("data-radio");
                        var fontStyle = $("#font-family").val();
                        var fontSize = $("#font-size").val();
                        var fontColour = $(".cpOther").val();
                        var nickname = $("#nickname").val();
                        var isSpelling = $("#isSpelling").checked ? 1 : 2;
                        var defaultCc = $("#defaultCc").val();
                        var defaultBcc = $("#defaultBcc").val();
                        var defaultTemplate = $("#defaultTemplate").find("option:selected").attr("data-id");
                        var dataUp = '{"receiveInterval":' + receiveInterval +
                            ',"replyForwardPrefixStyle":' + replyForwardPrefixStyle +
                            ',"fontStyle":"' + fontStyle +
                            '","fontSize":"' + fontSize +
                            '","fontColour":"' + fontColour +
                            '","nickname":"' + nickname +
                            '","isSpelling":' + isSpelling +
                            ',"defaultCc":"' + defaultCc +
                            '","defaultBcc":"' + defaultBcc +
                            '","defaultTemplate":' + defaultTemplate + '}'
                        $.ajax({
                            url: Base.sitUrl + '/api/email/setting/v1/config/setting',
                            type: 'POST',
                            dataType: 'json',
                            cache: false,
                            data: {
                                data: dataUp
                            },
                            success: function (res) {
                                if (!res.success) {
                                    $.unLogin(res);
                                    return;
                                }
                                $.Alert("保存成功！");
                                normalRe();
                            }
                        });
                    });
                } else {
                    $("#receiveInterval").val(data.receiveInterval);
                    $("#font-family option[value=" + data.fontStyle + "]").attr("selected", "selected");
                    $("#font-size option[value=" + data.fontSize + "]").attr("selected", "selected");
                    $(".color-show").css("background", data.fontColour);
                    $(".cpOther").val(data.fontColour)
                    $("#nickname").val(data.nickname);
                    $("#defaultCc").val(data.defaultCc);
                    $("#defaultBcc").val(data.defaultBcc);
                    if (data.replyForwardPrefixStyle == 1) {
                        $("#radio1").parent("span").attr("class", "checked");
                        $("#radio2").parent("span").attr("class", "");
                    } else {
                        $("#radio1").parent("span").attr("class", "");
                        $("#radio2").parent("span").attr("class", "checked");
                    }
                    if (data.isSpelling == 1) {//拼写检查
                        $("#isSpelling").parent("span").attr("class", "checked");
                    } else {
                        $("#isSpelling").parent("span").attr("class", "");
                    }
                    if (data.defaultCcOpend == 0) {//默认抄送
                        $("#copyTo").parent("span").attr("class", "checked");
                    } else {
                        $("#copyTo").parent("span").attr("class", "");
                    }
                    if (data.defaultBccOpend == 0) {//默认密送
                        $("#bcCopy").parent("span").attr("class", "checked");
                    } else {
                        $("#bcCopy").parent("span").attr("class", "");
                    }
                    for (var x = 0; x < $("#defaultTemplate").find("option").length; x++) {
                        if ($("#defaultTemplate").find("option").eq(x).attr("data-id") == data.defaultTemplate) {
                            $("#defaultTemplate").find("option").eq(x).attr("selected", "selected");
                        }
                    }
                    $("#normolset-save").on('click', function () {
                        var receiveInterval = $("#receiveInterval").val();
                        var replyForwardPrefixStyle = $("#normolset .sf-set-info").find("input[name=1]:checked").attr("data-radio");
                        var fontStyle = $("#font-family").val();
                        var fontSize = $("#font-size").val();
                        var fontColour = $(".cpOther").val();
                        var nickname = $("#nickname").val();
                        var isSpelling = $("#isSpelling").parent("span").attr("class") == 'checked' ? 1 : 2;
                        var defaultCcOpend = $("#copyTo").parent("span").attr("class") == 'checked' ? 0 : 1;
                        var defaultBccOpend = $("#bcCopy").parent("span").attr("class") == 'checked' ? 0 : 1;
                        var defaultCc = $("#defaultCc").val();
                        var defaultBcc = $("#defaultBcc").val();
                        var defaultTemplate = $("#defaultTemplate").find("option:selected").attr("data-id");
                        var dataUp = '{"id":' + data.id +
                            ',"receiveInterval":' + receiveInterval +
                            ',"replyForwardPrefixStyle":' + replyForwardPrefixStyle +
                            ',"fontStyle":"' + fontStyle +
                            '","fontSize":"' + fontSize +
                            '","fontColour":"' + fontColour +
                            '","nickname":"' + nickname +
                            '","isSpelling":' + isSpelling +
                            ',"defaultCc":"' + defaultCc +
                            '","defaultBcc":"' + defaultBcc +
                            '","defaultTemplate":' + defaultTemplate +
                            ',"defaultCcOpend":' + defaultCcOpend +
                            ',"defaultBccOpend":' + defaultBccOpend + '}'

                        $.ajax({
                            url: Base.sitUrl + '/api/email/setting/v1/config/setting',
                            type: 'POST',
                            dataType: 'json',
                            cache: false,
                            data: {
                                data: dataUp
                            },
                            success: function (res) {
                                if (!res.success) {
                                    $.unLogin(res);
                                    return;
                                }

                                $.Alert("保存成功！");
                                normalRe();
                            }
                        });
                    });
                }
            }
        });

        //分组设置
        // 添加分组
        $(".addGroup").on('click', function () {
            var addCont = '<li data-id="" data-type="1">' +
                '<i class="iconfont group-move"></i>' +
                '<input type="text" class="resource-input" name="">' +
                '<i class="delet-icon">' +
                '</li>';
            $(this).parent("div").prev(".blacklist").append(addCont);
        });
        //分组设置.查询列表
        $("#group-set-li").on('click', function () {
            groupRe();
        });
        function groupRe() {
            $("#group-set ul").children("li").remove();
            $.ajax({
                url: Base.sitUrl + "/api/email/setting/v1/group/get",
                dataType: "json",
                type: "POST",
                cache: false,
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }
                    var data = result.data;
                    for (var i = 0; i < data.length; i++) {
                        var sign = data[i].name.substring(0, 1);
                        var liList = '<li data-id="' + data[i].id + '" data-type="">' +
                            '<i class="iconfont group-move"></i>' +
                            '<input type="text" class="resource-input" value="' + data[i].name + '" placeholder="">' +
                            '<i class="delet-icon"></i>' +
                            '</li>';
                        $("#group-set ul").append(liList);
                    }
                }
            });
        }

        //分组设置删除
        $(document).on('click', '#group-set .delet-icon', function () {
            var id = $(this).parent().attr("data-id");
            $.Confirm("确认删除？", "", function () {
                $.ajax({
                    url: Base.sitUrl + "/api/email/setting/v1/group/delete",
                    dataType: "json",
                    type: "POST",
                    data: {
                        id: id
                    },
                    success: function (result) {
                        if (!result.success) {
                            $.Alert(result.message);
                            return;
                        }
                        $.Alert("删除成功！");
                        groupRe();
                    }
                });
            });
        });
        //分组设置.修改列表
        $("#group-set-save").on('click', function () {
            var liI = $("#group-set ul").children("li");
            var dataJson = "";
            for (var i = 0; i < liI.length; i++) {
                var inputNum = liI.eq(i).find("input[type=text]").val();
                var id = liI.eq(i).attr("data-id");
                if (id == "") {
                    dataJson += '{"value": "' + inputNum + '"},';
                } else {
                    dataJson += '{"id":' + id + ',"value": "' + inputNum + '"},';
                }
                if (inputNum == "") {
                    $.Alert("名称不能为空！");
                    return;
                }
            }
            dataJson = dataJson.substr(0, dataJson.length - 1);
            var dataUp = '{"valueEnters":[' + dataJson + ']}';
            $.ajax({
                url: Base.sitUrl + "/api/email/setting/v1/group",
                dataType: "json",
                type: "POST",
                data: {
                    data: dataUp
                },
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }
                    $.Alert("保存成功！");
                    groupRe();
                }
            });
        });
        //签名获取
        $("#sign-set-li").on('click', function () {
            signRe();
        });
        function signRe() {
            $.ajax({
                url: Base.sitUrl + "/api/email/setting/v1/signature/get",
                dataType: "json",
                type: "POST",
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }

                    var data = result.data;
                    var sign = data.signature.replace(/&#39;/g, '\"');
                    $("#sign-set").attr("data-id", data.id);//用户id
                    setContent(sign); //导入原有签名
                    if (data.isUsing == 1) { //导入是否使用签名
                        $("#sign-checkbox").parent("span").attr("class", "checked");
                    } else {
                        $("#sign-checkbox").parent("span").attr("class", "");
                    }
                }
            });
        }

        //编辑签名
        $("#sign-set-save").on('click', function () {
            var id = $("#sign-set").attr("data-id");
            if (id == '' || id == null || id == undefined) {
                var idStr = '';
            } else {
                var idStr = '"id":' + id + ',';
            }
            var isUsing = "";
            if ($("#sign-checkbox").parent("span").attr("class") == 'checked') {
                isUsing = 1;
            } else {
                isUsing = 2;
            }
            getContent();
            var signature = contentText;
            signature = signature.replace(/"/g, "&#39;");
            var dataUp = '{' + idStr +
                '"signature":"' + signature + '",' +
                '"isUsing":' + isUsing +
                '}';
            $.ajax({
                url: Base.sitUrl + "/api/email/setting/v1/signature/setting",
                dataType: "json",
                type: "POST",
                data: {
                    data: dataUp
                },
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }

                    $.Alert("保存成功！");
                }
            });
        });
        //快速文本添加
        $("#qtextAdd").on('click', function () {
            var addCont = '<li data-id="">' +
                '<input type="text" class="fasttText-t" value="快速文本">' +
                '<textarea class="fasttText" placeholder="感谢您的询盘"></textarea>' +
                '<i class="delet-icon" style="top:-25px;"></i>' +
                '</li>';
            $(this).parent("div").prev(".blacklist").append(addCont);
        });
        //快速文本.查询列表
        $("#qtext-li").on('click', function () {
            qtextRe();
        });
        function qtextRe() {
            $("#qtext ul").children("li").remove();
            $.ajax({
                url: Base.sitUrl + "/api/email/setting/v1/qtexts/search",
                dataType: "json",
                type: "POST",
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }
                    var data = result.data;
                    for (var i = 0; i < data.length; i++) {
                        var liList = '<li data-id="' + data[i].id + '">' +
                            '<input type="text" class="fasttText-t" value="' + data[i].name + '">' +
                            '<textarea class="fasttText" placeholder="感谢您的询盘">' + data[i].value + '</textarea>' +
                            '<i class="delet-icon" style="top:-25px;"></i>' +
                            '</li>';
                        $("#qtext ul").append(liList);
                    }
                }
            });
        }

        //快速文本删除
        $(document).on('click', '#qtext .delet-icon', function () {
            var id = $(this).parent().attr("data-id");
            $.Confirm("确认删除？", "", function () {
                $.ajax({
                    url: Base.sitUrl + "/api/email/setting/v1/qtext/delete",
                    dataType: "json",
                    type: "POST",
                    data: {
                        id: id
                    },
                    success: function (result) {
                        if (!result.success) {
                            $.Alert(result.message);
                            return;
                        }
                        $.Alert("删除成功！");
                        qtextRe();
                    }
                });
            });
        });
        //快速文本.修改列表
        $("#qtext-save").on('click', function () {
            var liI = $("#qtext ul").children("li");
            var dataJson = "";
            for (var i = 0; i < liI.length; i++) {
                var inputNum = liI.eq(i).find("input[type=text]").val();
                if (inputNum == "") {
                    $.Alert("名称不能为空！");
                    return;
                } else {
                    $.ajax({
                        url: Base.sitUrl + '/api/email/setting/v1/qtext/is/exist',
                        type: 'POST',
                        dataType: 'json',
                        async: false,
                        data: {
                            keyword: inputNum
                        },
                        success: function (res) {
                            if (!res.success) {
                                $.unLogin(res);
                                return
                            }
                            if (res.message == null) {
                                var textCont = liI.eq(i).find("textarea").val();
                                var id = liI.eq(i).attr("data-id");
                                if (id == "") {
                                    dataJson += '{"name": "' + inputNum + '","qtext":"' + textCont + '"},';
                                } else {
                                    dataJson += '{"id":' + id + ',"name": "' + inputNum + '","qtext":"' + textCont + '"},';
                                }
                            } else {
                                $.Alert('快速文本名称不能相同');
                                return false;
                            }
                        }
                    })
                }
            }
            dataJson = dataJson.substr(0, dataJson.length - 1);
            if (dataJson == '') {
                $.Alert('服务器异常');
                return;
            }
            var dataUp = '{"emailQTextEnters":[' + dataJson + ']}';
            $.ajax({
                url: Base.sitUrl + "/api/email/setting/v1/qtext/setting",
                dataType: "json",
                type: "POST",
                data: {
                    data: dataUp
                },
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }
                    $.Alert("保存成功！");
                    qtextRe();
                }
            });
        });
        //模板列表查询
        $("#tem-li").on('click', function () {
            $('#add-model-one').show();
            $('#add-model-two').hide();
            temRe();
        })
        function temRe() {
            $("#tem-set .table tbody tr").remove();
            $.ajax({
                url: Base.sitUrl + "/api/email/setting/v1/templates/search",
                type: "POST",
                dataType: "json",
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }
                    var data = result.data;
                    for (var i = 0; i < data.length; i++) {
                        data[i].value = data[i].value.replace(/&#39;/g, "\"");
                        var listTr = '<tr data-id="' + data[i].id + '">' +
                            '<td><label class="ashen temName">' + data[i].name + '</label></td>' +
                            '<td class="content">' + data[i].value + '</td>' +
                            '<td><a href="#" class="ashen temClose">删除</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" class="ashen temEdit">编辑</a></td>' +
                            '</tr>';
                        $("#tem-set .table tbody").append(listTr);
                    }
                }
            });
        }

        //添加模板
        $("#add-model-btn").on('click', function () {
            $("#tem-name").val("");
            var isAppendTo = "";
            temSetContent(isAppendTo);
            $("#tem-add").on('click', function () {
                getContent();
                temText = temText.replace(/"/g, "&#39;");
                var name = $("#tem-name").val();
                var dataEdit = '{"name": "' + name + '","template": "' + temText + '"}';
                $.ajax({
                    url: Base.sitUrl + "/api/email/setting/v1/template/setting",
                    type: "POST",
                    dataType: "json",
                    data: {
                        data: dataEdit
                    },
                    success: function (result) {
                        if (!result.success) {
                            $.Alert(result.message);
                            return;
                        }
                        $('#add-model-one').show();
                        $('#add-model-two').hide();
                        temRe();
                    }
                });
            });
        });
        //删除
        $(document).on('click', '.temClose', function () {
            var id = $(this).parents("tr").attr("data-id");
            $.Confirm("确认删除？", "", function () {
                $.ajax({
                    url: Base.sitUrl + "/api/email/setting/v1/template/delete",
                    type: "POST",
                    dataType: "json",
                    data: {
                        id: id
                    },
                    success: function (result) {
                        if (!result.success) {
                            $.Alert(result.message);
                            return;
                        }
                        temRe();
                    }
                });
            });
        });
        //修改
        $(document).on('click', '.temEdit', function () {
            $('#add-model-one').hide();
            $('#add-model-two').show();
            var id = $(this).parents("tr").attr("data-id");
            var name = $(this).parents("tr").find(".temName").text();
            $("#tem-name").val(name);
            var isAppendTo = $(this).parents("tr").find(".content").html();
            temSetContent(isAppendTo);
            $("#tem-add").unbind('click').on('click', function () {
                getContent();
                temText = temText.replace(/"/g, "&#39;");
                var name = $("#tem-name").val();
                var dataEdit = '{"id":' + id + ',"name": "' + name + '","template": "' + temText + '"}';
                $.ajax({
                    url: Base.sitUrl + "/api/email/setting/v1/template/setting",
                    type: "POST",
                    dataType: "json",
                    data: {
                        data: dataEdit
                    },
                    success: function (result) {
                        if (!result.success) {
                            $.Alert(result.message);
                            return;
                        }
                        $('#add-model-one').show();
                        $('#add-model-two').hide();
                        temRe();
                    }
                });
            });
        });

        //黑名单.查询列表
        $("#blacklist-set-li").on('click', function () {
            blacklistRe();
        });
        function blacklistRe() {
            $("#blacklist-set ul").children("li").remove();
            $.ajax({
                url: Base.sitUrl + "/api/email/setting/v1/blacklist/get",
                dataType: "json",
                type: "POST",
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }
                    var data = result.data;
                    for (var i = 0; i < data.length; i++) {
                        var liList = '<li data-id="' + data[i].id + '">' +
                            '<input type="text" class="resource-input" value="' + data[i].content + '" placeholder="">' +
                            '<i class="delet-icon"></i>' +
                            '</li>';
                        $("#blacklist-set ul").append(liList);
                    }
                }
            });
        }

        //黑名单删除
        $(document).on('click', '#blacklist-set .delet-icon', function () {
            var id = $(this).parent().attr("data-id");
            $.Confirm("确认删除？", "", function () {
                $.ajax({
                    url: Base.sitUrl + "/api/email/setting/v1/blacklist/delete",
                    dataType: "json",
                    type: "POST",
                    data: {
                        id: id
                    },
                    success: function (result) {
                        if (!result.success) {
                            $.Alert(result.message);
                            return;
                        }
                        ;
                        $.Alert("删除成功！");
                        blacklistRe();
                    }
                });
            });
        });
        //黑名单.修改列表
        $("#blacklist-set-save").on('click', function () {
            var liI = $("#blacklist-set ul").children("li");
            var dataJson = "";
            var editData = "";
            var typeVal = "";
            for (var i = 0; i < liI.length; i++) {
                var inputNum = liI.eq(i).find("input[type=text]").val();
                var id = liI.eq(i).attr("data-id");
                var type = 0;
                if (inputNum[0] == "@") {
                    type += 1;
                } else {
                    type += 2;
                }
                if (id == "") {
                    dataJson += '{"type": ' + type + ',"content":"' + inputNum + '"},';
                } else {
                    dataJson += '{"id":' + id + ',"type": ' + type + ',"content":"' + inputNum + '"},';
                }
                if (inputNum == "") {
                    $.Alert("名称不能为空！");
                    return;
                }
            }
            dataJson = dataJson.substr(0, dataJson.length - 1);
            var dataUp = '{"emailBlacklistEnters":[' + dataJson + ']}';
            $.ajax({
                url: Base.sitUrl + "/api/email/setting/v1/blacklist/setting",
                dataType: "json",
                type: "POST",
                data: {
                    data: dataUp
                },
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }
                    $.Alert("保存成功！");
                    blacklistRe();
                }
            });
        });

        //自动回复查询
        $("#auto-res-li").on('click', function () {
            $('#add-re-one').show();
            $('#add-re-two').hide();
            autoresRe();
        })
        function autoresRe() {
            $("#auto-res .table tbody tr").remove();
            $.ajax({
                url: Base.sitUrl + "/api/email/setting/v1/rule/get",
                type: "POST",
                dataType: "json",
                data: {
                    executeType: 2
                },
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }
                    var data = result.data;
                    for (var i = 0; i < data.length; i++) {
                        var isOpen = "";
                        if (data[i].isOpen == 1) {
                            isOpen = "已开启"
                            isClose = "关闭"
                        } else {
                            isOpen = "已关闭"
                            isClose = "开启"
                        }
                        var listTr = '<tr data-id="' + data[i].id + '">' +
                            '<td>' + isOpen + '</td>' +
                            '<td class="td-content">' + data[i].executeContent + '</td>' +
                            '<td class="td-condition">' + data[i].condition + '</td>' +
                            '<td class="td-conditionMeetType">' + data[i].conditionMeetType + '</td>' +
                            '<td data-id="' + data[i].id + '" class="autoName">' + data[i].name + '</td>' +
                            '<td><button class="btn btn-link auto-edit" type="button">修改</button>' +
                            '<button class="btn btn-link caozuo-btn auto-close" type="button">删除</button>' +
                            '<button class="btn btn-link caozuo-btn auto-open" type="button">' + isClose + '</button>' +
                            '</td></tr>';
                        $("#auto-res .table tbody").append(listTr);
                    }
                }
            });
        }

        //添加条件
        var listConditions = '<div class="sf-set-info conditions" style="margin-left:2px;">' +
            '<select class="select-font typeName" style="width: 190px;margin-left:0;">' +
            '<option value="from">发件人名称或邮件地址</option>' +
            '<option value="subject">主题</option>' +
            '<option value="content">全文</option>' +
            '<option value="to">收件人</option>' +
            '<option value="cc">抄送人</option>' +
            '</select>' +
            ' <select class="select-font isOpen" style="width: 100px;">' +
            '<option value="1">包含</option>' +
            '<option value="0">不包含</option>' +
            '</select>' +
            ' <input type="text" style="width: 355px;">' +
            ' <i class="delet-icon"></i>' +
            '</div>';
        $(".conditions-add").on('click', function () {
            $(this).parent().before(listConditions);
        });

        $(document).on('click', '#auto-res .delet-icon,#addressee-rules .delet-icon', function () {
            var Othis = $(this);
            $.Confirm("确认删除条件？", "", function () {
                Othis.parents(".conditions").remove();
            });
        });
        $(".removeAll").on('click', function () {
            var Othis = $(this);
            $.Confirm("确认清空条件？", "", function () {
                Othis.parent().siblings(".conditions").remove();
            });
        })
        //添加自动回复
        $("#add-re-btn").on('click', function () {
            $("#auto-res-name").val("");
            var isAppendTo = "";
            autoResContent(isAppendTo);
            $("#add-re-two").find(".conditions").remove();
            $("#auto-res-save").unbind('click').on('click', function () {
                var id = "";
                autoEdit(id);
            });
        });
        //自动回复编辑
        function autoEdit(id) {
            id += "";
            getContent();
            autoText = autoText.replace(/"/g, "&#39;");
            var RuleConditions = "";
            for (var i = 0; i < $("#auto-res .conditions").length; i++) {
                var value = $("#auto-res .conditions").eq(i).find("input").val();
                var name = $("#auto-res .conditions").eq(i).find(".typeName option:selected").val();
                var isOpen = $("#auto-res .conditions").eq(i).find(".isOpen option:selected").val();
                RuleConditions += '{"name":"' + name + '","value":"' + value + '","isInclude":' + isOpen + '},';
            }
            RuleConditions = RuleConditions.substring(0, RuleConditions.length - 1);
            var name = $("#auto-res-name").val();
            var conditionMeetType = $("#auto-res .select-erji option:selected").val();
            var dataEdit = '{"id":"' + id + '"' +
                ',"userEmail":1' +
                ',"name":"' + name +
                '","triggerEvent": 1' +
                ',"conditionMeetType":' + conditionMeetType +
                ',"executeType": 2' +
                ',"executeContent":"' + autoText +
                '","emailRuleConditions":[' + RuleConditions + ']}';
            $.ajax({
                url: Base.sitUrl + "/api/email/setting/v1/rule/setting",
                type: "POST",
                dataType: "json",
                data: {
                    data: dataEdit
                },
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }
                    $('#add-re-one').show();
                    $('#add-re-two').hide();
                    autoresRe();
                }
            });
        }

        //自动回复.删除
        $(document).on('click', '.auto-close', function () {
            var id = $(this).parents("tr").attr("data-id");
            $.Confirm("确认删除？", "", function () {
                $.ajax({
                    url: Base.sitUrl + "/api/email/setting/v1/rule/delete",
                    type: "POST",
                    dataType: "json",
                    data: {
                        id: id
                    },
                    success: function (result) {
                        if (!result.success) {
                            $.Alert(result.message);
                            return;
                        }
                        autoresRe();
                    }
                });
            });
        });
        //自动回复.开启和关闭
        $(document).on('click', '#auto-res .auto-open', function () {
            var id = $(this).parents("tr").attr("data-id");
            var isOpen = $(this).text();
            if (isOpen == "开启") {
                open = 1
            } else {
                open = 0
            }
            var data = '{"id":' + id + ',"isOpen":' + open + '}';
            $.ajax({
                url: Base.sitUrl + '/api/email/setting/v1/rule/edit',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: data
                },
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }
                    autoresRe();
                }
            })
        })
        //自动回复.修改
        $(document).on('click', '.auto-edit', function () {
            $('#add-re-one').hide();
            $('#add-re-two').show();
            var id = $(this).parents("tr").attr("data-id");
            var name = $(this).parents("tr").find(".autoName").text();
            $("#auto-res-name").val(name);
            var isAppendTo = $(this).parents("tr").find(".td-content").html();
            isAppendTo = isAppendTo.replace(/&#39;/g, '"');
            autoResContent(isAppendTo);
            var condition = $(this).parents("tr").find(".td-condition").html();
            var conditionObj = JSON.parse(condition);
            var conditionMeetType = $(this).parents("tr").find(".td-conditionMeetType").text();
            $("#auto-res .select-erji option[value=" + conditionMeetType + "]").attr("selected", "selected");
            $("#add-re-two").find(".conditions").remove();
            for (var i = 0; i < conditionObj.length; i++) {
                var listCond = '<div class="sf-set-info conditions" style="margin-left:2px;">' +
                    '<select class="select-font typeName" style="width: 190px;margin-left:0;">' +
                    '<option value="from">发件人名称或邮件地址</option>' +
                    '<option value="subject">主题</option>' +
                    '<option value="content">全文</option>' +
                    '<option value="to">收件人</option>' +
                    '<option value="cc">抄送人</option>' +
                    '</select>' +
                    ' <select class="select-font isOpen" style="width: 100px;">' +
                    '<option value="1">包含</option>' +
                    '<option value="0">不包含</option>' +
                    '</select>' +
                    ' <input type="text" style="width: 355px;" value="' + conditionObj[i].value + '">' +
                    ' <i class="delet-icon"></i>' +
                    '</div>';
                $("#auto-res").find("#conditions-add").before(listCond);
                $("#auto-res .conditions").eq(i).find(".typeName option[value=" + conditionObj[i].name + "]").attr("selected", "selected");
                $("#auto-res .conditions").eq(i).find(".isOpen option[value=" + conditionObj[i].isInclude + "]").attr("selected", "selected");
            }
            $("#auto-res-save").unbind('click').on('click', function () {
                autoEdit(id);
            });
        });


        //收件规则查询
        $("#addressee-rules-li").on('click', function () {
            $('#add-model-one').show();
            $('#add-model-two').hide();
            addRules();
        })
        function addRules() {
            $("#add-rule .table tbody tr").remove();
            $.ajax({
                url: Base.sitUrl + "/api/email/setting/v1/rule/get",
                type: "POST",
                dataType: "json",
                data: {
                    executeType: 1
                },
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }
                    var data = result.data;
                    for (var i = 0; i < data.length; i++) {
                        var isOpen = "";
                        if (data[i].isOpen == 1) {
                            isOpen = "已开启"
                            isClose = "关闭"
                        } else {
                            isOpen = "已关闭"
                            isClose = "开启"
                        }
                        var listTr = '<tr data-id="' + data[i].id + '">' +
                            '<td>' + isOpen + '</td>' +
                            '<td class="td-content">' + data[i].executeContent + '</td>' +
                            '<td class="td-condition">' + data[i].condition + '</td>' +
                            '<td class="td-conditionMeetType">' + data[i].conditionMeetType + '</td>' +
                            '<td data-id="' + data[i].id + '" class="autoName">' + data[i].name + '</td>' +
                            '<td><button class="btn btn-link add-rule-edit" type="button">修改</button>' +
                            '<button class="btn btn-link caozuo-btn auto-close" type="button">删除</button>' +
                            '<button class="btn btn-link caozuo-btn auto-open" type="button">' + isClose + '</button>' +
                            '</td></tr>';
                        $("#add-rule .table tbody").append(listTr);
                    }
                }
            });
        }

        //添加收件规则
        $("#add-rule-btn").on('click', function () {
            //初始化内容
            $("#add-rule-name").val("");
            $("#add-rule-two").find(".conditions").remove();
            $("#add-rule .conditions-add").parent().before(listConditions);
            $("#add-rule .select-group").parent().remove();
            var list = '<div class="sf-set-info">' +
                '<div type="text" style="width: 300px;float:left;margin-top:10px;border:1px solid #ddd;padding:8px;">分组到</div>' +
                '<select class="select-font select-group" style="width: 367px;">' +
                '<option data-id="" value="0">分组到</option>' +
                '</select>' +
                '<i class="delet-icon"></i>' +
                '</div>';
            $("#add-rule .addAction").parent().before(list);
            $("#add-rule .select-group").find("option").remove();
            $("#add-rule .select-group").append('<option data-id="" value="0">分组到</option>');
            //获取分组列表
            $.ajax({
                url: Base.sitUrl + '/api/email/setting/v1/group/get',
                type: 'POST',
                dataType: 'json',
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }

                    var data = result.data;
                    for (var i = 0; i < data.length; i++) {
                        var option = '<option data-id="' + data[i].id + '" value="' + data[i].name + '">' +
                            data[i].name +
                            '</option>';
                        $("#add-rule .select-group").append(option);
                    }
                }
            })
            $("#addressee-rules-save").unbind('click').on('click', function () {
                var id = "";
                ruleEdit(id);
            });
        });
        //分组到
        $(document).on('click', '#add-rule .select-group', function () {
            var cont = $(this).val();
            if (cont == 0) {
                cont = "";
            } else {
                cont = $(this).val();
            }
            $(this).next("input").val(cont);
        });
        //添加执行动作
        $("#add-rule .addAction").on('click', function () {
            var list = '<div class="sf-set-info">' +
                '<div type="text" style="width: 300px;float:left;margin-top:10px;border:1px solid #ddd;padding:8px;">分组到</div>' +
                '<select class="select-font select-group" style="width: 367px;">' +
                '<option data-id="" value="0">分组到</option>' +
                '</select>' +
                '<i class="delet-icon"></i>' +
                '</div>';
            $(this).parent().before(list);
            var oThis = $(this)
            $.ajax({
                url: Base.sitUrl + '/api/email/setting/v1/group/get',
                type: 'POST',
                dataType: 'json',
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }

                    var data = result.data;
                    for (var i = 0; i < data.length; i++) {
                        var option = '<option data-id="' + data[i].id + '" value="' + data[i].name + '">' +
                            data[i].name +
                            '</option>';
                        oThis.parent().prev().find(".select-group").append(option);
                    }
                }
            })
        })
        //收件规则编辑&&新增
        function ruleEdit(id) {
            id += "";
            var RuleConditions = "";
            var executeContent = "";
            if ($("#add-rule .conditions").length < 1) {
                $.Alert('请填写条件内容');
                return;
            }
            for (var i = 0; i < $("#add-rule .conditions").length; i++) {
                var value = $("#add-rule .conditions").eq(i).find("input").val();
                var name = $("#add-rule .conditions").eq(i).find(".typeName option:selected").val();
                var isOpen = $("#add-rule .conditions").eq(i).find(".isOpen option:selected").val();
                RuleConditions += '{"name":"' + name + '","value":"' + value + '","isInclude":' + isOpen + '},';
                if (value == '') {
                    $.Alert('请填写条件内容');
                    return;
                }
            }
            if ($("#add-rule .select-group").length < 1) {
                $.Alert('请填写动作内容');
                return;
            }
            for (var x = 0; x < $("#add-rule .select-group").length; x++) {
                executeContent += $("#add-rule .select-group").eq(x).find("option:selected").attr("data-id") + ';';
                if ($("#add-rule .select-group").eq(x).find("option:selected").attr("data-id") == '') {
                    $.Alert('请填写动作内容');
                    return;
                }
            }
            RuleConditions = RuleConditions.substring(0, RuleConditions.length - 1);
            executeContent = executeContent.substring(0, executeContent.length - 1);
            var name = $("#add-rule-name").val();
            if (name == '') {
                $.Alert('请填写规则名称');
                return;
            }
            var conditionMeetType = $("#add-rule .select-erji option:selected").val();
            var dataEdit = '{"id":"' + id + '"' +
                ',"name":"' + name +
                '","triggerEvent": 1' +
                ',"conditionMeetType":' + conditionMeetType +
                ',"executeType": 1' +
                ',"executeContent":"' + executeContent +
                '","emailRuleConditions":[' + RuleConditions + ']}';
            $.ajax({
                url: Base.sitUrl + "/api/email/setting/v1/rule/setting",
                type: "POST",
                dataType: "json",
                data: {
                    data: dataEdit
                },
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }

                    $('#add-rule-one').show();
                    $('#add-rule-two').hide();
                    addRules();
                }
            });
        }

        //收件规则.删除
        $('#add-rule').on('click', '.auto-close', function () {
            var id = $(this).parents("tr").attr("data-id");
            $.Confirm("确认删除？", "", function () {
                $.ajax({
                    url: Base.sitUrl + "/api/email/setting/v1/rule/delete",
                    type: "POST",
                    dataType: "json",
                    data: {
                        id: id
                    },
                    success: function (result) {
                        if (!result.success) {
                            $.Alert(result.message);
                            return;
                        }

                        addRules();
                    }
                });
            });
        });
        //收件规则.删除添加条件
        $('#add-rule').unbind('click').on('click', '.delet-icon', function () {
            $(this).parents('.sf-set-info').remove();
        })
        //收件规则.开启和关闭
        $(document).on('click', '#add-rule .auto-open', function () {
            var id = $(this).parents("tr").attr("data-id");
            var isOpen = $(this).text();
            if (isOpen == "开启") {
                open = 1
            } else {
                open = 0
            }
            var data = '{"id":' + id + ',"isOpen":' + open + '}';
            $.ajax({
                url: Base.sitUrl + '/api/email/setting/v1/rule/edit',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: data
                },
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }

                    addRules();
                }
            })
        })
        //收件规则.修改
        $(document).on('click', '.add-rule-edit', function () {
            $('#add-rule-one').hide();
            $('#add-rule-two').show();
            $("#add-rule .select-group").parent().remove();
            var id = $(this).parents("tr").attr("data-id");
            var name = $(this).parents("tr").find(".autoName").text();
            $("#add-rule-name").val(id);
            var condition = $(this).parents("tr").find(".td-condition").html();//条件数据
            var conditionObj = JSON.parse(condition);//转化为json对象
            var content = $(this).parents("tr").find(".td-content").text();//获取执行动作的数据
            content = '[' + content.replace(/;/g, ',') + ']';//';'转','
            content = eval("(" + content + ")");//转化为对象数组
            for (var i = 0; i < content.length; i++) {
                var list = '<div class="sf-set-info">' +
                    '<div type="text" style="width: 300px;float:left;margin-top:10px;border:1px solid #ddd;padding:8px;">分组到</div>' +
                    '<select class="select-font select-group" style="width: 367px;">' +
                    '<option data-id="" value="0">分组到</option>' +
                    '</select>' +
                    '<i class="delet-icon"></i>' +
                    '</div>';
                $("#add-rule .addAction").parent().before(list);
            }
            $.ajax({//获取分组列表
                url: Base.sitUrl + '/api/email/setting/v1/group/get',
                type: 'POST',
                dataType: 'json',
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }

                    var data = result.data;
                    for (var j = 0; j < $("#add-rule .select-group").length; j++) {
                        for (var i = 0; i < data.length; i++) {
                            var option = '<option data-id="' + data[i].id + '" value="' + data[i].name + '">' +
                                data[i].name +
                                '</option>';
                            $("#add-rule .select-group").eq(j).append(option);
                            $("#add-rule .select-group").eq(j).find("option[data-id=" + content[j] + "]").attr("selected", "selected");
                        }
                    }
                }
            });
            var conditionMeetType = $(this).parents("tr").find(".td-conditionMeetType").text();
            $("#add-rule .select-erji option[value=" + conditionMeetType + "]").attr("selected", "selected");
            $("#add-rule-two").find(".conditions").remove();
            for (var i = 0; i < conditionObj.length; i++) {
                var listCond = '<div class="sf-set-info conditions" style="margin-left:2px;">' +
                    '<select class="select-font typeName" style="width: 190px;margin-left:0;">' +
                    '<option value="from">发件人名称或邮件地址</option>' +
                    '<option value="subject">主题</option>' +
                    '<option value="content">全文</option>' +
                    '<option value="to">收件人</option>' +
                    '<option value="cc">抄送人</option>' +
                    '</select>' +
                    ' <select class="select-font isOpen" style="width: 100px;">' +
                    '<option value="1">包含</option>' +
                    '<option value="0">不包含</option>' +
                    '</select>' +
                    ' <input type="text" style="width: 355px;" value="' + conditionObj[i].value + '">' +
                    ' <i class="delet-icon"></i>' +
                    '</div>';
                $("#add-rule").find("#conditions-add").before(listCond);
                $("#add-rule .conditions").eq(i).find(".typeName option[value=" + conditionObj[i].name + "]").attr("selected", "selected");
                $("#add-rule .conditions").eq(i).find(".isOpen option[value=" + conditionObj[i].isInclude + "]").attr("selected", "selected");
            }
            $("#addressee-rules-save").unbind('click').on('click', function () {
                ruleEdit(id);
            });
        });
        //回复默认
        $('#reset').bind('click', function () {
            $('#font-family option[value=宋体]').attr('selected', true);
            $('#font-size option[value=14px]').attr('selected', true);
            $('.select-font-color').find('span.color-show').css('background', 'rgb(0,0,0)');
        })
        //获取编辑器内容
        function getContent() {
            var arr = [];
            var temArr = [];
            var autoArr = [];
            arr.push(qianming.getContent());
            temArr.push(modelSet.getContent());
            autoArr.push(autoRes.getContent());
            contentText = arr.join("\n");
            temText = temArr.join("\n");
            autoText = autoArr.join("\n");
        }

        //设置编辑器内容.签名
        function setContent(isAppendTo) {
            qianming.setContent(isAppendTo);
        }

        //设置编辑器内容.模板
        function temSetContent(isAppendTo) {
            modelSet.setContent(isAppendTo);
        }

        //设置编辑器内容.自动回复
        function autoResContent(isAppendTo) {
            autoRes.setContent(isAppendTo);
        }

        //导入邮件
        $('#emailIn-li,#uploadEmailF5').bind('click', function () {
            uploadEmailList();
        })
        $("#selectDoc").on('click', function () {
            if ($('#uploadEmailList').find('li').length > 0) {
                $.Alert('只能单个文件上传');
                return;
            }
            return $('#form_fileEmail input[name=upFiles]').click();
        });
        $('#form_fileEmail input[name=upFiles]').on('change', function (e) {
            $.EventFn(e);
            var sign = fileLimitEmail($(this));
            var filepath = $('#up-filesEmail').val();
            var extStart = filepath.lastIndexOf(".");
            var ext = filepath.substring(extStart, filepath.length).toUpperCase();
            if (ext != ".ZIP" && ext != ".EML" && ext != ".PST") {
                $.Alert("请上传eml、pst文件或者eml文件组成的zip压缩包");
                return false;
            }
            if (sign.flag) {
                uploadFujianEmail(sign.name, sign.size, sign.dataSize);
            }
        });
        //  上传附件
        function uploadFujianEmail(name, size, dataSize) {
            $('#form_fileEmail').ajaxForm({
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
                    var html = '<li data-url="' + url + '">' +
                        '<div class="media">' +
                        '<div class="media-left">' +
                        '<img class="media-object" src="../images/excel-icon.jpg" alt="...">' +
                        '</div>' +
                        '<div class="media-body">' +
                        '<h4 class="media-heading">' + name + '</h4>' +
                        '<span data-size="' + dataSize + '">' + size + '</span>' +
                        '</div>' +
                        '<i class="i-remove file-del"></i>' +
                        '</div>' +
                        '</li>';
                    $('#uploadEmailList').prepend(html);
                }
            }).submit();
        }

        function fileLimitEmail(obj) {
            var flag = true;
            var fileObj = obj.prop('files');
            var dataSize = Math.round(fileObj[0].size)
            var size = Math.round(fileObj[0].size / 1024 * 100) / 100 / 1024;//MB
            var kind = 'MB';
            if (size > 50) {
                $.Alert('上传文件需小于50MB');
                flag = false;
            }
            if (size < 1) {
                size = Math.round(fileObj[0].size / 1024 * 100) / 100;
                kind = 'KB'
            }
            size = size.toFixed(2) + kind
            return {flag: flag, name: fileObj[0].name, size: size, dataSize: dataSize};
        }

        function uploadEmail(data) {
            $.ajax({
                url: Base.sitUrl + '/api/email/v1/import/task/save',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: JSON.stringify(data)
                },
                beforeSend: function () {
                    $.BlockUI();
                },
                complete: function () {
                    $.UnblockUI();
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return
                    }
                    uploadEmailList();
                    $('#uploadEmailList').empty();
                }
            })
        }

        function uploadEmailList() {
            $.ajax({
                url: Base.sitUrl + '/api/email/v1/import/task/list',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: '{}'
                },
                beforeSend: function () {
                    $.BlockUI();
                },
                complete: function () {
                    $.UnblockUI();
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return
                    }
                    var data = res.data;
                    var html = '';
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].emailCatelog == 1) {
                            var box = '收件箱'
                        } else if (data[i].emailCatelog == 0) {
                            var box = '发件箱'
                        }
                        html += '<tr data-id="' + data[i].id + '" data-emailCatelog="' + data[i].emailCatelog + '" data-url="' + data[i].url + '">\
                                    <td><span class="file-name ellipsis">' + data[i].fileName + '</span></td>\
                                    <td>' + box + '</td>\
                                    <td>' + data[i].status + '</td>\
                                    <td>' + data[i].errMsg + '</td>\
                                    <td>' + data[i].updateTime + '</td>\
                                </tr>';
                    }
                    $('#uploadEmailTable tbody').empty().append(html);
                }
            })
        }

        $('#uploadEmailSave').on('click', function () {
            var emailCatelog = $('#boxEmail option:selected').val();
            if ($('#uploadEmailList').find('li').length < 1) {
                $.Alert('请选择上传文件')
            } else {
                var url = $('#uploadEmailList').find('li').eq(0).attr('data-url');
                var filename = $('#uploadEmailList').find('li').eq(0).find('.media-heading').text();
                var fileSize = $('#uploadEmailList').find('li').eq(0).find('.media-body span').attr('data-size');
                var data = {
                    filename: filename,
                    fileSize: fileSize,
                    emailCatelog: emailCatelog,
                    url: url
                }
                uploadEmail(data);
            }
        })
    });
});
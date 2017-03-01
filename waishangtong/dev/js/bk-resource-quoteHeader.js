require([ 'common' ], function () {
    require(['maintab', 'ZeroClipboard', 'ueditorLang', 'blockUI', 'jqform'], function (maintab, ZeroClipboard) {
        //显示相应的功能按钮
        var funcList = top.funcList;
        $('[data-code]').each(function(){
            for(var i=0; i<funcList.length; i++){
                if(funcList[i].code == $(this).attr('data-code')){//添加客户
                    $(this).removeClass('none');
                }
            };
        });

        maintab.init();
        //添加模板页面切换

        $(".return").on('click', function () {
            $("#tem-set").hide();
            $("#list-set").show();
        });

        //模板列表查询
        var arr=[];
        $.ajax({
            url: Base.sitUrl + "/api/org/v1/org/template/list",
            type: "POST",
            dataType: "json",
            data: {
                templateType: 1
            },
            success: function (result) {
                if (!result.success) {
                    $.Alert(result.message);
                    return;
                }
                ;
                var data = result.data;
                arr=data;
                for (var i = 0; i < data.length; i++) {
                    var data = result.data;
                    data[i].content = data[i].content.replace(/&#39;/g, "\"");
                    var listTr = '<tr data-id="' + data[i].id + '">' +
                        '<td><label class="ashen temName">' + data[i].name + '</label></td>' +
                        '<td class="content">' + data[i].content + '</td>' +
                        '<td><a href="#" class="ashen temClose">删除</a>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" class="ashen temEdit">编辑</a><a href="#" class="ashen temCopy" style="margin-left:15px;">复制</a></td>' +
                        '</tr>';
                    $(".table tbody").append(listTr);
                }
            }
        });
        //添加模板
        $("#new-tem").on('click', function () {
            $("#tem-set").show();
            $("#list-set").hide();
            $("#tem-name").val("");
            var isAppendTo = "";
            setContent(isAppendTo);
            $("#tem-add").on('click', function () {
                getContent();
                contentText = contentText.replace(/"/g, "&#39;");
                var name = $("#tem-name").val();
                var dataEdit = '{"templateType":1,"keyValueType":' + '{"key":"","value":"' + name + '",valueI:"' + contentText + '","type":"1"}' + '}';
                if (name == '') {
                    $.Alert('请填写名称')
                } else {
                    $.ajax({
                        url: Base.sitUrl + "/api/org/v1/org/template/edit",
                        type: "POST",
                        dataType: "json",
                        data: {
                            data: dataEdit,
                        },
                        success: function (result) {
                            if (!result.success) {
                                $.Alert(result.message);
                                return;
                            }
                            ;
                            window.location.reload();
                        }
                    });
                }
            });
        });
        //删除
        $(document).on('click', '.temClose', function () {
            getContent();
            var name = $(this).parents("tr").find(".temName").text();
            var id = $(this).parents("tr").attr("data-id");
            var dataEdit = '{"templateType":1,"keyValueType":' + '{"key":"' + id + '","value":"' + name + '",valueI:"' + contentText + '","type":"2"}' + '}';
            $.Confirm("确认删除？", "", function () {
                $.ajax({
                    url: Base.sitUrl + "/api/org/v1/org/template/edit",
                    type: "POST",
                    dataType: "json",
                    data: {
                        data: dataEdit,
                    },
                    success: function (result) {
                        if (!result.success) {
                            $.Alert(result.message);
                            return;
                        }

                        window.location.reload();
                    }
                });
            });
        });
        //修改
        $(document).on('click', '.temEdit', function () {
            $("#tem-set").show();
            $("#list-set").hide();
            var name = $(this).parents("tr").find(".temName").text();
            var id = $(this).parents("tr").attr("data-id");
            $("#tem-name").val(name);
            var isAppendTo = $(this).parents("tr").find(".content").html();
            if (isAppendTo == 'null') {
                isAppendTo = "";
            }
            setContent(isAppendTo);
            $("#tem-add").on('click', function () {
                getContent();
                contentText = contentText.replace(/"/g, "&#39;");
                var name = $("#tem-name").val();
                var dataEdit = '{"templateType":1,"keyValueType":' + '{"key":"' + id + '","value":"' + name + '",valueI:"' + contentText + '","type":"3"}' + '}';
                $.ajax({
                    url: Base.sitUrl + "/api/org/v1/org/template/edit",
                    type: "POST",
                    dataType: "json",
                    data: {
                        data: dataEdit,
                    },
                    success: function (result) {
                        if (!result.success) {
                            $.Alert(result.message);
                            return;
                        }
                        ;
                        window.location.reload();
                    }
                });
            });
        });
        //复制
        $(document).on('click', '.temCopy', function () {
            $("#tem-set").show();
            $("#list-set").hide();
            var name = $(this).parents("tr").find(".temName").text()+"拷贝";
            var id = $(this).parents("tr").attr("data-id");
            $("#tem-name").val(name);
            var isAppendTo = $(this).parents("tr").find(".content").html();
            if (isAppendTo == 'null') {
                isAppendTo = "";
            }
            setContent(isAppendTo);
            $("#tem-add").on('click', function () {
                getContent();
                contentText = contentText.replace(/"/g, "&#39;");
                var name = $("#tem-name").val();
                var dataEdit = '{"templateType":1,"keyValueType":' + '{"key":"","value":"' + name + '",valueI:"' + contentText + '","type":"1"}' + '}';
                $.ajax({
                    url: Base.sitUrl + "/api/org/v1/org/template/edit",
                    type: "POST",
                    dataType: "json",
                    data: {
                        data: dataEdit,
                    },
                    success: function (result) {
                        if (!result.success) {
                            $.Alert(result.message);
                            return;
                        }
                        window.location.reload();
                    }
                });
            });
        });
        window['ZeroClipboard'] = ZeroClipboard;

        function isFocus(e) {
            alert(ue.isFocus());
            UE.dom.domUtils.preventDefault(e)
        }

        function insertHtml() {
            var value = prompt('插入html代码', '');
            ue.execCommand('insertHtml', value)
        }

        function getAllHtml() {
            alert(ue.getAllHtml())
        }

        //获取编辑器内容
        function getContent() {
            var arr = [];
            arr.push(ue.getContent());
            contentText = arr.join("\n");
        }

        function getPlainTxt() {
            var arr = [];
            arr.push("使用editor.getPlainTxt()方法可以获得编辑器的带格式的纯文本内容");
            arr.push("内容为：");
            arr.push(ue.getPlainTxt());
            alert(arr.join('\n'));
        }

        //设置编辑器内容
        function setContent(isAppendTo) {
            var arr = [];
            ue.setContent(isAppendTo);
        }

        function setDisabled() {
            ue.setDisabled('fullscreen');
            disableBtn("enable");
        }

        function setEnabled() {
            ue.setEnabled();
            enableBtn();
        }

        function getContentTxt() {
            var arr = [];
            arr.push(ue.getContentTxt());
            contentText = arr.join("\n");
        }


        function disableBtn(str) {
            var div = document.getElementById('btns');
            var btns = UE.dom.domUtils.getElementsByTagName(div, "button");
            for (var i = 0, btn; btn = btns[i++];) {
                if (btn.id == str) {
                    UE.dom.domUtils.removeAttributes(btn, ["disabled"]);
                } else {
                    btn.setAttribute("disabled", "true");
                }
            }
        }

        function enableBtn() {
            var div = document.getElementById('btns');
            var btns = UE.dom.domUtils.getElementsByTagName(div, "button");
            for (var i = 0, btn; btn = btns[i++];) {
                UE.dom.domUtils.removeAttributes(btn, ["disabled"]);
            }
        }

        //编辑器
        //插入图片
        $(".add-images").click(function () {
            return $('input[name=upImgs]').click();
        });
        $('input[name=upImgs]').on('change', function (e) {
            $.EventFn(e);
            var sign = fileLimit($(this));
            if (sign.flag) {
                uploadImg(sign.name);
            }
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
            UE.getEditor('addEditor').execCommand('inserthtml', val);
            $('.modelDwon').hide();
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

                    UE.getEditor('addEditor').execCommand('insertimage', {
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
                    $('.modelDwon').empty();
                    $('.modelDwon').append(html);
                }
            });
            return data;
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

        //编辑器
        var editorToolbar = [
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
                // 'source', //源代码
            ]
        ];
        var ue = UE.getEditor('addEditor', {
            'toolbars': editorToolbar,
            'initialFrameWidth': "100%",
            'initialFrameHeight': 200
        });
    });
});
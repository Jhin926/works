/* !
 *  用于新建邮件发送
 */
require([ 'common' ], function () {
    require(['maintab', 'ZeroClipboard', 'ueditorLang', 'blockUI', 'jqform', 'ztree'], function (maintab, ZeroClipboard) {
        function showbtn() {
            for (var i = 0; i < $('.add-files').find('span.data-code').length; i++) {
                var code = $('.add-files').find('span.data-code').eq(i).attr('data-code');
                var on = parent.parent.$.menuPower(code);
                if (on !== 1) {
                    $('.add-files').find('span.data-code').eq(i).addClass('btnRemove');
                }
            }
            $('.btnRemove').remove();
        }

        showbtn();
        //maintab.init();

        window['ZeroClipboard'] = ZeroClipboard;
        var emailId = $.GetQueryString('id');
        var hflx = $.GetQueryString('type');
        var modelType = $.GetQueryString('modelType');
        var customerName = $.GetQueryString('name');
        var modelsId = $.GetQueryString('ids');
        //云文档
        function dataOrg() {
            var dataJson;
            var data = {
                view: '0'
            }
            $.ajax({
                type: "POST",
                url: Base.sitUrl + "/api/disk/v1/all/visible/file/list",
                dataType: "json",
                async: false,
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }
                    dataJson = result.data;
                }
            });
            return dataJson;
        }

        // 树结构设定
        var setting = {
            view: {
                // addDiyDom: addDiyDom,
                selectedMulti: false
            },
            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                beforeDrag: beforeDrag
            }
        };

        //树结构
        var log, className = "dark";

        function beforeDrag(treeId, treeNodes) {
            return false;
        }

        //树结构
        function zTreeCloud() {
            var zNodes = new Array();
            var data = dataOrg();
            for (var i = 0; i < data.length; i++) {
                if (data[i].type == 1) {
                    var pIcon = "pIcon";
                    var status = false
                } else {
                    var pIcon = "";
                    var status = true
                }
                zNodes[i] = {
                    id: data[i].id,
                    pId: data[i].pid,
                    name: data[i].name,
                    type: data[i].type,
                    url: data[i].file,
                    open: false,
                    nocheck: status,
                    iconSkin: pIcon
                }
            }
            $.fn.zTree.init($("#treeDemoAdd"), setting, zNodes);
            $("#selectAll").bind("click", selectAll);
        };

        function showLog(str) {
            if (!log) log = $("#log");
            log.append("<li class='" + className + "'>" + str + "</li>");
            if (log.children("li").length > 8) {
                log.get(0).removeChild(log.children("li")[0]);
            }
        }

        function getTime() {
            var now = new Date(),
                h = now.getHours(),
                m = now.getMinutes(),
                s = now.getSeconds(),
                ms = now.getMilliseconds();
            return (h + ":" + m + ":" + s + " " + ms);
        }

        function selectAll() {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            zTree.setting.edit.editNameSelectAll = $("#selectAll").attr("checked");
        }

        //判断点击域
        $('.divtxt').on('click', function (e) {
            $.EventFn(e);
            var id = $(this).attr('id');
            if (id == 'carbonCopy') {
                newEmailObj.clickRecord = 1;
            } else if (id == 'blindCarbonCopy') {
                newEmailObj.clickRecord = 2;
            } else {
                newEmailObj.clickRecord = 0;
            }
        });

        //悬停改变背景色
        $('.input-group').on('mouseenter', '.one', function (e) {
            $(this).addClass('ones');
        });
        $('.input-group').on('mouseleave', '.one', function (e) {
            $(this).removeClass('ones');
        });
        //点击输入
        $(".divtxt").click(function () {
            return $('input[name=text]').click();
        });
        //双击可编辑当前那条收件人、抄送人、密送人
        $('.input-group').on('dblclick', '.one', function (e) {
            var $one = $(this).closest('.one'),
                type = $one.attr('data-type'),
                id = $one.attr('data-id'),
                list = newEmailObj.arr,
                tmp = [];
            if (type == 1) {
                $one.attr('contentEditable', 'true');
            } else if (type == 2) {
                $one.attr('contentEditable', 'true');
            } else {
                $one.attr('contentEditable', 'true');
            }
            for (var i = 0; i < list.length; i++) {
                if (list[i].id != id) {
                    tmp.push(list[i]);
                }
            }
            if (type == 1) {
                newEmailObj.bccarr = tmp;
                $('#carbonCopy').val('');
            } else if (type == 2) {
                newEmailObj.ccarr = tmp;
                $('#blindCarbonCopy').val('')
            } else {
                $('#divtxt').val('');
                newEmailObj.arr = tmp;
            }
        });

        //  删除附件
        $('#added-files').on('click', '>li>.dels-file', function (e) {
            $.EventFn(e);

            $(this).parent().remove();
        });

        //点联系人添加到收件人、抄送、密送
        $('.sentbox-right').on('click', '>.ess>.essy>ul>li', function (e) {
            $.EventFn(e);
            var $span = $(this).children('span');
            var val = $span.eq(1).attr('data-email');

            if (newEmailObj.clickRecord == 1) {
                var vals = $('#carbonCopy').val();
                var html = '';
                if (vals == null || vals == '') {
                    vals = $('#carbonCopy').val(val + ';');
                    html = '<div class="addr-outer"><div class="one" contenteditable="false" data-type="1" data-id="' + $(this).attr('data-id') + '"><b>' + $span.eq(0).text() + '</b><span>&lt;' + $span.eq(1).attr('data-email') + '&gt;</span><span class=fh>;<span><div></div>';
                } else if (vals.indexOf(val) == -1) {
                    vals = $('#carbonCopy').val(vals + val + ';');
                    html = '<div class="addr-outer"><div class="one" contenteditable="false" data-type="1" data-id="' + $(this).attr('data-id') + '"><b>' + $span.eq(0).text() + '</b><span>&lt;' + $span.eq(1).attr('data-email') + '&gt;</span><span class=fh>;<span><div></div>';
                }
                $('#carbonCopy').prepend(html);
            } else if (newEmailObj.clickRecord == 2) {
                var vals = $('#blindCarbonCopy').val();
                var html = '';
                if (vals == null || vals == '') {
                    vals = $('#blindCarbonCopy').val(val + ';');
                    html = '<div class="addr-outer"><div class="one" contenteditable="false" data-type="2" data-id="' + $(this).attr('data-id') + '"><b>' + $span.eq(0).text() + '</b><span>&lt;' + $span.eq(1).attr('data-email') + '&gt;</span><span class=fh>;<span><div></div>';
                } else if (vals.indexOf(val) == -1) {
                    html = '<div class="addr-outer"><div class="one" contenteditable="false" data-type="2" data-id="' + $(this).attr('data-id') + '"><b>' + $span.eq(0).text() + '</b><span>&lt;' + $span.eq(1).attr('data-email') + '&gt;</span><span class=fh>;<span><div></div>';
                }
                $('#blindCarbonCopy').prepend(html);
            } else {
                var vals = $('#divtxt').val();
                var html = '';
                if (vals == null || vals == '') {
                    html = '<div class="addr-outer"><div class="one" contenteditable="false" data-type="0" data-id="' + $(this).attr('data-id') + '"><b>' + $span.eq(0).text() + '</b><span>&lt;' + $span.eq(1).attr('data-email') + '&gt;</span><span class=fh>;<span><div></div>';
                } else if (vals.indexOf(val) == -1) {
                    html = '<div class="addr-outer"><div class="one" contenteditable="false" data-type="0" data-id="' + $(this).attr('data-id') + '"><b>' + $span.eq(0).text() + '</b><span>&lt;' + $span.eq(1).attr('data-email') + '&gt;</span><span class=fh>;<span><div></div>';
                }
                $('#divtxt').prepend(html);
            }

        });
        $('#carbonCopy').on('click', function (e) {
            $.EventFn(e);
            $("#clickRecord").val(1);
        })
        $('#blindCarbonCopy').on('click', function (e) {
            $.EventFn(e);
            $("#clickRecord").val(2);
        })
        //点击提示添加联系人到收件人、抄送、密送
        $('.input-group').on('click', '.receptetips>li', function (e) {
            $.EventFn(e);
            var $tips = $(this).closest('td').find('.receptetips');
            var $inpval = $(this).closest('td').find('.inputaddress');
            var $span = $(this).children('span');
            var val = $span.eq(1).attr('data-email');
            if (newEmailObj.clickRecord == 1) {
                var vals = $('#carbonCopy').val();
                var html = '';
                if (vals == null || vals == '') {
                    html = '<div class="addr-outer"><div class="one" contenteditable="false" data-type="1" data-id="' + $(this).attr('data-id') + '"><b>' + $span.eq(0).text() + '</b><span>&lt;' + $span.eq(1).attr('data-email') + '&gt;</span><span class=fh>;<span><div></div>';
                } else if (vals.indexOf(val) == -1) {
                    html = '<div class="addr-outer"><div class="one" contenteditable="false" data-type="1" data-id="' + $(this).attr('data-id') + '"><b>' + $span.eq(0).text() + '</b><span>&lt;' + $span.eq(1).attr('data-email') + '&gt;</span><span class=fh>;<span><div></div>';
                }
                $inpval.val("");
                $('#carbonCopy').prepend(html);
                $tips.hide();
            } else if (newEmailObj.clickRecord == 2) {
                var vals = $('#blindCarbonCopy').val();
                var html = '';
                if (vals == null || vals == '') {
                    html = '<div class="addr-outer"><div class="one" contenteditable="false" data-type="2" data-id="' + $(this).attr('data-id') + '"><b>' + $span.eq(0).text() + '</b><span>&lt;' + $span.eq(1).attr('data-email') + '&gt;</span><span class=fh>;<span><div></div>';
                } else if (vals.indexOf(val) == -1) {
                    html = '<div class="addr-outer"><div class="one" contenteditable="false" data-type="2" data-id="' + $(this).attr('data-id') + '"><b>' + $span.eq(0).text() + '</b><span>&lt;' + $span.eq(1).attr('data-email') + '&gt;</span><span class=fh>;<span><div></div>';
                }
                $inpval.val("");
                $('#blindCarbonCopy').prepend(html);
                $tips.hide();
            } else {
                var vals = $('#divtxt').val();
                var html = '';
                if (vals == null || vals == '') {
                    html = '<div class="addr-outer"><div class="one" contenteditable="false" data-type="0" data-id="' + $(this).attr('data-id') + '"><b>' + $span.eq(0).text() + '</b><span>&lt;' + $span.eq(1).attr('data-email') + '&gt;</span><span class=fh>;<span><div></div>';
                } else if (vals.indexOf(val) == -1) {
                    html = '<div class="addr-outer"><div class="one" contenteditable="false" data-type="0" data-id="' + $(this).attr('data-id') + '"><b>' + $span.eq(0).text() + '</b><span>&lt;' + $span.eq(1).attr('data-email') + '&gt;</span><span class=fh>;<span><div></div>';
                }
                $inpval.val("");
                $('#divtxt').prepend(html);
                $tips.hide();
            }
        });
        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        //回车键
        $('.input-group').on('blur', '.inputaddress', function (event) {
            var inputaddress = $(this).val();
            var html = '';
            if (inputaddress != null && inputaddress != '') {
                if (!reg.test(inputaddress)) {
                    if (inputaddress != null && inputaddress != '') {
                        html = '<div class="addr-outer"><div class="one" contenteditable="false" data-type="0" data-id="' + $(this).attr('data-id') + '"><b></b><span class="emailError">&lt;' + inputaddress + '&gt;</span><span class=fh>;<span><div></div>';
                        $(this).parent('.addressinput').parent('.divtxt').find('.addrcontainer').append(html);
                        $(this).val("");
                        $tips.hide();
                    }
                    return
                }
                html = '<div class="addr-outer"><div class="one" contenteditable="false" data-type="0" data-id="' + $(this).attr('data-id') + '"><b></b><span>&lt;' + inputaddress + '&gt;</span><span class=fh>;<span><div></div>';
                $(this).val("").parent('.addressinput').parent('.divtxt').find('.addrcontainer').append(html);
            }
        })
        $('.input-group').on('keyup', '.inputaddress', function (event) {
            var $tips = $(this).closest('.divtxt').parent('td').find('.receptetips');
            if (event.keyCode == "186" || event.keyCode == "9") {//按;键 就会当作一个完整邮箱
                var inputaddress = $(this).val();
                if (!reg.test(inputaddress)) {
                    if (inputaddress != null && inputaddress != '') {
                        html = '<div class="addr-outer"><div class="one" contenteditable="false" data-type="0" data-id="' + $(this).attr('data-id') + '"><b></b><span class="emailError">&lt;' + inputaddress + '&gt;</span><span class=fh>;<span><div></div>';
                        $(this).parent('.addressinput').parent('.divtxt').find('.addrcontainer').append(html);
                        $(this).val("");
                        $tips.hide();
                    }
                    return
                }
                var html = '';
                inputaddress = inputaddress.substring(0, inputaddress.length - 1);
                if (inputaddress != null && inputaddress != '') {
                    html = '<div class="addr-outer"><div class="one" contenteditable="false" data-type="0" data-id="' + $(this).attr('data-id') + '"><b></b><span>&lt;' + inputaddress + '&gt;span><span class=fh>;<span><div></div>';
                    $(this).val("").parent('.addressinput').parent('.divtxt').find('.addrcontainer').append(html);
                    $tips.hide();
                }
            } else if (event.keyCode == '40' && $('.receptetips').css('display') == 'block') {
                if ($('.receptetips li.active').index() == $('.receptetips li').length - 1) {
                    return
                }
                $('.receptetips li.active').next('li').addClass('active');
                $('.receptetips li.active').eq(0).removeClass('active');
            } else if (event.keyCode == '38' && $('.receptetips').css('display') == 'block') {
                if ($('.receptetips li.active').index() == 0) {
                    return
                }
                $('.receptetips li.active').prev('li').addClass('active');
                $('.receptetips li.active').eq(1).removeClass('active');
            } else if (event.keyCode == '13' && $('.receptetips').css('display') == 'block') {
                var $tips = $('.receptetips li.active').closest('td').find('.receptetips');
                var $inpval = $('.receptetips li.active').closest('td').find('.inputaddress');
                var $span = $('.receptetips li.active').children('span');
                var val = $span.eq(1).attr('data-email');
                $inpval.val("");
                var vals = $('#divtxt').val();
                var html = '';
                if (vals == null || vals == '') {
                    html = '<div class="addr-outer"><div class="one" contenteditable="false" data-type="0" data-id="' + $(this).attr('data-id') + '"><b>' + $span.eq(0).text() + '</b><span>&lt;' + $span.eq(1).attr('data-email') + '&gt;</span><span class=fh>;<span><div></div>';
                } else if (vals.indexOf(val) == -1) {
                    html = '<div class="addr-outer"><div class="one" contenteditable="false" data-type="0" data-id="' + $(this).attr('data-id') + '"><b>' + $span.eq(0).text() + '</b><span>&lt;' + $span.eq(1).attr('data-email') + '&gt;</span><span class=fh>;<span><div></div>';
                }
                $('#divtxt').find('.addrcontainer').append(html);
                $tips.hide();
            } else if (event.keyCode == "13") {//回车
                var inputaddress = $(this).val();
                if (!reg.test(inputaddress)) {
                    if (inputaddress != null && inputaddress != '') {
                        html = '<div class="addr-outer"><div class="one" contenteditable="false" data-type="0" data-id="' + $(this).attr('data-id') + '"><b></b><span class="emailError">&lt;' + inputaddress + '&gt;</span><span class=fh>;<span><div></div>';
                        $(this).parent('.addressinput').parent('.divtxt').find('.addrcontainer').append(html);
                        $(this).val("");
                        $tips.hide();
                    }
                    return
                }
                var html = '';
                if (inputaddress !== null) {
                    html += '<div class="addr-outer"><div class="one" contenteditable="false" data-type="0" data-id="' + $(this).attr('data-id') + '"><b></b><span>&lt;' + inputaddress + '&gt;</span><span class=fh>;<span><div></div>';
                    $(this).parents('#divtxt').find('.addrcontainer').append(html);
                    $(this).val("");
                    $tips.hide();
                }
            }
        });

        $('.input-group').on('keydown', '.addr-edit input', function (e) {
            $.EventFn(e);
            if (event.keyCode == "8") {
                $(this).closest('.addr-outer').remove();
            }
        });
        //backspace键
        $('.input-group').on('keydown', '.inputaddress', function (event) {
            if (event.keyCode == "8") {
                var preone = $(this).parent('.addressinput').prev('.addrcontainer').find('.one:last'),
                    id = preone.attr('data-id'),
                    type = preone.attr('data-type'),
                    list = newEmailObj.arr,
                    tmp = [];
                if (type == 1) {
                    if ($(this).val() == null || $(this).val() == '') {
                        preone.remove();
                    }
                    list = newEmailObj.bccarr;
                } else if (type == 2) {
                    if ($(this).val() == null || $(this).val() == '') {
                        preone.remove();
                    }
                    list = newEmailObj.ccarr;
                } else {
                    if ($(this).val() == null || $(this).val() == '') {
                        preone.remove();
                    }
                }
                for (var i = 0; i < list.length; i++) {
                    if (list[i].id != id) {
                        tmp.push(list[i]);
                    }
                }
                if (type == 1) {
                    newEmailObj.bccarr = tmp;
                    $('#carbonCopy').val('');
                } else if (type == 2) {
                    newEmailObj.ccarr = tmp;
                    $('#blindCarbonCopy').val('')
                } else {
                    $('#divtxt').val('');
                    newEmailObj.arr = tmp;
                }
            }
        });
        //失去焦点时间
        $('.input-group').on('blur', '.inputaddress', function () {
            var inputaddress = $(this).val();
            var html = '';
            if (inputaddress != null && inputaddress != '') {
                html = '<div class="addr-outer"><div class="one" data-type="0" data-id="' + $(this).attr('data-id') + '"><b></b><span>&lt;' + inputaddress + '&gt;</span><span class=fh>;<span><div></div>';
                $(this).val("").parent('.addressinput').parent('.divtxt').prepend(html);
            }
        });

        //激活焦点显示提示
        $('.input-group').on('focus', '.inputaddress', function (e) {
            $.EventFn(e);
            var $tips = $(this).closest('td').find('.receptetips');

            var list = (newEmailObj.tipslist).unique();

            if ($tips.children('li').length == 0) {
                var html = '';
                for (var j = 0; j < list.length; j++) {
                    html += '<li data-id="' + list[j].value + '">\
                                <span>' + list[j].name + '</span>\
                                <span data-email="' + list[j].value + '">(' + list[j].value + ')</span>\
                            </li>'
                }
                $tips.append(html)
            }
        });
        $('.input-group').on('input', '.inputaddress', function () {
            var list = newEmailObj.tipslist, tmp = [],
                $tips = $(this).closest('.divtxt').parent('td').find('.receptetips');

            for (var i = 0; i < list.length; i++) {
                if (list[i].name.indexOf($(this).val()) != -1) {
                    tmp.push(list[i]);
                }
            }
            if (tmp.length > 0) {
                $tips.show();
                var html = '';
                for (var j = 0; j < tmp.length; j++) {
                    html += '<li>\
                                <span>' + tmp[j].name + '</span>\
                                <span data-email="' + tmp[j].value + '">(' + tmp[j].value + ')</span>\
                            </li>';
                }
                $tips.empty().append(html);
            } else {
                $tips.hide();
            }
        });

        //显示密送和抄送
        $('.sentbox-left').on('click', '#shoujianren-title', function (e) {
            $.EventFn(e);
            $('.sentbox-left').children('.csAndMs').slideToggle("slow");
            $(this).children('.down-zk-icon').toggleClass('up-zk-icon')
        });

        //改变紧急、回执、追踪状态
        $('.emailcondition').bind('change', 'label', function (e) {
            $.EventFn(e);
            $(this).find('input').prop("checked", $(this).prop("checked"));
        });

        function buildAddressJson(divId, arr) {
            var emailDivs = $("#" + divId).find(".one");
            for (var i = 0; i < emailDivs.length; i++) {
                var id = 0;
                var idStr = emailDivs.eq(i).attr('data-id');
                if (idStr != 'undefined' && idStr != null && idStr != '') {
                    id = parseInt(idStr);
                }
                var emailName = emailDivs.eq(i).find("b").html();
                var emailAddress = emailDivs.eq(i).find("span").text();
                var emailAddressStr = emailAddress.substr(1, emailAddress.length - 2);
                arr.push({name: emailName, email: emailAddressStr, id: id});
            }
        }

        //发送and存草稿信息
        function newEmailInfomation(type) {
            newEmailObj.arr = [];
            newEmailObj.ccarr = [];
            newEmailObj.bccarr = [];
            buildAddressJson('divtxt', newEmailObj.arr);
            buildAddressJson('carbonCopy', newEmailObj.ccarr);
            buildAddressJson('blindCarbonCopy', newEmailObj.bccarr);

            var myTheme = $('#sendTheme').val();
            var li = $('#added-files>li');
            var arr = [], flag = true;
            var obj = {
                "content": UE.getEditor('sendEditor').getContent(),   //内容
                "subject": myTheme    //主题
            };
            if ($('#priority').prop('checked')) {
                obj.priority = 1;
            }
            if ($('#sendTheme').attr('data-id') !== '') {
                obj.draftId = $('#sendTheme').attr('data-id');
            }
            if ($('#readReturn').prop('checked')) {
                obj.readReturn = true;
            }
            if ($('#tracking').prop('checked')) {
                obj.tracking = true;
            }
            if (newEmailObj.arr.length > 0) {
                obj.tos = newEmailObj.arr;
            } else if (!type) {
                alert('请输入收件人！');
                flag = false;
            }
            if (newEmailObj.ccarr.length > 0) {
                obj.ccs = newEmailObj.ccarr;
            }
            if (newEmailObj.bccarr.length > 0) {
                obj.bccs = newEmailObj.bccarr;
            }
            if (li.length > 0) {
                for (var i = 0; i < li.length; i++) {
                    arr.push({fileUrl: li.eq(i).attr("data-url"), filename: li.eq(i).children('span').eq(0).text()})
                }
                obj.attachments = arr;
            }
            return {flag: flag, obj: obj};

        }

        //发送
        $('#sendEmail').on('click', function (e) {
            $.EventFn(e);
            if ($('#divtxt').find('.emailError').length > 0) {
                $.Alert('邮箱格式有误');
                return;
            }
            var ele = newEmailInfomation();
            if (ele.flag) {
                newEmailObj.sendEmail(ele.obj);
            }
        });
        //存草稿
        $('#saveDrafts').on('click', function (e) {
            $.EventFn(e);
            var ele = newEmailInfomation(12);
            newEmailObj.saveDrafts(ele.obj);
            parent.location.reload();
        });

        //添加附件
        $(".add-attachment").on('click', function () {
            $('input[name=upFiles]').click();
        });
        $('input[name=upFiles]').on('change', function (e) {
            $.EventFn(e);
            var sign = newEmailObj.fileLimit($(this));
            if (sign.flag) {
                newEmailObj.uploadFujian(sign.name);
            }
        });
        //插入图片
        $(".add-images").click(function () {
            $('input[name=upImgs]').click();
        });
        $('input[name=upImgs]').on('change', function (e) {
            $.EventFn(e);
            var sign = newEmailObj.fileLimit($(this));
            if (sign.flag) {
                newEmailObj.uploadImg(sign.name);
            }
        });
        //切换通讯和联系人
        $('#emailContacts>li').on('click', function (e) {
            $.EventFn(e);
            if ($(this).hasClass('current')) {
                return;
            }
            $(this).addClass('current').siblings().removeClass('current');
            var id = $(this).index();
            $('.rightShowList').eq(id).addClass('activities').siblings().removeClass('activities');
        });

        //搜索联系人
        $('.sentbox-right').on('input', '#search-input', function (e) {
            $.EventFn(e);
            var value = $('#search-input').val(),
                $tips = $(this).closest('.sentbox-right').find('.search-list'),
                $tipss = $tips.children('.essy').children('#search-list'),
                list = (newEmailObj.tipslist).unique(),
                tmp = [];
            if (value.length > 0) {
                $('#c-search-btn').addClass('clear-icon-email').removeClass('search-icon-email')
                $('#emailContacts').hide();
                $('#content').hide();
                $tips.show();

                for (var i = 0; i < list.length; i++) {
                    if (list[i].name.indexOf(value) != -1 || list[i].value.indexOf(value) != -1) {
                        tmp.push(list[i]);
                    }
                }

                if (tmp.length > 0) {
                    var html = '';
                    for (var j = 0; j < tmp.length; j++) {
                        html += '<li>\
                                    <span>' + tmp[j].name + '</span>\
                                    <span data-email="' + tmp[j].value + '">(' + tmp[j].value + '&gt;</span>\
                                </li>';
                    }
                    $tipss.empty().append(html);
                } else {
                    html = '<li>没有找到该联系人！</li>';
                    $tipss.empty().append(html);
                }
            } else {
                $('#emailContacts,#content').show();
                $('#c-search-btn').addClass('search-icon-email').removeClass('clear-icon-email')
                $tips.hide();
            }
        });
        $('.sentbox-right').on('click', '.clear-icon-email', function (e) {//清理搜索条件
            $.EventFn(e)
            $('#search-input').val('')
            var value = $('#search-input').val(),
                $tips = $(this).closest('.sentbox-right').find('.search-list');
            if (value.length < 1) {
                $('#emailContacts,#content').show();
                $tips.hide();
            }
        })
        $('.sentbox-right').on('input', '#search-input', function (e) {
            $.EventFn(e);
            var value = $('#search-input').val(),
                $tips = $(this).closest('.sentbox-right').find('.search-list');
            if (value.length < 1) {
                $('#emailContacts,#content').show();
                $tips.hide();
            }
        });
        //添加快速文本
        $('.add-files').on('click', '.add-text', function (e) {
            pageObj.currentPage = 1;
            newEmailObj.fastText();
            $('#myModalLabel').empty().text('选择快速文本');
            $('.modal-footer .btn:last-child').attr('id', 'textBtn');
            $('#myModal').find('.form-group').hide();
            $('#treeDemoAdd').hide();
            $('#myModal .modelDwon').show();
            $('#myModal .page').hide();
        });
        //添加云文档
        $('.add-files').on('click', '.add-cloud', function (e) {
            pageObj.currentPage = 1;
            zTreeCloud();
            $('#myModalLabel').empty().text('选择云文件');
            $('.modal-footer .btn:last-child').attr('id', 'cloudBtn');
            $('#myModal').find('.form-group').hide();
            $('#treeDemoAdd').show();
            $('#myModal .modelDwon').hide();
            $('#myModal .page').hide();
        });
        //添加模板
        $('.add-files').on('click', '.add-model', function (e) {
            pageObj.currentPage = 1;
            newEmailObj.insertModel();
            $('#myModalLabel').empty().text('选择模板');
            $('.modal-footer .btn:last-child').attr('id', 'modelBtn');
            $('#modelInput').show().siblings('.form-group').hide();
            $('#treeDemoAdd').hide();
            $('#myModal .modelDwon').show();
            $('#myModal .page').hide();
        });
        //添加Pi模板
        $('.add-files').on('click', '.add-PI', function (e) {
            pageObj.currentPage = 1;
            newEmailObj.insertModelPi();
            $('#myModalLabel').empty().text('选择PI模板');
            $('.modal-footer .btn:last-child').attr('id', 'piBtn');
            $('#piInput').show().siblings('.form-group').hide();
            $('#treeDemoAdd').hide();
            $('#myModal .modelDwon').show();
            $('#myModal .page').hide();
        });
        //添加报价单
        $('.add-files').on('click', '.add-quotation', function (e) {
            pageObj.currentPage = 1;
            newEmailObj.insertModel3();
            $('#myModalLabel').empty().text('选择报价单');
            $('.modal-footer .btn:last-child').attr('id', 'quoteBtn');
            $('#quoteInput').show().siblings('.form-group').hide();
            $('#treeDemoAdd').hide();
            $('#myModal .modelDwon').show();
            $('#myModal .page').hide();
        });
        //添加产品
        $('.add-files').on('click', '.add-product', function (e) {
            pageObj.currentPage = 1;
            newEmailObj.insertModelPdt();
            pdt1();
            pdtGroup();
            $('#myModalLabel').empty().text('选择产品');
            $('.modal-footer .btn:last-child').attr('id', 'pdtBtn');
            $('#pdtInput1').show().siblings('.form-group').hide();
            $('#pdtInput2').css('display', 'inline-block');
            $('#pdtInput3').css('display', 'inline-block');
            $('#treeDemoAdd').hide();
            $('#myModal .modelDwon').show();
            $('#myModal .page').show();
        });
        $('.modal-footer .btn:last-child').unbind('click').on('click', function (e) {
            $.EventFn(e);
            var btnId = $(this).attr('id');
            if (btnId == 'pdtBtn') {
                var id = new Array();
                var h = $('#myModal .modelDwon').find('input[type=checkbox]:checked').length;
                for (var i = 0; i < h; i++) {
                    var val = $('#myModal .modelDwon').find('input[type=checkbox]:checked').eq(i).parents('li').attr("data-id");
                    val = parseInt(val);
                    id += val + ',';
                }
                id = id.substring(0, id.length - 1)
                $.ajax({
                    url: Base.sitUrl + '/api/export/v1/product/picture',
                    type: 'POST',
                    data: {
                        ids: id
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
                            return
                        }

                        var data = res.data;
                        var img = '';
                        for (var i = 0; i < data.length; i++) {
                            var imgUrl = 'http://' + data[i].pictureUrl;
                            img += '<img src="' + imgUrl + '" style="max-width:800px">' +
                                '<p></p>';
                            var pdfUrl = 'http://' + data[i].pdfUrl;
                            var html = '<li data-url="' + pdfUrl + '"><i class="pub-icon fujian-excl-iocn"></i><span>' + data[i].pdfName + '</span> <span class="att-size">( ' + data[i].pdfSize + ' )</span> <span class="removeLi">删除</span><span class="previewEml">预览</span></li>';
                            $("#added-files").show().prepend(html);
                        }
                        UE.getEditor('sendEditor').execCommand('inserthtml', img);
                        $('#myModal .close').click();
                    }
                })
            } else if (btnId == 'quoteBtn') {
                var id = new Array();
                var h = $('#myModal .modelDwon').find('input[type=checkbox]:checked').length;
                for (var i = 0; i < h; i++) {
                    var val = $('#myModal .modelDwon').find('input[type=checkbox]:checked').eq(i).parents('li').attr("data-id");
                    val = parseInt(val);
                    id += val + ',';
                }
                id = id.substring(0, id.length - 1)
                $.ajax({
                    url: Base.sitUrl + '/api/export/v1/quotation/picture',
                    type: 'POST',
                    data: {
                        ids: id
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
                            return
                        }

                        var data = res.data;
                        var img = '';
                        for (var i = 0; i < data.length; i++) {
                            var imgUrl = 'http://' + data[i].pictureUrl;
                            img += '<br /><br /><br /><img src="' + imgUrl + '" style="max-width:800px"><br />';
                            var pdfUrl = 'http://' + data[i].pdfUrl;
                            var html = '<li data-url="' + pdfUrl + '"><i class="pub-icon fujian-excl-iocn"></i><span>' + data[i].pdfName + '</span> <span class="att-size">( ' + data[i].pdfSize + ' )</span> <span class="removeLi">删除</span><span class="previewEml">预览</span></li>';
                            $("#added-files").show().prepend(html);
                        }
                        UE.getEditor('sendEditor').execCommand('inserthtml', img);
                        $('#myModal .close').click();
                    }
                })
            } else if (btnId == 'piBtn') {
                var id = new Array();
                var h = $('#myModal .modelDwon').find('input[type=checkbox]:checked').length;
                for (var i = 0; i < h; i++) {
                    var val = $('#myModal .modelDwon').find('input[type=checkbox]:checked').eq(i).parents('li').attr("data-id");
                    val = parseInt(val);
                    id += val + ',';
                }
                id = id.substring(0, id.length - 1)
                $.ajax({
                    url: Base.sitUrl + '/api/export/v1/pi/picture',
                    type: 'POST',
                    data: {
                        ids: id
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
                            return
                        }
                        var data = res.data;
                        var img = '';
                        for (var i = 0; i < data.length; i++) {
                            var imgUrl = 'http://' + data[i].pictureUrl;
                            img += '<br /><br /><br /><img src="' + imgUrl + '" style="max-width:800px"><br />';
                            var pdfUrl = 'http://' + data[i].pdfUrl;
                            var html = '<li data-url="' + pdfUrl + '"><i class="pub-icon fujian-excl-iocn"></i><span>' + data[i].pdfName + '</span> <span class="att-size">( ' + data[i].pdfSize + ' )</span> <span class="removeLi">删除</span><span class="previewEml">预览</span></li>';
                            $("#added-files").show().prepend(html);
                        }
                        UE.getEditor('sendEditor').execCommand('inserthtml', img);
                        $('#myModal .close').click();
                    }
                })
            } else if (btnId == 'modelBtn') {
                var val = $('#myModal .modelDwon').find('input[type=checkbox]:checked').parents('li').attr("data-value");
                UE.getEditor('sendEditor').execCommand('inserthtml', val);
                $('#myModal .close').click();
            } else if (btnId == 'textBtn') {
                var val = $('#myModal .modelDwon').find('input[type=checkbox]:checked').parents('li').attr("data-value");
                UE.getEditor('sendEditor').execCommand('inserthtml', val);
                $('#myModal .close').click();
            } else if (btnId == 'cloudBtn') {
                var treeObj = $.fn.zTree.getZTreeObj("treeDemoAdd");
                var nodes = treeObj.getCheckedNodes(true);
                var html = '';
                if ($('#added-files').find('li').length > 0) {
                    for (var i = 0; i < nodes.length; i++) {
                        var on;
                        for (var j = 0; j < $('#added-files').find('li').length; j++) {
                            var liUrl = $('#added-files').find('li').eq(j).attr('data-url');
                            if (liUrl == nodes[i].url) {
                                on = 1
                            }
                        }
                        if (on == 1) {
                            html += ''
                            on = 0;
                        } else {
                            html += '<li data-url="' + nodes[i].url + '"><i class="pub-icon fujian-excl-iocn"></i><span>' + nodes[i].name + '</span> <span class="att-size"></span> <span class="removeLi">删除</span><span class="previewEml">预览</span></li>';
                        }
                    }
                } else {
                    for (var i = 0; i < nodes.length; i++) {
                        var liUrl = $('.added-files').find('li').eq(j).attr('data-url');
                        if (liUrl !== nodes[i].url) {
                            html += '<li data-url="' + nodes[i].url + '"><i class="pub-icon fujian-excl-iocn"></i><span>' + nodes[i].name + '</span> <span class="att-size"></span> <span class="removeLi">删除</span><span class="previewEml">预览</span></li>';
                        } else {
                            html += '';
                        }
                    }
                }
                $("#added-files").show().prepend(html);
                $('#myModal .close').click();
            }
        });
        var pageObj = {
            homepage: 1,
            lastpage: null,
            currentPage: 1,
            pageSize: 8
        };
        //  分页
        $('#pagination').delegate('li', 'click', function (e) {
            var _ev = e || window.event;
            _ev.preventDefault();

            if ($(this).hasClass('active') || $(this).hasClass('disabled')) {
                return;
            } else {
                pageObj.currentPage = $(this).children().attr('data-page');
                $(this).addClass('active').siblings().removeClass('active');
            }
        });
        //新建邮件
        var newEmailObj = {
            searchContacts: [],
            tipslist: [],
            arr: [],
            ccarr: [],
            bccarr: [],
            clickRecord: 0,    //  收件箱、抄送、密送标记
            addressList: function () {     //  通讯录
                var data = {};
                var keyword = $("#search-input").val() || '';
                var url = Base.sitUrl + '/api/addressList/v1/quickList';
                if (keyword) {
                    url += '?keyword=' + keyword;
                }
                $.ajax({
                    url: url,
                    type: 'GET',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var data = res.data;
                        var html = '';
                        if (data.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                newEmailObj.tipslist.push(data[i]);
                                html += '<li data-id="' + data[i].value + '">' + '<span>' + data[i].name + '</span>' + '<span data-email="' + data[i].value + '">&lt;' + data[i].value + '&gt;</span>' + '</li>';
                            }
                            $('#personalMaillist').append(html);
                        }
                    }
                });
            },
            contactsList: function () {     //  联系人
                var data = {};
                var keyword = $("#search-input").val() || '';
                var url = Base.sitUrl + '/api/customer/contacts/v1/quickList';
                if (keyword) {
                    url += '?keyword=' + keyword;
                }
                $.ajax({
                    url: url,
                    type: 'GET',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var data = res.data;
                        var html = '';
                        if (data.length > 0) {
                            for (var i = 0; i < data.length; i++) {
                                newEmailObj.tipslist.push(data[i]);
                                html += '<li data-id="' + data[i].value + '">' + '<span>' + data[i].name + '</span>' + '<span data-email="' + data[i].value + '">&lt;' + data[i].value + '&gt;</span>' + '</li>';
                            }
                            $('#companyMaillist').append(html);
                        }
                    }
                });
            },
            sendEmail: function (sendEntity) {     //  发送
                return newEmailObj.operationEmail(sendEntity, '/api/email/v1/send');
            },

            saveDrafts: function (sendEntity) {     //  存草稿
                return newEmailObj.operationEmail(sendEntity, '/api/email/v1/draft/save');
            },

            operationEmail: function (sendEntity, uri) {     //  发送and存草稿
                var data = {};
                $.ajax({
                    url: Base.sitUrl + uri,
                    type: 'POST',
                    data: {
                        data: JSON.stringify(sendEntity)
                    },
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        $.DestroyPopInPop();
                        var email = '';
                        if (uri == '/api/email/v1/send') {
                            for (var i = 0; i < $('.addr-outer').length; i++) {
                                var emailAddr = $('.addr-outer').eq(i).find('.one').find('span').eq(0).text();
                                email += emailAddr.substring(1, emailAddr.length - 1) + ',';
                            }
                            email = email.substring(0, email.length - 1);
                            $('#mainIframe', top.document).attr('src', Base.sitUrl + '/html/pop-email-success.html?id=' + res.data + '&email=' + email);
                        } else if (uri == '/api/email/v1/draft/save') {
                            $.Alert('保存草稿成功！', '', function () {
                                var index = $('#mainTab', parent.document).find('.currentClass').index();
                                parent.me.closeOne(index, true);
                            })
                        }
                    }
                });
                return data;
            },
            //获取邮件签名
            signature: function () {
                var data = {};
                $.ajax({
                    url: Base.sitUrl + '/api/email/setting/v1/signature/get',
                    type: 'GET',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var data = res.data;
                        var html = '';
                        if (data != null && data != '') {
                            html = '<div class="signature">' + data.signature + '</div>';
                        }
                    }
                });
            },
            //获取快速文本
            fastText: function () {
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
                        if (data != null && data != '') {
                            for (var i = 0; i < data.length; i++) {
                                html += '<li data-value="' + data[i].value + '"><input type="checkbox" id="checkbox' + i + '" name="model-checkbox">&nbsp;<label for="checkbox' + i + '" style="display: inline-block;margin-left: 5px;margin-top: 5px;">' + data[i].name + '</label></li>';
                            }
                        } else {
                            html += '<div class="text-center">暂无快速文本</div>'
                        }
                        $('#myModal .modelDwon').empty().append(html);
                        var total = data.length + 1;
                        var all = Math.ceil(total / pageObj.pageSize);
                        $.Page({
                            _class: '.pageText',
                            nowNum: pageObj.currentPage,
                            allNum: all,
                            callback: function (now, all) {
                                pageObj.currentPage = now;
                                newEmailObj.fastText();
                            }
                        })
                    }
                });
            },
            //获取模板
            insertModel: function () {
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
                        if (data != null && data != '') {
                            for (var i = 0; i < data.length; i++) {
                                html += '<li data-value="' + data[i].value + '"><input type="checkbox" id="checkbox' + i + '" name="model-checkbox">&nbsp;<label for="checkbox' + i + '" style="display: inline-block;margin-left: 5px;margin-top: 5px;">' + data[i].name + '</label></li>';
                            }
                        } else {
                            html += '<div class="text-center">暂无模板</div>'
                        }
                        $('#myModal .modelDwon').empty().append(html);
                        var total = data.length + 1;
                        var all = Math.ceil(total / pageObj.pageSize);
                        $.Page({
                            _class: '.pageMod',
                            nowNum: pageObj.currentPage,
                            allNum: all,
                            callback: function (now, all) {
                                pageObj.currentPage = now;
                                newEmailObj.insertModel();
                            }
                        })
                    }
                });
            },
            //获取PI模板
            insertModelPi: function (name) {
                var data = {};
                $.ajax({
                    url: Base.sitUrl + '/api/export/v1/list',
                    type: 'GET',
                    data: {
                        type: 2,
                        name: name
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
                            return;
                        }
                        var data = res.data.results;
                        var html = '';
                        if (data != null && data != '') {
                            for (var i = 0; i < data.length; i++) {
                                html += '<li data-id="' + data[i].id + '"><input type="checkbox" id="checkbox' + i + '" name="model-checkbox">&nbsp;<label for="checkbox' + i + '" style="display: inline-block;margin-left: 5px;margin-top: 5px;">' + data[i].name + '</label></li>';
                            }
                        } else {
                            html += '<div class="text-center">暂无PI模板</div>'
                        }
                        $('#myModal .modelDwon').empty().append(html);
                        var total = data.length + 1;
                        var all = Math.ceil(total / pageObj.pageSize);
                        $.Page({
                            _class: '.pagePi',
                            nowNum: pageObj.currentPage,
                            allNum: all,
                            callback: function (now, all) {
                                pageObj.currentPage = now;
                                newEmailObj.insertModelPi();
                            }
                        })
                    }
                });
            },
            //获取产品模板
            insertModelPdt: function (name, productCatelog, productType) {
                var data = {};
                $.ajax({
                    url: Base.sitUrl + '/api/export/v1/list',
                    type: 'GET',
                    data: {
                        type: 1,
                        name: name,
                        productCatelog: productCatelog,
                        productType: productType,
                        currentPage: pageObj.currentPage,
                        pageSize: pageObj.pageSize
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
                        var data = res.data.results;
                        var html = '';
                        if (data != null && data != '') {
                            for (var i = 0; i < data.length; i++) {
                                html += '<li data-id="' + data[i].id + '"><input type="checkbox" id="checkbox' + i + '" name="model-checkbox">&nbsp;<label for="checkbox' + i + '" style="display: inline-block;margin-left: 5px;margin-top: 5px;">' + data[i].name + '</label></li>';
                            }
                        } else {
                            html += '<div class="text-center">暂无产品模板</div>'
                            $('.page').hide();
                        }
                        $('#myModal .modelDwon').empty().append(html);
                    }
                });
            },
            //获取报价单
            insertModel3: function (name) {
                var data = {};
                $.ajax({
                    url: Base.sitUrl + '/api/export/v1/list',
                    type: 'GET',
                    data: {
                        type: 3,
                        name: name
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
                            return;
                        }
                        var data = res.data.results;
                        var html = '';
                        if (data != null && data != '') {
                            for (var i = 0; i < data.length; i++) {
                                html += '<li data-id="' + data[i].id + '"><input type="checkbox" id="checkbox' + i + '" name="model-checkbox">&nbsp;<label for="checkbox' + i + '" style="display: inline-block;margin-left: 5px;margin-top: 5px;">' + data[i].name + '</label></li>';
                            }
                        } else {
                            html += '<div class="text-center">暂无报价单</div>'
                        }
                        $('#myModal .modelDwon').empty().append(html);
                        var total = data.length + 1;
                        var all = Math.ceil(total / pageObj.pageSize);
                        $.Page({
                            _class: '.pageQuo',
                            nowNum: pageObj.currentPage,
                            allNum: all,
                            callback: function (now, all) {
                                pageObj.currentPage = now;
                                newEmailObj.insertModel3();
                            }
                        })
                    }
                });
            },
            //  上传附件
            uploadFujian: function (name, dictFileUpType) {
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
                        var html = '<li data-url="' + url + '"><i class="pub-icon fujian-excl-iocn"></i><span>' + name + '</span><span class="removeLi">删除</span><span class="previewEml">预览</span></li>';
                        $('#added-files').prepend(html);
                    }
                }).submit();
            },
            //  上传图片
            uploadImg: function (name, dictFileUpType) {
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
                        UE.getEditor('sendEditor').execCommand('insertimage', {
                            src: url,
                            width: '300'
                        });
                    }
                }).submit();
            },
            fileLimit: function (obj) {
                var flag = true;
                var fileObj = obj.prop('files');

                var size = Math.round(fileObj[0].size / 1024 * 100) / 100 / 1024;//MB
                if (size > 20) {
                    $.Alert('上传附件需小于20MB');
                    flag = false;
                }
                return {flag: flag, name: fileObj[0].name};
            },
            huifuEmail: function (id) {     //  回复邮件
                var data = {
                    id: emailId
                };
                if (hflx == 5) {
                    var uri = Base.sitUrl + '/api/email/draft/v1/detail';
                } else {
                    var uri = Base.sitUrl + '/api/email/outbox/v1/detail';
                }
                $.ajax({
                    url: uri,
                    type: 'GET',
                    data: data,
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var obj = res.data;
                        var csr = obj.ccs
                        var subject = 'RE:' + obj.subject;
                        var zfsubject = 'Fw:' + obj.subject;
                        var html = '';
                        var html2 = '';
                        var tosStr = '';
                        var fromsStr = '';
                        if (csr.length > 0) {
                            for (var i = 0; i < csr.length; i++) {
                                if (csr[i].name != null && csr[i].name != '') {
                                    html2 += '<div class="addr-outer"><div class="one" contenteditable="false" data-type="0" data-id="' + emailId + '"><b>' + csr[i].name + '</b><span>&lt;' + csr[i].value + '&gt;</span><span class=fh>;<span><div></div>';
                                } else {
                                    html2 += '<div class="addr-outer"><div class="one" contenteditable="false" data-type="0" data-id="' + emailId + '"><b></b><span>&lt;' + csr[i].value + '&gt;</span><span class=fh>;<span><div></div>';
                                }
                            }
                        }
                        for (var i = 0; i < obj.tos.length; i++) {
                            tosStr += obj.tos[i].value + ';'
                        }
                        for (var i = 0; i < obj.froms.length; i++) {
                            fromsStr += obj.froms[i].value + ';'
                        }
                        var info = '<div style="margin-top: 0px; margin-bottom: 0px; margin-left: 0.5em;">' +
                            '<div style="border:none;border-top:solid #B5C4DF 1.0pt;padding:3.0pt 0cm 0cm 0cm">' +
                            '<div style="PADDING-RIGHT: 8px; PADDING-LEFT: 8px; FONT-SIZE: 12px;FONT-FAMILY:tahoma;COLOR:#000000; BACKGROUND: #efefef; PADDING-BOTTOM: 8px; PADDING-TOP: 8px">' +
                            '<p></p>' +
                            '<p></p>' +
                            '<p style="margin:0;padding:2px 5px;background:#eee;font-size:12px"><b>From:</b>' + fromsStr + '</p>' +
                            '<p style="margin:0;padding:2px 5px;background:#eee;font-size:12px"><b>Date:</b>' + obj.sendTime + '</p>' +
                            '<p style="margin:0;padding:2px 5px;background:#eee;font-size:12px"><b>To:</b>' + tosStr + '</p>' +
                            '<p style="margin:0;padding:2px 5px;background:#eee;font-size:12px"><b>Subject:</b>' + obj.subject + '</p>' +
                            '<p></p>' +
                            '</div>' +
                            '</div>' +
                            '</div>';
                        if (hflx == 0) {
                            if (obj.froms[0].name != null && obj.froms[0].value != '') {
                                html = '<div class="addr-outer"><div class="one" contenteditable="false" data-type="0" data-id="' + emailId + '"><b>' + obj.froms[0].name + '</b><span>&lt;' + obj.froms[0].value + '&gt;</span><span class=fh>;<span><div></div>';
                            } else {
                                html = '<div class="addr-outer"><div class="one" contenteditable="false" data-type="0" data-id="' + emailId + '"><b></b><span>&lt;' + obj.froms[0].value + '&gt;</span><span class=fh>;<span><div></div>';
                            }
                            $('#divtxt').prepend(html);  //收件人
                        } else if (hflx == 1) {
                            if (obj.tos[0].name != null && obj.tos[0].value != '') {
                                html = '<div class="addr-outer"><div class="one" contenteditable="false" data-type="0" data-id="' + emailId + '"><b>' + obj.tos[0].name + '</b><span>&lt;' + obj.tos[0].value + '&gt;</span><span class=fh>;<span><div></div>';
                            } else {
                                html = '<div class="addr-outer"><div class="one" contenteditable="false" data-type="0" data-id="' + emailId + '"><b></b><span>&lt;' + obj.tos[0].value + '&gt;</span><span class=fh>;<span><div></div>';
                            }
                            $('#sendTheme').val(subject);
                            $('#divtxt').prepend(html);  //收件人
                            UE.getEditor('sendEditor').ready(function () {
                                UE.getEditor('sendEditor').setContent(info, true);
                                UE.getEditor('sendEditor').setContent(obj.content, true);
                            });
                        } else if (hflx == 2) {
                            $('#sendTheme').val(zfsubject);
                            UE.getEditor('sendEditor').ready(function () {
                                UE.getEditor('sendEditor').setContent(info, true);
                                UE.getEditor('sendEditor').setContent(obj.content, true);
                            });
                        } else if (hflx == 3) {
                            $('#sendTheme').val(subject);
                            UE.getEditor('sendEditor').ready(function () {
                                UE.getEditor('sendEditor').setContent(info, true);
                                UE.getEditor('sendEditor').setContent(obj.content, true);
                            });
                        } else if (hflx == 5) {//打开草稿
                            var tos = obj.tos;
                            var html5 = '';
                            for (var i = 0; i < tos.length; i++) {
                                html5 += '<div class="addr-outer"><div class="one" contenteditable="false" data-type="0" data-id=""><b>' + (obj.tos[i].name || '') + '</b><span>&lt;' + tos[i].value + '&gt;</span><span class=fh>;<span><div></div>';
                            }
                            var htmlCcs = '';
                            if (obj.ccs[0] != null && obj.ccs[0] != '') {
                                for (var i = 0; i < (obj.ccs).length; i++) {
                                    htmlCcs += '<div class="addr-outer"><div class="one" contenteditable="false" data-type="0" data-id="' + emailId + '"><b>' + (obj.ccs[i].name || '') + '</b><span>&lt;' + obj.ccs[i].value + '&gt;</span><span class=fh>;<span><div></div>';
                                }
                            } else {
                                htmlCcs = ''
                            }
                            $('#sendTheme').attr({'data-id': obj.id, 'data-emailAddress': obj.emailAddress}).val(subject);
                            $('#divtxt').prepend(html5);  //收件人
                            UE.getEditor('sendEditor').ready(function () {
                                UE.getEditor('sendEditor').setContent("");
                                UE.getEditor('sendEditor').setContent(obj.content, true);
                            });
                        } else if (hflx == 10) {
                            var data = $.GetQueryString('data');
                            newEmailfujian(data)
                        }
                    }
                });
            }
        };
        newEmailObj.signature();
        newEmailObj.addressList();
        newEmailObj.contactsList();
        //编辑器
        var editors = {
            head: null,
            foot: null,
            type: null,
            /*
             * @createEditor 初始化编辑器
             */
            createEditor: function () {
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
                        'emotion'//表情
                        // 'source', //源代码
                    ]
                ];
                editors.main = UE.getEditor('sendEditor', {
                    'toolbars': editorToolbar,
                    'autoHeightEnabled': false,
                    'initialFrameWidth': "100%",
                    'initialFrameHeight': "320"
                });
            }
        };
        editors.createEditor();

        function newEmailfujian(data) {
            $.ajax({
                url: Base.sitUrl + '/api/email/v1/to/attachment',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: data
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
                        return
                    }
                    var data = res.data;
                    var filename = data.name;
                    var url = data.url;
                    var pdfUrl = 'http://' + url;
                    var html = '<li data-url="' + pdfUrl + '"><i class="pub-icon fujian-excl-iocn"></i><span>' + filename + '</span><span class="removeLi">删除</span><span class="previewEml">预览</span></li>';
                    $("#added-files").show().prepend(html);
                }
            })
        }

        $('#added-files').on('click', '.removeLi', function () {
            $(this).parents("li").remove();
        });
        //邮件设置
        function sign() {
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
                    if (data !== null) {
                        if (data.isUsing == 1) { //导入是否使用签名
                            var p = '<hr style="width:210px;margin-top:12px;background-color:#b5c4df;float:left;height:1px;border:none;"></br><p></p>';
                            var sign = data.signature.replace(/&#39;/g, '\"');
                            var color = '"' + data.fontColour + '"';
                            var fontSize = '"' + data.fontSize + '"';
                            UE.getEditor('sendEditor').ready(function () {
                                UE.getEditor('sendEditor').setContent(p, true);
                                UE.getEditor('sendEditor').setContent(sign, true);
                            });
                        }
                    }
                }
            });
        }

        function settingEmail() {
            $.ajax({
                url: Base.sitUrl + "/api/email/setting/v1/config/get",
                dataType: "json",
                type: "POST",
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }

                    var data = result.data;
                    if (data) {
                        var defaultTemplate = data.defaultTemplate;
                        if (data.defaultCcOpend == 0 && data.defaultCc != '') {
                            $('#carbonCopy').prepend('<div class="addr-outer"><div class="one" contenteditable="false" data-type="0"><b></b><span>&lt;' + data.defaultCc + '&gt;</span><span class=fh>;<span><div></div>');
                        }
                        if (data.defaultBccOpend == 0 && data.defaultBcc != '') {
                            $('#blindCarbonCopy').prepend('<div class="addr-outer"><div class="one" contenteditable="false" data-type="0"><b></b><span>&lt;' + data.defaultBcc + '&gt;</span><span class=fh>;<span><div></div>');
                        }
                        $.ajax({//邮件模板
                            url: Base.sitUrl + "/api/org/v1/org/template/list",
                            dataType: "json",
                            type: "POST",
                            async: false,
                            success: function (result) {
                                if (!result.success) {
                                    $.Alert(result.message);
                                    return;
                                }

                                var data = result.data;
                                var p = '<p></p>';
                                for (var i = 0; i < data.length; i++) {
                                    if (defaultTemplate == data[i].id) {
                                        var tem = data[i].template.replace(/&#39;/g, '"');
                                        UE.getEditor('sendEditor').ready(function () {
                                            UE.getEditor('sendEditor').setContent(tem, true);
                                        });
                                    }
                                }
                                sign();
                            }
                        });
                        if (data !== '') {
                            UE.getEditor('sendEditor').ready(function () {
                                UE.getEditor('sendEditor').execCommand('forecolor', data.fontColour);//字体颜色
                                UE.getEditor('sendEditor').execCommand('fontsize', data.fontSize);//字体大小
                                UE.getEditor('sendEditor').execCommand('fontfamily', data.fontStyle);//字体
                            });
                        } else {
                            UE.getEditor('sendEditor').ready(function () {
                                UE.getEditor('sendEditor').execCommand('forecolor', '#000');//字体颜色
                                UE.getEditor('sendEditor').execCommand('fontsize', '14px');//字体大小
                                UE.getEditor('sendEditor').execCommand('fontfamily', '宋体');//字体
                            });
                        }
                    }
                }
            });
        }

        //PI筛选
        $('#piInput .btn').bind('click', function () {
            var val = $('#piInput').find('input[type=text]').val();
            newEmailObj.insertModelPi(val);
        });
        $('#piInput input').unbind('click').bind('keyup', function (event) {
            if (event.keyCode == "13") {
                var val = $(this).val();
                newEmailObj.insertModelPi(val);
            }
        })
        //报价单筛选
        $('#quoteInput .btn').bind('click', function () {
            var val = $('#quoteInput').find('input[type=text]').val();
            newEmailObj.insertModel3(val);
        });
        $('#quoteInput input[type=text]').unbind('click').bind('keyup', function (event) {
            if (event.keyCode == "13") {
                var val = $(this).val();
                newEmailObj.insertModel3(val);
            }
        });

        //预览
        $('#added-files').on('click', '.previewEml', function () {
            var url = $(this).parents('li').attr('data-url');
            var name = $(this).prev().prev().prev().text();
            var _length = url.lastIndexOf('.');
            var ext = url.substring(_length, url.length).toUpperCase();
            if (ext == ".PNG" || ext == ".JPG" || ext == '.JPEG' || ext == '.SVG' || ext == '.GIF') {
                var html = '<img src="' + url + '" alt="" class="previewImg previewContent">'
            } else if (ext == ".TXT" || ext == '.JS' || ext == '.CSS') {
                var html = '<iframe src="' + url + '" frameborder="0" class="previewIframe previewContent"></iframe>'
            } else if (ext == ".DOC" || ext == ".DOCX" || ext == '.XLS' || ext == '.XLSX' || ext == '.ET' ||
                ext == '.PPT' || ext == '.PPTX' || ext == '.WPS' || ext == '.ZIP' || ext == '.RAR' || ext == '.7Z' || ext == '.PDF') {
                var preurl = Base.sitUrl + '/api/export/v1/file/preview?data={file: \'' + url + '\'}';
                var html = '<iframe src="' + preurl + '" frameborder="0" class="previewIframe previewContent"></iframe>'
            } else {
                $.Alert(ext.toLowerCase() + '格式暂不支持预览');
                return
            }
            $('#preview').find('h3').text(name);
            $('#preview').find('.previewContent').remove();
            $('#preview').append(html).show();
        });
        $('#previewClose').on('click', function () {
            $('#preview').hide().find('.previewContent').remove();
        });

        //产品模板筛选
        $('#pdtInput1 .btn').bind('click', function () {
            var val = $('#pdtInput1').find('input[type=text]').val();
            newEmailObj.insertModelPdt(val);
        });
        $('#pdtInput1 input').unbind('click').bind('keyup', function (event) {
            if (event.keyCode == 13) {
                var val = $(this).val();
                newEmailObj.insertModelPdt(val);
            }
        });
        $('#pdtGroup').on('change', function () {
            var val = $(this).find('option:selected').val();
            var name = $('#pdtInput1').find('input[type=text]').val();
            newEmailObj.insertModelPdt(name, val);
        });
        $('#pdtSelect1').on('change', function () {
            var group = $('#pdtGroup').find('option:selected').val();
            var val = $(this).find('option:selected').val();
            var name = $('#pdtInput1').find('input[type=text]').val();
            newEmailObj.insertModelPdt(name, group, val);
        });
        $('#pdtSelect2').on('change', function () {
            var val = $(this).find('option:selected').val();
            var name = $('#pdtInput1').find('input[type=text]').val();
            newEmailObj.insertModelPdt(name, group, val);
        });
        $('#pdtSelect3').on('change', function () {
            var val = $(this).find('option:selected').val();
            var name = $('#pdtInput1').find('input[type=text]').val();
            newEmailObj.insertModelPdt(name, group, val);
        });
        $('#pdtSelect4').on('change', function () {
            var val = $(this).find('option:selected').val();
            var name = $('#pdtInput1').find('input[type=text]').val();
            newEmailObj.insertModelPdt(name, group, val);
        });
        //获取产品类型
        function pdt1() {
            $.ajax({
                url: Base.sitUrl + '/api/product/v1/product/type/sublist?pid=0',
                type: 'GET',
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
                    $("#pdtSelect1").empty().append('<option value="">全部</option>').append(list);
                }
            })
        };

        $("#pdtSelect1").on('change', function () {
            var id = $("#pdtSelect1 option:selected").val();
            $.ajax({
                url: Base.sitUrl + '/api/product/v1/product/type/sublist?pid=' + id,
                type: 'GET',
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
                    $("#pdtSelect2").empty().append('<option value="' + id + '">全部</option>').append(list);
                }
            })
        });
        $("#pdtSelect2").on('change', function () {
            var id = $("#pdtSelect2 option:selected").val();
            $.ajax({
                url: Base.sitUrl + '/api/product/v1/product/type/sublist?pid=' + id,
                type: 'GET',
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
                    $("#pdtSelect3").empty().append('<option value="' + id + '">全部</option>').append(list);
                }
            })
        })
        $("#pdtSelect3").on('change', function () {
            var id = $("#pdtSelect3 option:selected").val();
            $.ajax({
                url: Base.sitUrl + '/api/product/v1/product/type/sublist?pid=' + id,
                type: 'GET',
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
                    $("#pdtSelect4").empty().append('<option value="' + id + '">全部</option>').append(list);
                }
            })
        })
        //获取产品分组
        function pdtGroup() {
            $.ajax({
                url: Base.sitUrl + '/api/product/v1/product/catelog/list',
                type: 'GET',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var data = res.data;
                    var list = "";
                    for (var i = 0; i < data.length; i++) {
                        list += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                    }
                    $("#pdtGroup").empty().append('<option value="">全部</option>').append(list);
                }
            })
        }

        //显示通讯录
        //通讯录与左边邮件编辑高度一致
        var h = $('.sentbox-left').height();
        $('.rightShow, .sentbox-right').height(h - 40);

        $('.rightShow').on('click', function () {
            var w = $('#addEmailNew').width();
            if ($('.sentbox-right').hasClass('none')) {
                var w1 = w - 220;
                $('.sentbox-left').animate({
                    'width': w1 + 'px'
                });
                $('.sentbox-right').animate({
                    'width': '180px',
                    'opacity': '1'
                }, 'fast').removeClass('none');
                $('.leftIcon').css('transform', 'rotate(90deg)');
            } else {
                var w2 = w - 25;
                $('.sentbox-left').animate({
                    'width': w2 + 'px'
                });
                $('.sentbox-right').animate({
                    'width': '0',
                    'opacity': '0'
                }, 'fast').addClass('none');
                $('.leftIcon').css('transform', 'rotate(-90deg)');
            }
        });
        //邮件右侧栏收起
        var message=location.href;
        if(message.match("showType=right")){
            $(".rightShow").click();
        }

        if (hflx) {
            newEmailObj.huifuEmail();
        }
        settingEmail();

        window.saveDraft = function(goPage){
            var ele = newEmailInfomation(12);

            if (ele.flag) {
                return newEmailObj.operationEmail(ele.obj, '/api/email/v1/draft/save');
            }
        };
    });
});
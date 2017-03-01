require(['common'], function () {
    require(['maintab', 'blockUI', 'jqueryUI', 'evol', 'datetimepickerCN', 'category', 'countries'], function (maintab) {
        //显示相应的功能按钮
        var funcList = top.funcList;
        $('[data-code]').each(function () {
            for (var i = 0; i < funcList.length; i++) {
                if (funcList[i].code == $(this).attr('data-code')) {
                    $(this).removeClass('none');
                }
            }
        });

        if (jQuery().datetimepicker) {
            $('.datetime-picker').datetimepicker({
                language: 'zh-CN',
                todayBtn: 1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                format: "yyyy-mm-dd",
                bootcssVer: 3//因为html里的写法不规范，所以必须要加上这个时间插件才能正常显示
            });
        }

        $(document).on('click', '.color-show', function (evt) {
            $(this).parents("li").find('.cpOther').colorpicker({showOn: 'none'});
            evt.stopImmediatePropagation();
            $(this).parents("li").find('.cpOther').colorpicker("showPalette");
            $(this).parents("li").find('.cpOther').on("change.color", function (event, color) {
                $(this).parents("li").find(".color-show").css("background-color", color);
            });
        });
        //客户字段设置，联系人设置，订单设置
        var getPage = location.href;
        var bizType = 1;
        var setType = 'client';

        if (getPage.indexOf('bk-resource-lm') > 0) {
            bizType = 2;
            setType = 'contacts';
            getList();
        } else if (getPage.indexOf('bk-resource-ofInfo') > 0) {
            bizType = 3;
            setType = 'order';
            getList();
        } else {
            bizType = 1;
            setType = 'client';
            $('#client-info-set-li').on('click', getList);
        }

        //客户字段修改
        function infoAdd() {
            //客户字段，添加
            $('#' + setType + '-info-set-add').unbind('click').click(function () {
                var liList = '<li data-type="1" data-isAdd="yes"><input type="text" class="resource-input" name="" value="新字段"><input type="checkbox" checked="true"> 必填 <i class="group-remove ' + setType + '-info-set-del"></li>';
                $('#' + setType + '-info-set ul').append(liList);
                $('#' + setType + '-info-set ul input:checkbox').uniform();
            });

            //删除按钮
            $('#' + setType + '-info-set').unbind('click').on('click', '.' + setType + '-info-set-del', function () {
                var getLi = $(this).parent();
                var isAdd = getLi.attr('data-isAdd');
                console.log(isAdd == 'no');
                if (isAdd == 'no') {//已有字段
                    getLi.attr('data-type', '2').css('display', 'none');
                } else {//新增字段
                    getLi.remove();
                }
            });

            //输入框值改变
            $('#' + setType + '-info-set').unbind('change').on('change', 'input:text, input:checkbox', function () {
                var getLi = $(this).parents('li');
                getLi.attr('data-isEdt', 'yes');
            });

            //客户字段 保存
            $('#' + setType + '-info-set-save').unbind('click').click(function () {
                var allDatas = {
                    attributes: []
                };

                $('#' + setType + '-info-set ul').children("li").each(function () {
                    var addData = {}, edtData = {}, delData = {};
                    var getEdtType = $(this).attr('data-type');
                    if (getEdtType == '1') {//添加新字段
                        addData.type = 1;
                        addData.bizType = bizType;
                        addData.name = $(this).find('input:text').val();
                        addData.required = $(this).find('input:checkbox').prop('checked') ? 1 : 0;
                        addData.inputType = 1;
                        addData.length = $(this).find('input:text').val().length;
                        addData.status = 1;
                        allDatas.attributes.push(addData);

                        var $input = $(this).find('input:text')[0];
                        $('.client-info-ul').find('li input:text').each(function (e) {
                            if ($input != this && $(this).val() == $($input).val()) {
                                $.Alert('新字段不能重名！');
                                allDatas.attributes = [];
                                return false;
                            }
                        });
                    }
                    else if (getEdtType == '2') {
                        delData.id = $(this).attr('data-id');
                        delData.type = 2;
                        delData.bizType = bizType;
                        delData.name = $(this).find('input:text').val();
                        delData.required = $(this).find('input:checkbox').prop('checked') ? 1 : 0;
                        delData.inputType = 1;
                        delData.length = $(this).find('input:text').val().length;
                        delData.status = 1;
                        allDatas.attributes.push(delData);
                    }
                    else if (getEdtType == '3') {
                        if ($(this).attr('data-isEdt') == 'yes') {
                            edtData.id = $(this).attr('data-id');
                            edtData.type = 3;
                            edtData.bizType = bizType;
                            edtData.name = $(this).find('input:text').val();
                            edtData.required = $(this).find('input:checkbox').prop('checked') ? 1 : 0;
                            edtData.inputType = 1;
                            edtData.length = $(this).find('input:text').val().length;
                            edtData.status = 1;
                            allDatas.attributes.push(edtData);
                        }
                    } else {//这种情况是修改已有字段是否必填
                        if ($(this).attr('data-isEdt') == 'yes') {
                            edtData.id = $(this).attr('data-id');
                            edtData.type = 3;
                            edtData.bizType = bizType;
                            edtData.name = $(this).find('input:text').val();
                            edtData.required = $(this).find('input:checkbox').prop('checked') ? 1 : 0;
                            edtData.inputType = 1;
                            edtData.length = $(this).find('input:text').val().length;
                            edtData.status = 1;
                            allDatas.attributes.push(edtData);
                        }
                    }
                });

                if (allDatas.attributes.length > 0) {
                    $.ajax({
                        url: Base.sitUrl + "/api/org/v1/org/staff/defined/attribute/edit",
                        data: {data: JSON.stringify(allDatas)},
                        dataType: "json",
                        type: "GET",
                        success: function (result) {
                            if (result.success) {
                                $.Alert("保存成功！");
                            } else {
                                $.Alert("保存失败！");
                            }
                        }
                    });
                } else {
                    $.Alert("没做任何修改！");
                }

            });
        }

        function getList() {
            $('#' + setType + '-info-set ul').children("li").remove();
            $.ajax({
                url: Base.sitUrl + "/api/org/v1/org/staff/defined/attribute/list",
                data: {data: JSON.stringify({'bizType': bizType})},
                dataType: "json",
                type: "GET",
                success: function (result) {
                    if (!result.success) {
                        alert(result.message);
                        return;
                    }
                    var data = result.data;
                    for (var i = 0; i < data.length; i++) {
                        var dataDet = data[i];
                        var liList = '';
                        if (dataDet.status == -1) {//不可更改
                            if (dataDet.required == 0) {//非必填
                                liList = '<li data-isAdd="no" data-id="' + data[i].id + '"><input type="text" class="resource-input" name="" value="' + data[i].name + '" disabled><input type="checkbox" disabled> 必填</li>';
                            } else {
                                liList = '<li data-isAdd="no" data-id="' + data[i].id + '"><input type="text" class="resource-input" name="" value="' + data[i].name + '" disabled><input type="checkbox" checked="true" disabled> 必填</li>';
                            }
                        } else {//可更改
                            if (dataDet.required == 0) {//非必填
                                if (dataDet.removable == 0) {//不可删除
                                    liList = '<li data-type="3" data-isEdt="no" data-id="' + data[i].id + '" data-isAdd="no"><input type="text" class="resource-input" name="" value="' + data[i].name + '" disabled><input type="checkbox" > 必填 </li>';
                                } else {
                                    liList = '<li data-type="3" data-isEdt="no" data-id="' + data[i].id + '" data-isAdd="no"><input type="text" class="resource-input" name="" value="' + data[i].name + '"><input type="checkbox" > 必填 <i class="group-remove ' + setType + '-info-set-del"></li>';
                                }
                            } else {
                                if (dataDet.removable == 0) {//不可删除
                                    liList = '<li data-type="3" data-isEdt="no" data-id="' + data[i].id + '" data-isAdd="no"><input type="text" class="resource-input" name="" value="' + data[i].name + '"disabled><input type="checkbox" checked="true" > 必填</li>';
                                } else {
                                    liList = '<li data-type="3" data-isEdt="no" data-id="' + data[i].id + '" data-isAdd="no"><input type="text" class="resource-input" name="" value="' + data[i].name + '"><input type="checkbox" checked="true" > 必填 <i class="group-remove ' + setType + '-info-set-del"></li>';
                                }
                            }
                        }
                        if (data[i].code == 'order_no' && bizType == 3) {//订单设置的订单号
                            liList = '';
                        }
                        $('#' + setType + '-info-set ul').append(liList);
                    }
                    $('#' + setType + '-info-set ul input:checkbox').uniform();
                    infoAdd();
                }
            });
        }

        //分组设置
        $("#group-set-li").on('click', function () {
            $(this).children(".panel-left-label").addClass("active");
            $(this).siblings().find(".panel-left-label").removeClass("active");
            $("#group-set").show().siblings(".panel-body").hide();
        });
        //客户上限
        $("#client-up-li").on('click', function () {
            $(this).children(".panel-left-label").addClass("active");
            $(this).siblings().find(".panel-left-label").removeClass("active");
            $("#client-up").show().siblings(".panel-body").hide();

            clientNumRe();
        });
        //客户来源
        $("#client-source-li").on('click', function () {
            $(this).children(".panel-left-label").addClass("active");
            $(this).siblings().find(".panel-left-label").removeClass("active");
            $("#client-source").show().siblings(".panel-body").hide();

            clientSourceRe();
        });
        //黑名单设置
        $("#blacklist-set-li").on('click', function () {
            $(this).children(".panel-left-label").addClass("active");
            $(this).siblings().find(".panel-left-label").removeClass("active");
            $("#blacklist-set").show().siblings(".panel-body").hide();
            reBlack();
        });
        //客户字段设置
        $("#client-info-set-li").on('click', function () {
            $(this).children(".panel-left-label").addClass("active");
            $(this).siblings().find(".panel-left-label").removeClass("active");
            $("#client-info-set").show().siblings(".panel-body").hide();
        });
        //客户状态设置
        $("#status-set-li").on('click', function () {
            $(this).children(".panel-left-label").addClass("active");
            $(this).siblings().find(".panel-left-label").removeClass("active");
            $("#status-set").show().siblings(".panel-body").hide();
            clientStatusRe();
        });

        //客户公海设置
        $("#client-public-li").on('click', function () {
            $(this).children(".panel-left-label").addClass("active");
            $(this).siblings().find(".panel-left-label").removeClass("active");
            $("#client-public").show().siblings(".panel-body").hide();
            publicRe();
        });

        //客户导出
        $("#output-cust-li").on('click', function () {
            $(this).children(".panel-left-label").addClass("active");
            $(this).siblings().find(".panel-left-label").removeClass("active");
            $("#output-cust").show().siblings(".panel-body").hide();
        });

        //十六进制颜色值的正则表达式
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        /*RGB颜色转换为16进制*/
        String.prototype.colorHex = function () {
            var that = this;
            if (/^(rgb|RGB)/.test(that)) {
                var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
                var strHex = "#";
                for (var i = 0; i < aColor.length; i++) {
                    var hex = Number(aColor[i]).toString(16);
                    if (hex === "0") {
                        hex += hex;
                    }
                    strHex += hex;
                }
                if (strHex.length !== 7) {
                    strHex = that;
                }
                return strHex;
            } else if (reg.test(that)) {
                var aNum = that.replace(/#/, "").split("");
                if (aNum.length === 6) {
                    return that;
                } else if (aNum.length === 3) {
                    var numHex = "#";
                    for (var i = 0; i < aNum.length; i += 1) {
                        numHex += (aNum[i] + aNum[i]);
                    }
                    return numHex;
                }
            } else {
                return that;
            }
        };
        // 添加分组
        $(".addGoup").on('click', function () {
            var addCont = '<li data-id="" data-type="1" data-totalCount="">' +
                '<i class="group-move"></i>' +
                '<a href="#" class="color-show status-label" style="background:blue">无</a>' +
                '<input class="cpOther" value="" />' +
                '<input type="text" class="resource-input" name="">' +
                '<label class="label-checkbox"><div class="checker"><span class="checked"><input type="checkbox" checked="true"></span></div> 必填</label> ' +
                '<i class="group-remove"></i>' +
                '</li>';
            $(this).prev("ul").append(addCont);
        });

        function clientNumRe() {
            $.ajax({
                url: Base.sitUrl + "/api/org/v1/org/staff/limit/customer/list",
                dataType: "json",
                type: "POST",
                success: function (result) {
                    if (!result.success) {
                        alert(result.message);
                        return;
                    }

                    var data = result.data,
                        trList='';
                    for (var i = 0; i < data.length; i++) {
                        trList += '<tr data-id="' + data[i].id + '">' +
                            '<td width="20%" data-uerId="' + data[i].userId + '"><label class="blue">' + data[i].userName + '</label></td>' +
                            '<td width="20%" data-dep="' + data[i].department + '">' + data[i].departmentName + '</td>' +
                            '<td width="20%">' + data[i].currentNumber + '</td>' +
                            '<td width="20%">' +
                            '<input type="text" class="table-input" value="' + data[i].upperLimit + '">' +
                            '</td></tr>';
                    }
                    $("#client-up .table tbody").empty().append(trList);
                }
            });
        }

        //客户上限.修改列表
        $("#client-up-save").on('click', function () {
            var trI = $("#client-up .table tbody").children("tr");
            var dataJson = "";
            var editData = "";
            for (var i = 0; i < trI.length; i++) {
                var inputNum = trI.eq(i).find("input[type=text]").val();
                var custNum = trI.eq(i).find('td:nth-child(3)').text();
                custNum = parseInt(custNum);
                if (inputNum < custNum) {
                    $.Alert("客户上限数必须大于等于目前客户数");
                    return;
                }
                if (isNaN(inputNum)) {
                    $.Alert("请填写数字！");
                    trI.eq(i).find("input[type=text]").css("border", "1px solid red");
                    return;
                }
                dataJson += '{"key":"' + trI.eq(i).data("id") + '","value":"' + inputNum + '","type":"' + 3 + '"}' + ',';
            }
            dataJson = dataJson.substr(0, dataJson.length - 1);
            editData = '{"keyValueTypes":[' + dataJson + ']}';
            $.Confirm("确认保存？", "", function () {
                $.ajax({
                    url: Base.sitUrl + "/api/org/v1/org/staff/limit/customer/edit",
                    dataType: "json",
                    type: "POST",
                    data: {
                        data: editData
                    },
                    success: function (result) {
                        if (!result.success) {
                            alert(result.message);
                            return;
                        }

                        $.Alert("保存成功！");
                        clientNumRe();
                    }
                });
            });
        });

        //客户来源
        function clientSourceRe() {
            $.ajax({
                url: Base.sitUrl + "/api/org/v1/org/staff/customer/source/list",
                dataType: "json",
                type: "POST",
                success: function (result) {
                    if (!result.success) {
                        alert(result.message);
                        return;
                    }

                    var data = result.data,
                        liList='';
                    for (var i = 0; i < data.length; i++) {
                        liList += '<li data-id="' + data[i].id + '" data-type="">' +
                            '<i class="group-move"></i>' +
                            '<input type="text" class="resource-input" value="' + data[i].name + '" placeholder="">' +
                            ' <i class="group-remove"></i>' +
                            '</li>';
                    }
                    $("#client-source ul").empty().append(liList);
                }
            });
        }

        //客户来源删除
        $('#client-source').on('click', '.group-remove', function () {
            var $oThis = $(this);
            var totalCount = parseInt($(this).parents('li').attr('data-totalCount'));
            if (totalCount > 0) {
                $.Alert('此来源中有关联信息,请取消后删除')
            } else {
                $.Confirm("确认删除？", "", function () {
                    $oThis.parent().hide().attr("data-type", "2");
                });
            }
        });
        //客户来源.修改列表
        $("#client-source-save").on('click', function () {
            var liI = $("#client-source ul").children("li");
            var dataJson = "";
            var editData = "";
            var typeVal = "";
            for (var i = 0; i < liI.length; i++) {
                var inputNum = liI.eq(i).find("input[type=text]").val();
                if ($.GetLength(inputNum) > 64) {
                    $.Alert('请输入小于64个字母或32个汉字的名称')
                    return
                }
                var orders = liI.eq(i).index() + 1;
                if (liI.eq(i).data("type") !== "") {
                    typeVal = liI.eq(i).data("type");
                } else {
                    typeVal = 3;
                }
                if (inputNum == "" && liI.eq(i).css('display') !== 'none') {
                    alert("名称不能为空！");
                    return;
                }
                var dataLi = '{"key":"' + liI.eq(i).data("id") + '","value":"' + inputNum + '","type":"' + typeVal + '","valueI":"' + orders + '"}' + ',';
                if (inputNum == "") {
                    dataLi = '';
                } else {
                    dataJson += dataLi;
                }
            }
            dataJson = dataJson.substr(0, dataJson.length - 1);
            editData = '{"keyValueTypes":[' + dataJson + ']}';
            $.ajax({
                url: Base.sitUrl + "/api/org/v1/org/staff/customer/source/edit",
                dataType: "json",
                type: "POST",
                data: {
                    data: editData
                },
                success: function (result) {
                    if (!result.success) {
                        alert(result.message);
                        return;
                    }

                    $.Alert("保存成功！");
                    clientSourceRe();
                }
            });
        });
        $('#status-set .addGoup').bind('click', function () {
            $('#status-set-save').show();
        });
        function reBlack() {
            $.ajax({
                url: Base.sitUrl + "/api/org/v1/org/staff/customer/blacklist/list",
                dataType: "json",
                type: "GET",
                success: function (result) {
                    if (!result.success) {
                        alert(result.message);
                        return;
                    }

                    var data = result.data,
                        liList = '';
                    for (var i = 0; i < data.length; i++) {
                        liList += '<li data-id="' + data[i].id + '" data-isDel="' + data[i].isDel + '" data-type="">' +
                            '<input type="text" class="resource-input" name="" value="' + data[i].email + '"><i class="group-remove"></i>' +
                            '</li>';
                    }
                    $("#blacklist-set ul").empty().append(liList);
                }
            });
        }

        $('#blacklist-set .addGoup').bind('click', function () {
            $('#blacklist-set-save').show();
        })
        //黑名单删除
        $('#blacklist-set').on('click', '.group-remove', function () {
            var $oThis = $(this);
            $.Confirm("确认删除？", "", function () {
                $oThis.parent().hide();
                $oThis.parent("").attr("data-type", "2");
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
                if (liI.eq(i).data("type") !== "") {
                    typeVal = liI.eq(i).data("type");
                } else {
                    typeVal = 3;
                }
                if (inputNum == "" && liI.eq(i).css('display') !== 'none') {
                    alert("名称不能为空！");
                    return;
                }
                var dataLi = '{"key":"' + liI.eq(i).data("id") + '","value":"' + inputNum + '","type":"' + typeVal + '"}' + ',';
                if (inputNum == "") {
                    dataLi = '';
                } else {
                    dataJson += dataLi;
                }
            }
            dataJson = dataJson.substr(0, dataJson.length - 1);
            editData = '{"keyValueTypes":[' + dataJson + ']}';
            $.ajax({
                url: Base.sitUrl + "/api/org/v1/org/staff/customer/blacklist/edit",
                dataType: "json",
                type: "POST",
                data: {
                    data: editData
                },
                success: function (result) {
                    if (!result.success) {
                        alert(result.message);
                        return;
                    }

                    $.Alert("保存成功！");
                    reBlack();
                }
            });
        });

        function clientStatusRe() {
            $.ajax({
                url: Base.sitUrl + "/api/org/v1/org/staff/customer/status/list",
                dataType: "json",
                type: "POST",
                success: function (result) {
                    if (!result.success) {
                        alert(result.message);
                        return;
                    }

                    var data = result.data,
                        liList='';
                    for (var i = 0; i < data.length; i++) {
                        var sign = data[i].name.substring(0, 1);
                        liList += '<li data-id="' + data[i].id + '" data-type="">' +
                            '<i class="group-move"></i>' +
                            '<a href="#" class="color-show status-label" style="background:' + data[i].colour + '">' + sign + '</a>' +
                            '<input class="cpOther" value="' + data[i].colour + '" />' +
                            '<input type="text" class="resource-input" value="' + data[i].name + '" placeholder="">' +
                            ' <i class="group-remove"></i>' +
                            '</li>';
                    }
                    $("#status-set ul").empty().append(liList);
                }
            });
        }

        //客户状态删除
        $('#status-set').on('click', '.group-remove', function () {
            var $oThis = $(this);
            var totalCount = parseInt($(this).parents('li').attr('data-totalCount'));
            if (totalCount > 0) {
                $.Alert('此状态中有关联信息,请取消后删除')
            } else {
                $.Confirm("确认删除？", "", function () {
                    $oThis.parent().hide();
                    $oThis.parent("").attr("data-type", "2");
                });
            }
        });
        //客户状态.修改列表
        $("#status-set-save").on('click', function () {
            var liI = $("#status-set ul").children("li");
            var dataJson = "";
            var editData = "";
            var addData = "";
            var typeVal = "";
            for (var i = 0; i < liI.length; i++) {
                var inputNum = liI.eq(i).find("input[type=text]").val();
                if ($.GetLength(inputNum) > 64) {
                    $.Alert('请输入小于64个字母或32个汉字的名称')
                    return
                }
                var orders = liI.eq(i).index() + 1;
                var colorVal = liI.eq(i).find(".status-label").css("background-color").colorHex();
                if (liI.eq(i).data("type") !== "") {
                    typeVal = liI.eq(i).data("type");
                } else {
                    typeVal = 3;
                }
                if (inputNum == "" && liI.eq(i).css('display') !== 'none') {
                    alert("名称不能为空！");
                    return;
                }
                var dataLi = '{"key":"' + liI.eq(i).data("id") + '","value":"' + inputNum + '","valueI":"' + colorVal + '","type":"' + typeVal + '","valueII":"' + orders + '"}' + ',';
                if (inputNum == "") {
                    dataLi = '';
                } else {
                    dataJson += dataLi;
                }
            }
            dataJson = dataJson.substr(0, dataJson.length - 1);
            editData = '{"keyValueTypes":[' + dataJson + ']}';
            $.ajax({
                url: Base.sitUrl + "/api/org/v1/org/staff/customer/status/edit",
                dataType: "json",
                type: "POST",
                data: {
                    data: editData
                },
                success: function (result) {
                    if (!result.success) {
                        alert(result.message);
                        return;
                    }
                    ;
                    $.Alert("保存成功！");
                    clientStatusRe();
                }
            });
        });
        //客户状态管理
        $("#status-button").on('click', function () {
            $(".status-ul .status-label:last").css("background-color", getRandomColor());
        });

        $(".status-ul .status-label").each(function () {
            var text = $(this).parent().children(".resource-input").val().substring(0, 1);
            $(this).text(text);
        });
        $("#status-set-save").on('click', function () {
            $(".status-ul .resource-input").each(function () {
                var text = $(this).val().substring(0, 1);
                if (text == "") {
                    $(this).parent().children(".status-label").text("无");
                } else {
                    $(this).parent().children(".status-label").text(text);
                }
            })
        });
        $('#group-set .addGoup').bind('click', function () {
            $('#group-set-save').show();
        })
        function groupRe() {
            $("#group-set ul").children("li").remove();
            $.ajax({
                url: Base.sitUrl + "/api/customer/v1/customer/group/list",
                dataType: "json",
                type: "POST",
                success: function (result) {
                    if (!result.success) {
                        alert(result.message);
                        return;
                    }

                    var data = result.data;
                    if (data.length > 0) {
                        $('#group-set-save').show();
                    }
                    for (var i = 0; i < data.length; i++) {
                        var sign = data[i].name.substring(0, 1);
                        var liList = '<li data-id="' + data[i].id + '" data-type="" data-totalCount="' + data[i].totalCount + '">' +
                            '<i class="group-move"></i>' +
                            '<input type="text" class="resource-input" value="' + data[i].name + '" placeholder="">' +
                            ' <i class="group-remove"></i>' +
                            '</li>';
                        $("#group-set ul").append(liList);
                    }
                }
            });
        }

        //分组设置删除
        $('#group-set').on('click', '.group-remove', function () {
            var $oThis = $(this);
            var totalCount = parseInt($(this).parents('li').attr('data-totalCount'));
            if (totalCount > 0) {
                $.Alert('此分组中有关联信息,请取消后删除')
            } else {
                $.Confirm("确认删除？", "", function () {
                    $oThis.parent().hide().attr("data-type", "2");
                });
            }
        });
        //分组设置保存
        $("#group-set-save").on('click', function () {
            var liI = $("#group-set ul").children("li");
            var dataJson = "";
            var editData = "";
            var typeVal = "";
            for (var i = 0; i < liI.length; i++) {
                var inputNum = liI.eq(i).find("input[type=text]").val();
                if ($.GetLength(inputNum) > 64) {
                    $.Alert('请输入小于64个字母或32个汉字的名称');
                    return
                }
                var orders = liI.eq(i).index() + 1;
                if (liI.eq(i).data("type") !== "") {
                    typeVal = liI.eq(i).data("type");
                } else {
                    typeVal = 3;
                }
                if (inputNum == "" && liI.eq(i).css('display') !== 'none') {
                    alert("名称不能为空！");
                    return;
                }
                var dataLi = '{"key":"' + liI.eq(i).data("id") + '","value":"' + inputNum + '","type":"' + typeVal + '","valueI":"' + orders + '"}' + ',';
                if (inputNum == "") {
                    dataLi = '';
                } else {
                    dataJson += dataLi;
                }
            }
            dataJson = dataJson.substr(0, dataJson.length - 1);
            editData = '{"keyValueTypes":[' + dataJson + ']}';
            $.ajax({
                url: Base.sitUrl + "/api/org/v1/org/staff/customer/group/edit",
                dataType: "json",
                type: "POST",
                data: {
                    data: editData
                },
                success: function (result) {
                    if (!result.success) {
                        alert(result.message);
                        return;
                    }

                    $.Alert("保存成功！");
                    groupRe();
                }
            });
        });

        //客户分组排序可拖动
        $(".resource-ul").sortable();

        function publicRe() {
            $.ajax({
                url: Base.sitUrl + "/api/org/v1/org/staff/settinghighseas/list",
                dataType: "json",
                type: "POST",
                success: function (result) {
                    if (!result.success) {
                        alert(result.message);
                        return;
                    }

                    var data = result.data;
                    $("#client-public").attr("data-id", data.id);
                    $("#daysNoCC").val(data.conditionI);
                    $("#daysNoCh").val(data.conditionII);
                    $("#clientEachDay").val(data.dayUpperLimit);
                }
            });
        }

        var screenObj = {//筛选条件
            conditions: []
        }, chiocedIds = [];

        //切换公海私海
        $('#check-sea').change(function () {
            if ($(this).val() == 1) {//公海
                $('#follower').attr('disabled', 'disabled');
                screenObj.highSeas = 1;
                delete screenObj.followUpUser;
            } else {
                $('#follower').removeAttr('disabled');
                screenObj.highSeas = 0;
            }
        });

        //切换跟进人
        $('#follower').change(function () {
            screenObj.followUpUser = $(this).val();
        });

        //控制全选星级
        $('#inlineCheckbox').change(function () {
            if ($(this).is(':checked')) {
                $('input[name=checkstar]').prop('checked', true).parent().addClass('checked');
                screenObj.starLevels = [1, 2, 3, 4, 5];
            } else {
                $('input[name=checkstar]').prop('checked', false).parent().removeClass('checked');
                delete screenObj.starLevels;
            }
        });

        //勾选星级
        $('input[name=checkstar]').change(function () {
            if ($(this).is(':checked')) {
                if ('starLevels' in screenObj) {//已经有这个属性
                    screenObj.starLevels.push($(this).val());
                } else {
                    screenObj.starLevels = [$(this).val()];
                }
            } else {
                (screenObj.starLevels).remove($(this).val());
                if ((screenObj.starLevels) <= 0) {
                    delete screenObj.starLevels;
                }
            }
        });

        //客户分组
        $('#group-list').change(function () {
            if ($(this).val() == 0)
                delete screenObj.customerGroupId;
            else
                screenObj.customerGroupId = $(this).val();
        });

        //最近联系时间
        $('#lastest').change(function () {
            if ($(this).val() == 0)
                delete screenObj.latestContactDays;
            else
                screenObj.latestContactDays = $(this).val();
        });

        //客户来源
        $('#source-list').change(function () {
            var $this = $(this),
                hasConditions = screenObj.conditions;

            var hasSource = false,
                sourceIdx;//source条件下标
            for (var i = 0; i < hasConditions.length; i++) {
                if (hasConditions[i].filedName == 'customerSource') {
                    sourceIdx = i;
                    hasSource = true;
                    break;
                }
            }
            if (hasSource) {//选择过source
                if ($this.val() == 0) {
                    hasConditions.splice(sourceIdx, 1);
                } else {
                    hasConditions[sourceIdx].filedValue = $this.val();
                }
            } else {//没有选择过source
                if ($this.val() != 0) {
                    var condition = {"filedName": "customerSource", "operateType": "=", "filedValue": $this.val()};
                    hasConditions.push(condition);
                }
            }
        });

        //客户状态
        $('#status-list').change(function () {
            var $this = $(this),
                hasConditions = screenObj.conditions;

            var hasSource = false,
                sourceIdx;//status条件下标
            for (var i = 0; i < hasConditions.length; i++) {
                if (hasConditions[i].filedName == 'status') {
                    sourceIdx = i;
                    hasSource = true;
                    break;
                }
            }
            if (hasSource) {//选择过status
                if ($this.val() == 0) {
                    hasConditions.splice(sourceIdx, 1);
                } else {
                    hasConditions[sourceIdx].filedValue = $this.val();
                }
            } else {//没有选择过source
                if ($this.val() != 0) {
                    var condition = {"filedName": "status", "operateType": "=", "filedValue": $this.val()};
                    hasConditions.push(condition);
                }
            }
        });

        //客户国家
        $('#countries').change(function () {
            var $this = $(this),
                hasConditions = screenObj.conditions;

            var hasSource = false,
                sourceIdx;//countries条件下标
            for (var i = 0; i < hasConditions.length; i++) {
                if (hasConditions[i].filedName == 'countries') {
                    sourceIdx = i;
                    hasSource = true;
                    break;
                }
            }
            if (hasSource) {//选择过countries
                if ($this.val() == 0) {
                    hasConditions.splice(sourceIdx, 1);
                } else {
                    hasConditions[sourceIdx].filedValue = $this.val();
                }
            } else {//没有选择过countries
                if ($this.val() != 0) {
                    var condition = {"filedName": "countries", "operateType": "=", "filedValue": $this.val()};
                    hasConditions.push(condition);
                }
            }
        });

        //创建时间
        $('#createTime').change(function () {
            screenObj.createTime = $(this).val();
        });

        //客户类型
        $('#type-list').change(function () {
            if ($(this).val() == 0) {
                delete screenObj.customerType;
            } else {
                screenObj.customerType = $(this).val();
            }
        });

        //主营产品
        function choiceType(_select){
            if(_select.val() != 0){
                function forType(_category) {
                    for(var item in _category){
                        if(_select.val()=== item){//已经找到当前的type
                            _select.nextAll('select').remove();
                            if(_category[item].sub != undefined){
                                var productTypeSelect = $('<select class="form-control"></select>');//产品品类列表
                                var productTypeList = '<option value="0">请选择</option>';
                                for (var item1 in _category[item].sub) {
                                    productTypeList += '<option value="' + item1 + '">' + _category[item].sub[item1].cn_name + '</option>';
                                }
                                productTypeSelect.on('change', function () {
                                    choiceType(productTypeSelect);
                                });
                                _select.after(productTypeSelect.append(productTypeList));
                            }

                            break;
                        }else {
                            if(_category[item].sub != undefined){
                                forType(_category[item].sub);
                            }
                        }
                    }
                }
                forType(category);
                screenObj.productType = _select.val();//不管选择的是什么，都会把过滤条件设置为最后一个正常的值
            }else{
                _select.nextAll('select').remove();
            }
        }

        //客户筛选
        $('#btn-screen').click(function (e) {
            $.EventFn(e);
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/customer/backstage/list/query',
                data: {
                    data: JSON.stringify(screenObj)
                },
                type: 'POST',
                dataType: 'json',
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
                    var page = data.length;
                    if (data.length > 0) {
                        $('.result-amount span').text(page);
                        var custList = '';
                        for (var i = 0; i < data.length; i++) {
                            custList += '<li>' + data[i].name + '</li>';
                            chiocedIds.push(data[i].id);
                        }
                        $('#customerModal .customer-list').empty().append(custList);
                    } else {
                        $('.result-amount span').text(page);
                        chiocedIds = [];
                        $('#customerModal .customer-list').empty().append('<li>没有客户列表</li>');
                    }
                }
            });

        });

        //一键筛选
        $('.btn-onekey-output').click(function () {
            if (chiocedIds <= 0) {
                $.Alert('请先筛选客户！');
            } else {
                $.ajax({//先点一键导出
                    url: Base.sitUrl + '/api/customer/v1/export/backstage',
                    data: {
                        data: JSON.stringify({ids: chiocedIds.join(',')})
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                    }
                });
                setTimeout(function () {
                    $.ajax({//先点一键导出
                        url: Base.sitUrl + '/api/customer/v1/export/list',
                        dataType: 'json',
                        success: function (res) {
                            if (!res.success) {
                                $.unLogin(res);
                                return;
                            }
                            var outputList = res.data.results,
                                html = '';
                            for (var i = 0; i < outputList.length; i++) {
                                outputList[i].statusText = outputList[i].status == 1 ? '导出中' : '完成';
                                var btnOutput = outputList[i].status == 1 ? '' : '<a class="btn-output" href="http://' + outputList[i].url + '">导出</a>';
                                html += '<tr><td>' + outputList[i].name + '</td>\
                                            <td>' + outputList[i].exportNum + '</td>\
                                            <td>' + outputList[i].createTime + '</td>\
                                            <td>' + outputList[i].statusText + '</td>\
                                            <td>' + btnOutput + '</td></tr>';
                            }
                            $('.cust-list').show();
                            $('#output-list tbody').empty().append(html);
                        }
                    });
                }, 1000);
            }
        });

        //跟进人列表
        function getFollower() {
            $.ajax({
                url: Base.sitUrl + '/api/org/v1/org/staff/list',
                type: 'POST',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var list = res.data,
                        html = '';
                    if (list.length > 0) {
                        for (var i = 0; i < list.length; i++) {
                            var name = list[i].name || '匿名';
                            if (name.length > 13) {
                                name = name.slice(0, 10) + '...';
                            }
                            html += '<option value="' + list[i].id + '">' + name + '</option>';
                        }
                    }
                    $('#follower').append(html);
                }
            });
        }

        //客户分组列表
        function getGroupList() {
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/customer/group/list',
                type: 'POST',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var data = res.data,
                        html = '';
                    for (var i = 0; i < data.length; i++) {
                        html += '<option value="' + data[i].id + '">' + data[i].name + '</option>';
                    }
                    $('#group-list').append(html);
                }
            });
        }

        //客户来源
        function sourceClient() {
            $.ajax({
                url: Base.sitUrl + '/api/org/v1/org/staff/customer/source/list',
                type: 'POST',
                async: false,
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var data = res.data,
                        html = '';
                    for (var i = 0; i < data.length; i++) {
                        html += '<option value="' + data[i].id + '">' + data[i].name + '</option>';
                    }
                    $('#source-list').append(html);
                }
            });
        }

        //客户状态列表
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
                    var data = res.data,
                        html = '';
                    for (var i = 0; i < data.length; i++) {
                        html += '<option value="' + data[i].id + '">' + data[i].name + '</option>';
                    }
                    $('#status-list').append(html);
                }
            })
        }

        //获取客户类型列表
        function clientType() {
            $.ajax({
                url: Base.sitUrl + '/api/sys/v1/sys/dictionary/get',
                type: 'POST',
                data: {'group': 'customer.type'},
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var data = res.data,
                        html = '';
                    for (var i = 0; i < data.length; i++) {
                        html += '<option value="' + data[i].id + '">' + data[i].value + '</option>';
                    }
                    $('#type-list').append(html);
                }
            })
        }

        getFollower();//跟进人列表
        getGroupList();//客户分组列表
        sourceClient();//客户来源列表
        statusList();//客户状态列表
        clientType();//客户类型列表
        var data = countries,//国家列表
            countriesList = '';
        for (var i = 0; i < data.length; i++) {
            countriesList += '<option value="' + data[i].id + '">' + data[i].cn + '</option>';
        }
        $('#countries').append(countriesList);

        var productTypeSelect = $('<select class="form-control"></select>');//产品品类列表
        var productTypeList = '<option value="0">请选择</option>';
        for (var item in category) {
            productTypeList += '<option value="' + item + '">' + category[item].cn_name + '</option>';
        }
        productTypeSelect.on('change', function () {
            choiceType(productTypeSelect);
        });
        $('#product-type').append(productTypeSelect.append(productTypeList));

        //客户公海.修改
        $("#client-public-save").on('click', function () {
            var liI = $("#client-public").find("input[type=text]");
            var dataJson = "";
            var editData = "";
            var typeVal = "";
            var inputNum1 = $("#daysNoCC").val();
            var inputNum2 = $("#daysNoCh").val();
            var inputNum3 = $("#clientEachDay").val();
            for (var i = 0; i < liI.length; i++) {
                var inputNum = liI.eq(i).val();
                if (liI.eq(i).data("type") !== "") {
                    typeVal = liI.eq(i).data("type");
                } else {
                    typeVal = 3;
                }
                if (isNaN(inputNum)) {
                    $.Alert("请填写数字！");
                    liI.eq(i).css("border", "1px solid red");
                    return;
                }
            }
            dataJson += '","valueI":"' + inputNum1 + '","valueII":"' + inputNum2 + '","valueVI":"' + inputNum3 + '","type":"' + typeVal + '"}' + ',';
            dataJson = dataJson.substr(0, dataJson.length - 1);
            editData = '{"keyValueType":' + '{"key":"' + $("#client-public").data("id") + '","value":"1' + dataJson + '}';
            $.ajax({
                url: Base.sitUrl + "/api/org/v1/org/staff/settinghighseas/edit",
                dataType: "json",
                type: "POST",
                data: {
                    data: editData
                },
                success: function (result) {
                    if (!result.success) {
                        alert(result.message);
                        return;
                    }

                    $.Alert("保存成功！");
                    publicRe();
                }
            });
        });

        //分组列表
        groupRe();
        $.ajax({//导出列表
            url: Base.sitUrl + '/api/customer/v1/export/list',
            dataType: 'json',
            success: function (res) {
                if (!res.success) {
                    $.unLogin(res);
                    return;
                }
                var outputList = res.data.results,
                    html = '';
                for (var i = 0; i < outputList.length; i++) {
                    outputList[i].statusText = outputList[i].status == 1 ? '导出中' : '完成';
                    var btnOutput = outputList[i].status == 1 ? '' : '<a class="btn-output" href="http://' + outputList[i].url + '">导出</a>';
                    html += '<tr><td>' + outputList[i].name + '</td>\
                                            <td>' + outputList[i].exportNum + '</td>\
                                            <td>' + outputList[i].createTime + '</td>\
                                            <td>' + outputList[i].statusText + '</td>\
                                            <td>' + btnOutput + '</td></tr>';
                }
                $('.cust-list').show();
                $('#output-list tbody').empty().append(html);
            }
        });
    });
});
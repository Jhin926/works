require(['common'], function () {
    require(['maintab', 'blockUI', 'jqueryUI', 'evol', 'datetimepickerCN'], function (maintab) {
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
    });
});
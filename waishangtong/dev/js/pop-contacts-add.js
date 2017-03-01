/* !
 *  用于新建客户
 */
require([ 'common', 'countries'], function () {
    require([ 'blockUI', 'jqform', 'datetimepickerCN'], function () {
        if (jQuery().datetimepicker) {
            $('.datetime-picker').datetimepicker({
                format: "yyyy-mm-dd",
                todayBtn: true,
                language: "zh-CN",
                // startDate: new Date(),
                pickerPosition: "bottom-right",
                autoclose: true,
                minView: "month"
            });
        }
        function getDefinedAttr() {
            $.ajax({
                url: Base.sitUrl + "/api/org/v1/org/staff/defined/attribute/list",
                data: {data: JSON.stringify({'bizType': 2})},
                dataType: "json",
                type: "GET",
                success: function (result) {
                    if (!result.success) {
                        alert(result.message);
                        return;
                    }
                    var data = result.data;
                    var addIndex = 1;
                    for (var i = 0; i < data.length; i++) {
                        var dataDet = data[i];
                        var addList = '';

                        if (dataDet.removable == 1) {//新增字段
                            if (dataDet.required == 1) {//必填项
                                addList = '<div class="form-groups c-add-list" data-isRequired="yes"><label for="c-add' + addIndex + '"><i>*</i>' + dataDet.name + '</label>\
                                <div class="form-input"><input type="text" name="c-add' + addIndex + '" data-id="' + dataDet.id + '" data-code="' + dataDet.code + '" id="c-add' + addIndex + '" class="input-style"></div><div class="clear"></div></div>';
                            } else {
                                addList = '<div class="form-groups c-add-list" data-isRequired="no"><label for="c-add' + addIndex + '">' + dataDet.name + '</label>\
                                <div class="form-input"><input type="text" name="c-add' + addIndex + '" data-id="' + dataDet.id + '" data-code="' + dataDet.code + '" id="c-add' + addIndex + '" class="input-style"></div><div class="clear"></div></div>';
                            }
                            addIndex++;
                            $('#c-add').prepend(addList);
                        }
                    }
                    getContactById();
                }
            });
        }

        var $addForm = $('#addCustForm');
        var senderName = $.GetQueryString('name'),
            custId = $.GetQueryString('custId'),
            rId = $.GetQueryString('id'),
            addType = $.GetQueryString('type'),
            pIndex = $.GetQueryString('index');
        var countryId;
        //  星级效果
        $addForm.on('click', '.form-input>i', function (e) {
            var obj = $(this).parent().children('i');
            if ($(this).hasClass('s-unstar2')) {
                other.goodFn(obj, $(this).index());
            } else {
                other.nagativeFn(obj, $(this).index());
            }
        });
        var other = {
            index: 1,
            goodFn: function (obj, limit) {
                for (var i = 0; i < obj.length; i++) {
                    if (i > limit) {
                        return;
                    }
                    obj.eq(i).removeClass('s-unstar2').addClass('s-star3');
                }
            },
            nagativeFn: function (obj, limit) {
                for (var i = 0; i < obj.length; i++) {
                    if (i > limit) {
                        obj.eq(i).removeClass('s-star3').addClass('s-unstar2');
                    } else {
                        obj.eq(i).removeClass('s-unstar2').addClass('s-star3');
                    }
                }
            },
            mFn: function (obj) {
                var $field = obj;
                for (var i = 0; i < $field.length; i++) {
                    if ((i + 1) % 2 == 0) {
                        $field.eq(i).css('margin-right', 0);
                    }
                }
            }
        };

        //获取客户列表
        function clientList() {
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/customer/assign/list',
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
                        list += '<li data-id="' + data[i].id + '">' + data[i].name + '</li>'
                    }
                    $("#c-cust").empty().append(list);
                }
            });
        }

        //  客户联系人详情
        function getContactById() {
            if (rId != undefined) {
                $.ajax({
                    url: Base.sitUrl + '/api/customer/contacts/v1/contacts/detail',
                    data: {data: JSON.stringify({id: rId})},
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        $('#cust-add').text('保存');
                        var obj = res.data;
                        $('#c-name').val(obj.name || '');
                        $('#c-email').val(obj.email || '');
                        $('#c-company').val(obj.workingCompany || '');
                        $('#c-phone').val(obj.phone || '');
                        $('#c-facebook').val(obj.facebook || '');
                        $('#c-position').val(obj.position || '');
                        $('#c-twitter').val(obj.twitter || '');
                        $('#c-linkin').val(obj.linkedin || '');
                        $('#c-birthday').val(obj.birthday || '');
                        $('#c-remark').val(obj.remark || '');

                        //获取联系人自定义属性数据，并填入相应表格
                        var getDefineds = obj.contactDefinedValues;
                        if (getDefineds.length > 0) {
                            var getDefCont = $('#c-add');
                            for (var i = 0; i < getDefineds.length; i++) {
                                var getAttrId = getDefineds[i].attributeId;
                                var getInput = getDefCont.find('input[data-id=' + getAttrId + ']');
                                if (getInput.length > 0) {
                                    getInput.val(getDefineds[i].value);
                                }
                            }
                        }
                        countryId = obj.countries;

                        var _star = obj.starLevel, shtml = '<i class="s-updownBg s-star3"></i>';
                        for (var s = 1; s < _star; s++) {
                            shtml += '<i class="s-updownBg s-star3"></i>';
                        }
                        for (var s1 = 0; s1 < (5 - _star); s1++) {
                            shtml += '<i class="s-updownBg s-unstar2"></i>';
                        }
                        $('#c-stars').empty().append(shtml);
                    }
                });
            }
        }

        //  获取客户详情
        function getCustomerById() {
            if (custId != undefined) {
                $.ajax({
                    url: Base.sitUrl + '/api/customer/v1/customer/assign/list',
                    type: 'GET',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }

                        var list = res.data;
                        for (var i = 0; i < list.length; i++) {
                            if (custId == list[i].id) {
                                $('#c-company').val(list[i].name).attr('data-id', custId);
                                break;
                            }
                        }
                    }
                });
            }
        }
        //选择公司名称
        $("#c-company").on('input', function () {
            $("#c-cust").parent().show();
            var val = $(this).val();
            var valI = val.length;
            $(this).attr("data-id", "")
            var iLength = $("#c-cust").find('li').length;
            for (var i = 0; i < iLength; i++) {
                var textLi = $("#c-cust").find('li').eq(i).text();
                var valLi = textLi.substring(0, valI);
                if (valLi !== val) {
                    $("#c-cust").find('li').eq(i).hide();
                } else {
                    $("#c-cust").find('li').eq(i).show();
                }
            }
        })
        $(document).on('click', function (e) {
            $.EventFn(e);
            $("#c-cust").parent().hide();
        });
        $("#c-company").on('click', function (e) {
            $.EventFn(e);
            $("#c-cust").parent().show();
        });
        $(document).on('click', '#c-cust li', function (e) {
            $.EventFn(e);
            var id = $(this).attr("data-id");
            var val = $(this).text();
            $("#c-company").val(val);
            $("#c-company").attr("data-id", id);
            $("#c-cust").parent().hide();
        })
        //新建联系人.初始化
        function start() {
            $("#c-name").val("");
            $("#c-email").val(senderName);
            $("#c-phone").val("");
            $("#c-company").val("");
            $("#c-facebook").val("");
            $("#c-twitter").val("");
            $("#c-linkedIn").val("");
            $("#c-position").val("");
            $("#c-remark").val("");
            $("#c-birthday").val("");
            //获取所需列表
            //国家列表
            var data = countries,
                list = '<option value="">请选择国家</option>';
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == countryId) list += '<option selected value="' + data[i].id + '">' + data[i].cn + ' - ' + data[i].en + '</option>'
                else  list += '<option value="' + data[i].id + '">' + data[i].cn + ' - ' + data[i].en + '</option>'
            }
            $("#c-country").empty().append(list);

            clientList();//公司列表
            getDefinedAttr();
            getCustomerById();
        }

        start();
        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        $("#c-email").on('change', function () {
            var val = $(this).val();
            if (!reg.test(val)) {
                $(this).css("border", "1px solid red");
                $(this).parent().next(".errorEmail").css("display", "inline-block");
            } else {
                $(this).css("border", "1px solid #ccc");
                $(this).parent().next(".errorEmail").css("display", "none");
            }
        });
        var data = "";
        //获取页面填写信息
        function info() {
            var id = $("#c-company").attr("data-id");
            var name = $("#c-name").val();
            var email = $("#c-email").val();
            var phone = $("#c-phone").val();
            var company = $("#c-company").val();
            var facebook = $("#c-facebook").val();
            var twitter = $("#c-twitter").val();
            var linkedIn = $("#c-linkin").val();
            var position = $("#c-position").val();
            var remark = $("#c-remark").val();
            var starLevel = $("#c-stars").find(".s-star3").length;
            var country = $("#c-country").find("option:selected").val();
            var birthdayString = $("#c-birthday").val();
            var data = {};
            if (rId != undefined) {
                data.id = rId;
                data.setType = 'edit';
            }
            data.customerId = id;
            data.name = name;
            data.email = email;
            data.position = position;
            data.workingCompany = company;
            data.phone = phone;
            data.facebook = facebook;
            data.twitter = twitter;
            data.linkedIn = linkedIn;
            data.starLevel = parseInt(starLevel);
            data.remark = remark;
            data.countries = country;
            data.birthdayString = birthdayString;

            //获取自定义属性的值
            var getDefinedVals = [];
            for (var i = 0; i < $('#c-add input').length; i++) {
                if ($('#c-add input').eq(i).val() != '') {
                    var getDefinedVal = {};
                    getDefinedVal.attributeId = $('#c-add input').eq(i).attr('data-id');
                    getDefinedVal.code = $('#c-add input').eq(i).attr('data-code');
                    getDefinedVal.value = $('#c-add input').eq(i).val();
                    getDefinedVals.push(getDefinedVal);
                }
            }

            data.contactDefinedValues = getDefinedVals;

            data = JSON.stringify(data);
            return data;
        }

        //添加联系人
        $('#cust-add').on('click', function () {
            var data = info();
            var requireds = [];

            $('#addCustForm .form-groups').each(function () {
                if ($(this).attr('data-isRequired') == 'yes') {
                    requireds.push($(this));
                }
            });
            for (var i = 0; i < requireds.length; i++) {
                if (requireds[i].find('input:text').val() == '') {
                    $.Alert("请填写必填项");
                    return;
                }
            }

            if (rId != undefined) {
                $.ajax({
                    url: Base.sitUrl + '/api/customer/contacts/v1/contacts/set',
                    data: {data: data},
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return
                        }

                        var index = $('#mainTab', parent.document).find('currentClass').index();
                        parent.$.reHtml();
                        parent.me.closeOne(index);
                    }
                });
            } else {
                $.ajax({
                    url: Base.sitUrl + '/api/customer/contacts/v1/contacts/save',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        data: data
                    },
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        } else {
                            if (addType == 'customer') {//在客户详情里添加联系人
                                $.Alert("创建成功！", '', function () {
                                    var index = $('#mainTab', parent.document).find('.currentClass').index();
                                    parent.me.refresh2(pIndex);
                                    parent.me.closeOne(index);
                                });
                            } else {
                                $.Alert("创建成功！");
                                var index = $('#mainTab', parent.document).find('.currentClass').index();
                                parent.$.reHtml();
                                parent.me.closeOne(index);
                            }
                        }
                    }
                });
            }
        });
    });
});
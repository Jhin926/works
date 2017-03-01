/* !
 *  用于通讯录
 */
require([ 'common' ], function () {
    require(['maintab', 'blockUI', 'datetimepickerCN'], function (maintab) {
        maintab.init();
        var addressId = $.GetQueryString('id');
        var pIdx = Number($.GetQueryString('pIdx'));
        var hflx = $.GetQueryString('type');
        var emailNewName = $.GetQueryString('name');
        $("#emailgroup").find('input[type=email]').val(emailNewName)
        if (jQuery().datetimepicker) {
            $('#yourbirthday').datetimepicker({
                format: "yyyy-mm-dd",
                todayBtn: false,
                language: "zh-CN",
//                startDate: new Date(),
                pickerPosition: "bottom",
                autoclose: true,
                minView: "month"
            });
        }
        //添加新邮件
        $('#addnewemail').on('click', function (e) {
            $.EventFn(e);
            var html = '<li>\
                            <label class="col-sm-1">邮箱</label>\
                            <div class="col-sm-10">\
                            <div>\
                              <p class="col-sm-11"><input class="form-control youremail" type="email" placeholder="请输入您的邮箱"></p>\
                              <p class="" style="cursor:pointer"><i class="delet-icon"></i></p>\
                            </div></div>\
                            <div class="clear"></div>\
                        </li>';
            $('#emailgroup').append(html);
        });
        //删除邮件/电话
        $('#emailgroup,#tellgroup').on('click', '.delet-icon', function (e) {
            $.EventFn(e);
            var thisli = $(this).parents('div.col-sm-10').parent('li');
            thisli.remove();
        });
        //添加新电话
        $('#addnewtell').on('click', function (e) {
            $.EventFn(e);
            var html = '<li>\
                            <label class="col-sm-1">电话</label>\
                            <div class="col-sm-10">\
                                <div><p class="col-sm-11"><input class="form-control yourphone" placeholder="请输入电话号码"></p>\
                                     <p class="" style="cursor:pointer"><i class="delet-icon"></i></p>\
                                </div></div>\
                            <div class="clear"></div></li>';
            $('#tellgroup').append(html);
        });
        var emailReg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        $('.youremail').on('change', function () {
            var email = $(this).val();
            if (!emailReg.test(email)) {
                $.Alert('邮箱格式有误');
                return;
            }
        });
        //新建
        $('#newaddress').on('click', function (e) {
            $.EventFn(e);
            var flag = true;
            var elist = $('#emailgroup').children('li');
            var tlist = $('#tellgroup').children('li');
            var email = '';
            var phone = '';
            for (var i = 0; i < elist.length; i++) {
                email += elist.eq(i).find('.youremail').val() + ';';
            }
            for (var j = 0; j < tlist.length; j++) {
                phone += tlist.eq(j).find('.yourphone').val() + ';';
            }

            var obj = {
                birthdayString: $('#yourbirthday').val(),
                remark: $('#yourbeizhu').val(),
                company: $('#company').val()
            }
            if ($('#yourname').val() != null && $('#yourname').val() != '') {
                obj.name = $('#yourname').val();
            }
            flag = $.errorsFn($('#yourname'), "请输入姓名！");
            email = email.substring(0, email.length - 1);
            if (email != null && email != '') {
                obj.email = email;
            } else {
                alert("请输入邮箱！");
                flag = false;
            }
            obj.phone = phone.substring(0, phone.length - 1);
            if (flag) {
                if (hflx) {
                    newAddressObj.editStatistics(addressId, obj.name, obj.email, obj.company, obj.phone, obj.birthdayString, obj.remark);
                } else {
                    newAddressObj.newAddress(obj.name, obj.email, obj.company, obj.phone, obj.birthdayString, obj.remark);
                }
            }
        });

        var newAddressObj = {
            newAddress: function (name, email, company, phone, birthdayString, remark) {   //新建通讯录
                var data = {
                    name: name,
                    email: email,
                    company: company,
                    phone: phone,
                    birthdayString: birthdayString,
                    remark: remark
                };
                $.ajax({
                    url: Base.sitUrl + '/api/addressList/v1/email/address/save',
                    data: {
                        data: JSON.stringify(data)
                    },
                    type: 'POST',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        $.DestroyPopInPop();
                        parent.location.reload();
                    }
                });
            },
            editStatistics: function (id, name, email, company, phone, birthdayString, remark) {     //编辑通讯录
                var data = {
                    id: id,
                    name: name,
                    email: email,
                    company: company,
                    phone: phone,
                    birthdayString: birthdayString,
                    remark: remark
                };
                $.ajax({
                    url: Base.sitUrl + '/api/addressList/v1/email/address/edit',
                    data: {
                        data: JSON.stringify(data)
                    },
                    type: 'POST',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        $.Alert("编辑成功！", '', function () {
                            var index = $('#mainTab', parent.document).find('.currentClass').index();

                            parent.me.refresh2(pIdx);
                            parent.me.closeOne(index);
                        });
                    }
                });
            },
            statistics: function () {
                var data = {
                    id: addressId
                };
                $.ajax({
                    url: Base.sitUrl + '/api/addressList/v1/email/address/detail',
                    data: {
                        data: JSON.stringify(data)
                    },
                    type: 'POST',
                    success: function (res, phone) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var data = res.data;
                        var email = data.email;
                        var phone = data.phone;
                        var html = '';
                        var html2 = '';
                        $('#yourname').val(data.name);
                        $('#yourbirthday').val(data.birthday);
                        $('#yourbeizhu').val(data.remark);
                        $('#yourphone').val(data.phone);
                        $('#company').val(data.company)
                        if (email.indexOf(';') != -1) {
                            tmp = email.split(';');
                            if (tmp.length > 1) {
                                for (var i = 1; i < tmp.length; i++) {
                                    html += '<li>\
                            <label class="col-sm-1">邮箱</label>\
                            <div class="col-sm-10">\
                            <div>\
                              <p class="col-sm-11"><input class="form-control youremail" type="email" value="' + tmp[i] + '"></p>\
                              <p class="col-sm-1"><i class="delet-icon"></i></p>\
                            </div></div>\
                            <div class="clear"></div>\
                        </li>';
                                }
                                $('#emailgroup>li:first-child>div>.youremail').val(tmp[0])
                            }
                        } else {
                            $('#emailgroup>li:first-child>div>.youremail').val(email)
                        }
                        $('#emailgroup').append(html);
                        if (phone != null && phone != '') {
                            if (phone.indexOf(';') != -1) {
                                tmp2 = phone.split(';');
                                if (tmp2.length > 1) {
                                    for (var j = 1; j < tmp2.length; j++) {
                                        html2 += '<li>\
                            <label class="col-sm-1">电话</label>\
                            <div class="col-sm-10">\
                                <div><p class="col-sm-11"><input class="form-control yourphone" value="' + tmp2[j] + '"></p>\
                                     <p class="col-sm-1"><i class="delet-icon"></i></p>\
                                </div></div>\
                            <div class="clear"></div></li>';
                                    }
                                    console.log(tmp[0]);
                                    $('#tellgroup>li:first-child>div>.yourphone').val(tmp2[0])
                                }
                            }
                        } else {
                            $('#tellgroup>li:first-child>div>.yourphone').val(phone)
                        }
                        $('#tellgroup').append(html2);
                    }
                });
            }
        };
        if (hflx) {
            //newAddressObj.editStatistics();
            newAddressObj.statistics();
        }
    });
});
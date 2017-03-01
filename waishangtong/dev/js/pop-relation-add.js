/* !
 *  用于CRM联系人设置
 */
require([ 'common' ], function () {
    require(['maintab', 'blockUI', 'jqform'], function (maintab) {
        var id = $.GetQueryString('id');

        // 右侧弹窗初始化
        maintab.init();


        //  新建联系人
        $('#con-add').on('click', function () {
            var data = addObj.currentData;
            var $name = $('#name'),
                $email = $('#email');
            data.headImgUrl = $('#headImg').attr('src');
            data.position = $('#position').val();
            data.name = $name.val();
            data.email = $('#email').val();
            data.cellphone = $('#phone').val();
            var html = '<div class="errors">\
                            <span></span>\
                        </div>';
            var flag = true;
            if ($name.val() == null || $name.val() == '') {
                if (!$name.hasClass('error')) {
                    $name.addClass('error');
                    $name.after(html);
                    $name.next('.errors').addClass('active');
                    $name.next('.errors').children('span').text('请输入昵称');
                }
                flag = false;
            } else {
                $name.removeClass('error');
                $name.next('.errors').removeClass('active');
            }
            if ($email.val() == null || $email.val() == '') {
                if (!$email.hasClass('error')) {
                    $email.addClass('error');
                    $email.after(html);
                    $email.next('.errors').addClass('active');
                    $email.next('.errors').children('span').text('请输入邮箱');
                }
                flag = false;
            } else {
                $email.removeClass('error');
                $email.next('.errors').removeClass('active');
            }

            var comId = $('#company').attr('data-id');
            if (comId) {
                data.customerId = comId;
            }
            if (flag) {
                console.log(data);
                addObj.saveRelatives(data);
            }
        });

        //  上传图片
        $('input[name=upfile]').on('change', function () {
            var file = $(this).val();
            var allows = ['jpg', 'gif', 'bmp', 'png', 'jpeg'];
            var suffix = (file.substring(file.lastIndexOf('.') + 1)).toLocaleLowerCase();
            var $errors = $('.head-tools').nextAll('.errors');
            if (allows.indexOf(suffix) == -1) {
                $errors.addClass('active');
            } else {
                $errors.removeClass('active');
                var filesize = this.files[0].size;
                if (filesize > 1 * 1024 * 1024) {
                    $errors.addClass('active');
                    $errors.children('span').text('图片不能大于1MB');
                    return;
                }
                addObj.uploadImg();
            }
        });

        //  检测公司名称http://www.ttufo.com/ufo/201502/59335_13.html
        $('#company').on('click', function (e) {
            $.EventFn(e);
            $('.company-list').addClass('active');
        });
        $('#company').on('blur', function () {
            var $company = $('#company');
            if ($company.val() == null || $company.val() == '') {
                return;
            }
            addObj.getCheckCompany($company.val());
        });

        $('.company-list').on('click', '>li', function (e) {
            $.EventFn(e);
            var id = $(this).attr('data-id');
            $('#company').val($(this).text());
            $('#company').attr('data-id', id);
            $('.company-list').removeClass('active');
        });

        var addObj = {
            currentData: {},
            //  获取所有公司
            getAllCompany: function () {
                $.AjaxFun({
                    data: {
                        _mt: 'customer_getPageSimpleCustomersByBlock',
                        block: -1
                    },
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var list = res.data.result;
                        if (list.length > 0) {
                            var html = '', $list = $('.company-list');
                            for (var i = 0; i < list.length; i++) {
                                html += '<li data-id="' + list[i].id + '">' + list[i].name + '</li>';
                            }
                            $list.append(html);
                        }
                    }
                });
            },
            //  通过ID获取联系人
            getRelativesById: function (id) {
                $.AjaxFun({
                    data: {
                        _mt: 'relatives_getRelativesById',
                        id: id || -1
                    },
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        addObj.currentData = res.data;
                        var list = res.data;
                        var extra = list.customerExtraEntityList;
                        var html = '';
                        for (var i = 0; i < extra.length; i++) {
                            var tmp = '';
                            var requre = '';
                            var k = extra[i];
                            if (k.isNecessary == 1) {
                                requre = '<span class="active">*</span>';
                            }
                            html += '<div class="form-group">' +
                                '<label for="extra_' + i + '" class="col-xs-2 control-label">' + requre + k.resourceSettingName + '</label>' +
                                '<div class="col-xs-10">' +
                                '<input type="text" class="form-control" id="extra_' + i + '" />' +
                                '</div>' +
                                '</div>';
                        }
                        var inx = $('fieldset>.form-group').length;
                        $('fieldset>.form-group').eq(inx - 1).after(html);
                        if (id) {
                            var list = res.data;
                            $('#con-add').text('修改');
                            $('#headImg').attr('src', list.headImgUrl || '../images/user.jpg');
                            $('#name').val(list.name);
                            $('#position').val(list.position);
                            if (list.customerEntity && list.customerEntity.name) {
                                $('#company').val(list.customerEntity.name);
                                $('#remark').val(list.customerEntity.remark || '--');
                            }

                            $('#email').val(list.email);
                            $('#phone').val(list.cellphone);
                        }
                    }
                });
            },
            //  保存联系人
            saveRelatives: function (rEy) {
                $.AjaxFun({
                    data: {
                        _mt: 'relatives_saveRelatives',
                        relativesEntity: JSON.stringify(rEy)
                    },
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
            uploadImg: function () {
                $('#uploadImg form').ajaxForm({
                    url: Base.sitUrl + '/file/upload.jhtml',
                    beforeSend: function () {
                        $.BlockUI();
                    },
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var url = 'http://' + res.data;
                        $('#headImg').attr('src', url);
                        $.UnblockUI();
                    }
                }).submit();
            },
            getCheckCompany: function (name) {
                $.AjaxFun({
                    data: {
                        _mt: 'customer_checkCustomerIsExists',
                        customerId: -1,
                        customerName: name
                    },
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        if (!res.data) {
                            maintab.showOnAlikeTab('pop-customer-detail', Base.url + '/html/pop-customer-add.html?company=' + $('#company').val() + "&v=" + window.ver, '新建客户');
                        }
                    }
                });
            },
        };

        //  获取联系人
        addObj.getRelativesById(id);
        //  获取所有的公司
        addObj.getAllCompany();
    });
});

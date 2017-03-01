/* !
 *  用于个人设置页面
 */
require([ 'common' ], function () {
    require([ 'setpassword', 'jqform' ], function (setPsd) {

        var $content = $('.page-content'),
            $forms = $('.user-forms');

        $forms.on('click', 'button', function (e) {
            var type = $(this).attr('data-type'),
                $name = $forms.find('#name'),
                flag = true;
            if (type == 'user') {
                if ($.GetLength($name.val()) > 64) {
                    $.Alert('请输入小于64个字母或32个汉字的名称')
                    return
                }
                var data = {name: $name.val()};
                flag = $.errorsFn($name, $name.attr('data-msg'));
                if (flag) {
                    userObj.editUserInfo(data);
                }
            } else if (type == 'pwd') {
                var _old = $forms.find('#pwd-old'),
                    _new = $forms.find('#pwd-new'),
                    _re = $forms.find('#pwd-re'),
                    flag = true;
                flag = $.errorsFn(_old, _old.attr('data-msg'));
                flag = $.errorsFn(_new, _new.attr('data-msg'));
                flag = $.errorsFn(_re, _re.attr('data-msg'));
                flag = userObj.isAllowPwd(_new);
                flag = userObj.isAllowPwd(_re);
                if (flag) {
                    if (userObj.isPwdConsistent()) {
                        var data = {oldPassword: _old.val(), newPassword: _new.val(), newPasswordConfirm: _re.val()};
                        userObj.changePwd(data);
                    }
                }

            } else if (type == 'language') {
            }
        });
        $forms.on('blur', '.box-input>input', function (e) {
            if ($(this).attr('data-msg').length > 0) {
                $.errorsFn($(this), $(this).attr('data-msg'));
            }
        });
        //  tab切换
        $content.on('click', '.user-box>ul>li', function (e) {
            $.EventFn(e);

            if ($(this).hasClass('active')) {
                return false;
            }
            var $i = $(this).children('i'),
                index = $(this).index(),
                _c = $i.prop('class');
            $(this).addClass('active').siblings('li').removeClass('active');
            $content.find('.user-box>ul>li').each(function () {
                var _i = $(this).children('i'),
                    _class = _i.prop('class');
                if (_class.indexOf('2') != -1) {
                    _class = _class.substr(0, _class.length - 1);
                }
                _i.prop('class', _class);
            });
            if (_c.indexOf(2) == -1) {
                $i.prop('class', _c + '2');
            }
            $forms.find('.errors').remove();
            $forms.find('.box-input>input.error').each(function () {
                $(this).removeClass('error');
            });
            $forms.find('.box-form').eq(index).addClass('active').siblings('.box-form').removeClass('active');
        });

        $forms.on('change', '.set-style>ul>li>input', function () {
            var _checked = $(this).prop('checked'),
                _id = parseInt($(this).attr('data-id')),
                _val = parseInt($(this).val()), data = {subscribeId: _val};
            if (_checked) {
                userObj.setSubscribe(data, 'add');
            } else {
                data.id = _id;
                userObj.setSubscribe(data, 'del');
            }
        });
        var _width = $forms.width() - $('.form-info>label').width();
        $forms.find('.box-input').width(_width);
        $(window).resize(function () {
            var _width = $forms.width() - $('.form-info>label').width() - 20;
            $forms.find('.box-input').width(_width);
        });

        var userObj = {
            checkboxList: [
                {id: 'c1', val: '1001', info: '别人给我分配了任务'},
                {id: 'c2', val: '1002', info: '客户发送了新邮件'},
                {id: 'c3', val: '1003', info: '任务超时'},
                {id: 'c4', val: '1004', info: '公海客户有了新邮件'}
            ],
            initCheckbox: function () {
                var list = userObj.checkboxList, html = '';
                for (var i = 0; i < list.length; i++) {
                    html += '<li>\
                                <input type="checkbox" name="set-warn" id="' + list[i].id + '" value="' + list[i].val + '" />\
                                <label for="' + list[i].id + '">' + list[i].info + '</label>\
                            </li>';
                }
                $forms.find('.set-style>ul').append(html);
            },
            //  基本信息-查询
            getUserInfo: function () {
                $.ajax({
                    url: Base.sitUrl + '/api/org/v1/org/user/person/info',
                    data: {data: JSON.stringify({})},
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res, '获取基本信息失败，');
                            return false;
                        }
                        var obj = res.data;
                        $forms.find('#name').val(obj.name || '匿名');
                        $forms.find('#department').val(obj.departmentName || '默认部门');
                        $forms.find('#email').val(obj.email || '未设置');
                        $forms.find('#role').val(obj.roleName || '默认角色');
                    }
                });
            },
            //  编辑基本信息
            editUserInfo: function (obj) {

                $.ajax({
                    url: Base.sitUrl + '/api/org/v1/org/user/person/info/edit',
                    data: {data: JSON.stringify(obj)},
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res, '编辑基本信息失败，');
                            return false;
                        }

                        $.Alert('编辑成功!');
                    }
                });
            },
            //  修改密码
            changePwd: function (obj) {

                $.ajax({
                    url: Base.sitUrl + '/api/org/v1/org/user/password/change',
                    data: {data: JSON.stringify(obj)},
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res, '修改密码失败，');
                            return false;
                        }
                        $forms.find('form').eq(1)[0].reset();
                        $.Alert('修改成功!');
                    }
                });
            },
            //  查询用户订阅信息
            getSubscribeInfo: function () {

                $.ajax({
                    url: Base.sitUrl + '/api/org/v1/org/user/subscribe/list',
                    data: {data: JSON.stringify({})},
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res, '查询用户订阅信息失败，');
                            return false;
                        }

                        var list = res.data;
                        if (list.length > 0) {
                            $forms.find('.set-style>ul>li').each(function () {
                                var $input = $(this).find('input');
                                for (var i = 0; i < list.length; i++) {
                                    if ($input.val() == list[i].subscribeId) {
                                        $input.attr('checked', true);
                                        $input.attr('data-id', list[i].id);
                                        break;
                                    }
                                }
                            });
                        }
                    }
                });
            },
            //  订阅操作
            setSubscribe: function (obj, type) {

                var url = Base.sitUrl;
                if (type == 'add') {
                    url += '/api/org/v1/org/user/subscribe/add';
                } else {
                    url += '/api/org/v1/org/user/subscribe/sub';
                }
                $.ajax({
                    url: url,
                    data: {data: JSON.stringify(obj)},
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res, '设置失败，');
                            return false;
                        }
                        $.Alert('设置成功!');
                    }
                });
            },
            //  密码一致
            isPwdConsistent: function () {
                var flag = true,
                    _new = $forms.find('#pwd-new'),
                    _re = $forms.find('#pwd-re');
                if (_new.val() != _re.val()) {
                    if (_re.next('.errors').length == 0) {
                        _re.after('<div class="errors active"><span></span></div>');
                    }
                    _re.addClass('error');
                    _re.next('.errors').addClass('active').children('span').text('密码不一致');
                    flag = false;
                }
                return flag;
            },
            //  密码至少为6位
            isAllowPwd: function (obj) {
                var flag = true,
                    _v = obj.val();
                if (_v.length < 6) {
                    if (obj.next('.errors').length == 0) {
                        obj.after('<div class="errors active"><span></span></div>');
                    }
                    obj.addClass('error');
                    obj.next('.errors').addClass('active').children('span').text('密码至少为6位');
                    flag = false;
                }
                return flag;
            }
        };
        userObj.initCheckbox();
        userObj.getUserInfo();
        userObj.getSubscribeInfo();
    });
});

/*！
 * @description: 用于登录、注册、忘记密码等相关模块
 */
require(['common'], function () {
    /*
     * @validationLang: jquery.validation表单校验
     * @cookiehandle: cookie的存取和删除
     * @rsa: 密码加密
     * @uniform: 表单美化，主要用于单选多选
     */
    require(['validationLang', 'cookiehandle', 'setpassword', 'rsa' ], function (validate, cookiehandle, setPsd) {

        var $loginBtn = $('#loginBtn'),
            $form = $('#loginFrom'),
            $name = $form.find('[name="username"]'),
            $password = $form.find('[name="password"]'),
            $rememberme = $('#rememberme');

        $name.val('i-zhanggt@foxmail.com');

        // ajax自定义提交表单绑定
        $form.validate();
        var $kaptchaImage = $('#kaptchaImage'),
            $changeCodeBtn = $('.changeCode');
        $changeCodeBtn.click(function () {//生成验证码
            $kaptchaImage.hide().attr('src', Base.url + '/security/getKaptchaImage.jhtml?' + Math.floor(Math.random() * 100)).fadeIn();
            event.cancelBubble = true;
        });

        // 发送短信验证码
        var $sendCodeWrap = $('#sendCodeWrap'),
            $sendCodeTips = $sendCodeWrap.find('.code-tips>b'),
            $imgcode = $('[name="imgcode"]'),
            $gpForm = $('#getPasswordForm'),
            $gpName = $gpForm.find('[name="username"]'),
            $gpSendCode = $gpForm.find('[name="sendcode"]');

        // 发送验证码929296
        function sendCode(content, type) {
            $.AjaxFun({
                data: {
                    _mt: 'userSecurity_sendMsgCode',
                    content: content,
                    dictMsgCodeType: type
                },
                success: function (result) {
                    if (!result.success) $.Alert(result.message);
                }
            });
        }

        $sendCodeWrap.on('click', 'button.btn', function () {
            // 倒计时
            var type = $(this).data('type'),
                codeType = 0,
                name = $.trim($(this).closest('form').find('[name="username"]').val()),
                phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
            if (type == 'find') {
                codeType = ( phoneReg.test(name) ) ? 2 : 3;
            } else if (type == 'register') {
                codeType = ( phoneReg.test(name) ) ? 0 : 1;
            }

            time($(this), $sendCodeTips);
            sendCode(name, codeType);
            return false;
        });

        // 重新获取验证码
        var wait = 60;

        function time($o, $tips) {
            if (wait == 0) {
                $o.prop("disabled", false);
                $tips.removeClass('active').text(60);
                wait = 60;
            } else {
                $o.prop("disabled", true);
                $tips.addClass('active').text(wait);
                wait--;
                setTimeout(function () {
                        time($o, $tips);
                    },
                    1000);
            }
        };
        // 忘记密码提交
        $gpForm.validate({
            errorPlacement: function (error, element) {
                error.appendTo(element.closest(".form-main"));
            }
        });
        $gpForm.on('click', 'button:submit', function () {
            if ($gpForm.valid()) {
                $.AjaxFun({
                    data: {
                        _mt: 'user_forgetPasswordByFind',
                        username: $.trim($gpName.val()),
                        kaptcha: $.trim($imgcode.val()),
                        verifCode: $.trim($gpSendCode.val())
                    },
                    success: function (result) {
                        if (!result.success) {
                            $.Alert(result.message);
                        } else {
                            localStorage.verifCode = $.trim($gpSendCode.val());
                            localStorage.username = $.trim($gpName.val());
                            location.href = Base.url + '/html/setpassword.html' + "?&v=" + window.ver;
                        }
                        ;
                    }
                });
            }
            ;
            return false;
        });

        // 修改密码
        var currentName = localStorage.username || '未知用户';
        $('.data-accout').text(currentName);
        var $spForm = $('#setPsdFrom'),
            $newPsd = $('#setPsdFrom').find('[name="newpsd"]'),
            $reNewPsd = $('#setPsdFrom').find('[name="renewpsd"]'),
            $setPsdBtn = $('#setPsdBtn');

        // 绑定jquery validate
        $spForm.validate();


        // 登录开始
        $loginBtn.on('click', function () {
            var $this = $form,
                $btn = $(this);
            //读取cookie中的token
            if ($this.attr("method") != null && $this.attr("method").toLowerCase() == "post" && $this.find("input[name='token']").size() == 0) {
                var token = cookiehandle.getCookie("token");
                if (token != null) {
                    $this.append('<input type="hidden" name="token" value="' + token + '" \/>');
                }
            }
            if ($form.valid()) {	// 判断是否通过校验
                // 登录状态
                $btn.prop('disabled', true).text('登录中...');
                // 发送请求获取登录的key
                $.ajax({
                    url: Base.sitUrl + '/api/user/v1/login',
                    type: "POST",
                    data: {
                        email: $.trim($name.val()),
                        password: $password.val()
                    },
                    cache: false,
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            $btn.prop('disabled', false).text('登录');
                            return;
                        }
                        var obj = res.data;
                        localStorage.setItem('__userInfo', obj.name + ';' + obj.id + ';' + obj.isMaster);
                        location.href = Base.builtUrl + '/main.html';
                    }
                });
            }

            return false;
        });

        // 注册开始
        var $regForm = $('#registerFrom'),
            $regUsername = $regForm.find('[name="username"]'),
            $regImgcode = $regForm.find('[name="imgcode"]'),
            $regSendcode = $regForm.find('[name="sendcode"]'),
            $regNewPsd = $regForm.find('[name="newpsd"]'),
            $regRenewpsd = $regForm.find('[name="renewpsd"]'),
            $regBtn = $regForm.find('button:submit');
        // 绑定jquery validate
        $regForm.validate({
            errorPlacement: function (error, element) {
                error.appendTo(element.closest(".form-main"));
            }
        });
        // 提交事件534184
        $regBtn.on('click', function () {
            var $this = $(this),
                newPwd = $.trim($regNewPsd.val()),
                reNewPwd = $.trim($regRenewpsd.val());

            if ($regForm.valid()) {  // 判断是否通过校验300956
                $setPsdBtn.prop('disabled', true).text('正在提交...');
                // 请求加密
                $.ajax({
                    url: Base.sitUrl + "/security/public_key.jhtml",
                    type: "GET",
                    dataType: "json",
                    cache: false,
                    success: function (keyResult) {
                        var rsaKey = new RSAKey();
                        rsaKey.setPublic(b64tohex(keyResult.data.modulus), b64tohex(keyResult.data.exponent));
                        var enNewPwd = hex2b64(rsaKey.encrypt(newPwd)),
                            enReNewPwd = hex2b64(rsaKey.encrypt(reNewPwd));
                        // 提交加密后的信息
                        $.ajax({
                            url: Base.reqUrl,
                            type: "POST",
                            data: {
                                _mt: 'user_userRegister',
                                username: $.trim($regUsername.val()),
                                password: enNewPwd,
                                reNewPwd: enNewPwd,
                                kaptcha: $regImgcode.val(),
                                verifCode: $regSendcode.val(),
                                dictUserClientType: 1
                            },
                            dataType: "json",
                            success: function (result) {
                                if (result.success) {
                                    $.Alert(result.message, '', function () {
                                        $regForm.find('input').val('');
                                        $regBtn.prop('disabled', false).text('提交');
                                        location.href = Base.builtUrl + '/login.html' + "?&v=" + window.ver;
                                    });
                                } else {
                                    $.Alert(result.message, '', function () {
                                        //$regForm.find( 'input' ).val( '' );
                                        $regBtn.prop('disabled', false).text('提交');
                                    });
                                }
                            }
                        });
                    }
                });
            }
            ;
            return false;
        });

        var common_param = {
            base: "/",
            locale: "zh_CN"
        };

        (function ($) {
            // 检测登录
            $.checkLogin = function () {
                var result = false;
                $.ajax({
                    url: common_param.base + "/login/check.jhtml",
                    type: "GET",
                    dataType: "json",
                    cache: false,
                    success: function (data) {
                        result = data;
                    }
                });
                return result;
            }

            // 跳转登录
            $.redirectLogin = function (redirectUrl, message) {
                var href = common_param.base + "/login.jhtml";
                if (redirectUrl != null) {
                    href += "?redirectUrl=" + encodeURIComponent(redirectUrl);
                }
                if (message != null) {
                    $.message("warn", message);
                    setTimeout(function () {
                        location.href = href;
                    }, 1000);
                } else {
                    location.href = href;
                }
            };

            // 令牌
            $(document).ajaxSend(function (event, request, settings) {
                //var privateKey = cookiehandle.getCookie("privateKey");
                //console.log(privateKey);
                if (!settings.crossDomain && settings.type != null && settings.type.toLowerCase() == "post") {
                    var token = cookiehandle.getCookie("token");
                    if (token != null) {
                        request.setRequestHeader("token", token);
                    }
                }
            });
            $(document).ajaxComplete(function (event, request, settings) {
                var loginStatus = request.getResponseHeader("loginStatus");
                var tokenStatus = request.getResponseHeader("tokenStatus");

                if (loginStatus == "accessDenied") {
                    var href = common_param.base + "/login.jhtml";
                    location.href = href;
                } else if (tokenStatus == "accessDenied") {
                    var token = cookiehandle.getCookie("token");
                    if (token != null) {
                        $.extend(settings, {
                            global: false,
                            headers: {token: token}
                        });
                        $.ajax(settings);
                    }
                }
            });

        })(jQuery);

        // 令牌
        $().ready(function () {

            $("form").submit(function () {
                console.log($(this))
                var $this = $(this);
                if ($this.attr("method") != null && $this.attr("method").toLowerCase() == "post" && $this.find("input[name='token']").size() == 0) {
                    var token = cookiehandle.getCookie("token");
                    if (token != null) {
                        $this.append('<input type="hidden" name="token" value="' + token + '" \/>');
                    }
                }
            });
        });
    });
});
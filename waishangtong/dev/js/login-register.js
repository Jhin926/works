/* !
 *  用于注册
 */
require([ 'common' ], function () {
    require(['blockUI'], function () {
        $('.registerKind>a').bind('click', function () {
            $(this).removeClass('noactive').siblings('a').addClass('noactive');
            var ink = $(this).index();
            if (ink == 0) {
                $('#phone').show();
                $('#email').hide();
            } else if (ink == 1) {
                $('#email').show();
                $('#phone').hide();
            }
        });
        //验证码
        $('#authCode').on('click', function () {
            var html = '重新发送(<span>180</span>)';
            $(this).attr('disabled', true).text('').empty().append(html);
            $.time = function () {
                if (parseInt($("#authCode span").text()) > 1) {
                    $("#authCode span").text(parseInt($("#authCode span").text()) - 1)
                } else {
                    clearInterval();
                    var html = '重新发送';
                    $('#authCode').text('').empty().append(html);
                    $('#authCode').attr('disabled', false);
                }
            }
            setInterval("$.time()", 1000)
        })
        //注册
        function register(data) {
            var data = JSON.stringify(data)
            $.ajax({
                url: Base.sitUrl + '/api/org/v1/org/user/register',
                type: 'POST',
                data: {
                    data: data
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return
                    }
                    $.Alert('注册成功');
                }
            })
        }

        var userNameReg = /^[a-zA-Z]{1}[0-9a-zA-Z_]{6,12}$/;
        var passWordReg = /^[a-zA-Z]{1}[0-9a-zA-Z_]{6,12}$/;
        //手机号验证
        $('#phone').find('input[name=mobile]').bind('change', function () {
            var val = $(this).val();
            if (/^1[34578]\d{9}$/.test(val)) {
                $(this).removeClass('errorVal');
                $(this).parents('.form-group').find('.error').hide();
                $("#authCode").prop("disabled",false);
            } else {
                $(this).addClass('errorVal');
                $(this).parents('.form-group').find('.error').show();
                $("#authCode").prop("disabled",true);
                // $.Alert('您填写的手机号不正确')
            }
        })
        //用户名验证
        $('input[name=name]').bind('change', function () {
            var val = $(this).val();
            if (userNameReg.test(val)) {
                $(this).removeClass('errorVal');
                $(this).parents('.form-group').find('.error').hide();
            } else {
                $(this).addClass('errorVal');
                $(this).parents('.form-group').find('.error').show();
                // $.Alert('您填写的手机号不正确')
            }
        })
        //密码验证
        $('input[name=password]').bind('change', function () {
            var val = $(this).val();
            if (userNameReg.test(val)) {
                $(this).removeClass('errorVal');
                $(this).parents('.form-group').find('.error').hide();
            } else {
                $(this).addClass('errorVal');
                $(this).parents('.form-group').find('.error').show();
            }
        })
        //手机注册
        $("#authCode").prop("disabled",true);
        $('#phoneBtn').on('click', function () {
            var name = $('#phone').find('input[name=name]').val();
            var mobile = $('#phone').find('input[name=mobile]').val();
            var verify = $('#phone').find('input[name=verify]').val();
            var password = $('#phone').find('input[name=password]').val();
            var passwordConfirm = $('#phone').find('input[name=passwordConfirm]').val();
            if (name == '') {
                $.Alert('请填写您的用户名')
                return
            } else if (!userNameReg.test(name)) {
                $.Alert('您填写的用户名不符合规则')
                return
            } else if (verify == '') {
                $.Alert('请填写验证码')
                return
            } else if (mobile == '') {
                $.Alert('请填写您的手机号');
                $("#authCode").prop("disabled",true);
                return
            }else if (isNaN(mobile) || mobile.length !== 11) {
                $.Alert('请正确填写您的手机号');
                return
            }else if (password == '') {
                $.Alert('请填写您的密码')
                return
            } else if (!passWordReg.test(password)) {
                $.Alert('请正确填写您的密码')
                return
            } else if (passwordConfirm == '') {
                $.Alert('请确认您的密码')
                return
            } else if (password !== passwordConfirm) {
                $.Alert('两次密码不一致')
                return
            } else {
                var data = {
                    name: name,
                    verify: verify,
                    mobile: mobile,
                    password: password,
                    passwordConfirm: passwordConfirm,
                    verifyType: 1
                }
                register(data)
            }
        })
        //邮箱注册
        $('#emailBtn').bind('click', function () {
            var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
            var name = $('#email').find('input[name=name]').val();
            var email = $('#email').find('input[name=email]').val();
            var password = $('#email').find('input[name=password]').val();
            var passwordConfirm = $('#email').find('input[name=passwordConfirm]').val();
            if (name == '') {
                $.Alert('请填写您的用户名')
                return
            } else if (!userNameReg.test(name)) {
                $.Alert('您填写的用户名不符合规则')
                return
            } else if (email == '') {
                $.Alert('请填写您的邮箱')
                return
            } else if (!reg.test(email)) {
                $.Alert('请填写正确填写您的邮箱')
                return
            } else if (password == '') {
                $.Alert('请填写您的密码')
                return
            } else if (!passWordReg.test(password)) {
                $.Alert('请正确填写您的密码')
                return
            } else if (passwordConfirm == '') {
                $.Alert('请确认您的密码')
                return
            } else if (password !== passwordConfirm) {
                $.Alert('两次密码不一致')
                return
            } else {
                var data = {
                    name: name,
                    email: email,
                    password: password,
                    passwordConfirm: passwordConfirm,
                    verifyType: 0
                }
                register(data)
            }
        })
    });
});
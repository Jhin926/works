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

        $("#authCode").prop("disabled",true);
        //验证手机号
        $('#phone').find('input[name=mobile]').bind('change', function () {
            var val = $(this).val();
            if (/^1[34578]\d{9}$/.test(val)) {
                $("#authCode").prop("disabled",false);
            } else {
                $("#authCode").prop("disabled",true);
            }
        })
        //验证码
        $('#authCode').bind('click', function () {
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
        });
        //点击切换验证码
        $(".change-img").on("click","a",function(){
            $(".verification-code img").attr("src",'/api/verify/v1/code?data={"codeType":1,"length":4,"bizType":3}&v='+Math.random());
        });
        var emailReg= /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        $(".reset_send").on("click",function(){
            var email=$("#use_email").val();
            var code=$(".verification-content").val();
            if(email==""){
                $.Alert("请填写邮箱地址");
                return
            }else if(!emailReg.test(email)){
                $.Alert("请填写正确填写您的邮箱");
                return
            }
            if(code==''){
                $.Alert("请输入验证码");
                return
            };
            $.ajax({
                url: Base.sitUrl + '/api/org/v1/org/user/password/reset',
                type: "post",
                data: {
                    data:JSON.stringify({email:email,verify:code})
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    location.href="reset-send-email.html?usename="+email;
                }
            });
        })
    });
});



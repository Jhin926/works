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

        var $form = $('#loginFrom'),
            $name = $form.find('[name="username"]'),
            $password = $form.find('[name="password"]'),
            $rememberme = $('#remember');

        $(document).ready(function () {
            if (localStorage.getItem('_account')) {
                $name.val(localStorage.getItem('_account'));
                $rememberme.prop('checked', true);
                $rememberme.parent().addClass('checked');
            }
        })
        // $form.validate();
        $('body').bind('keyup', function (event) {
            if (event.keyCode == 13) {
                $('#loginBtn').click();
            }
        })
        //点击切换验证码
        $(".change-img").on("click","a",function(){
            $(".verification-code img").attr("src",'/api/verify/v1/code?data={"codeType":1,"length":4,"bizType":1}&v='+Math.random());
        })
        //是否启用验证码
        $("input[name=username]").bind("blur",function(){
            var $val=$(this).val();
            $.ajax({
                type:"post",
                url:Base.sitUrl+'/api/org/v1/org/user/is/enable',
                data: {data:JSON.stringify({name: $val})},
                success:function(res){
                    if(!res.success){
                        if(res.code==200062){
                            $(".identifying-code").show();
                        }else if(res.code==200063){
                            $(".identifying-code").hide();
                            return
                        }
                    }
                }
            })
        })

        // 登录开始
        var codenum;
        $('#loginBtn').on('click', function () {
            if ($rememberme.prop('checked')) {
                localStorage.setItem('_account', $name.val())
            } else {
                localStorage.clear();
            }
            var $this = $form,
                $btn = $(this);
            //读取cookie中的token
            if ($this.attr("method") != null && $this.attr("method").toLowerCase() == "post" && $this.find("input[name='token']").size() == 0) {
                var token = cookiehandle.getCookie("token");
                if (token != null) {
                    $this.append('<input type="hidden" name="token" value="' + token + '" \/>');
                }
            }
            // 登录状态
            // 发送请求获取登录的key
            if ($name.val() == '' || $password.val() == '') {
                $.Alert('账号或密码不能为空')
                return
            }
            var identifying=$(".verification-content").val();

            if($(".identifying-code").css("display")=='block'){
                if(identifying==""){
                    $.Alert("请输入验证码");
                    return
                }else{
                    codenum=identifying;
            }
            }
            $btn.prop('disabled', true).text('登录中...');
            $.ajax({
                url: Base.sitUrl + '/api/user/v1/login',
                type: "POST",
                data: {
                    email: $.trim($name.val()),
                    password: $password.val(),
                    code:codenum
                },
                cache: false,
                success: function (res) {
                    if (!res.success) {
                        if(res.code==200062){
                            $(".identifying-code").show();
                            $btn.prop('disabled', false).text('登录');
                            return;

                        }else if(res.code==200063){
                            $(".identifying-code").hide();
                        }
                            $.unLogin(res);
                            $btn.prop('disabled', false).text('登录');
                            return;

                    }
                    var obj = res.data;
                    localStorage.setItem('__userInfo', obj.name + ';' + obj.id + ';' + obj.isMaster);
                    location.href = './main.html';
                }
            });
            return false;
        });
    });
});
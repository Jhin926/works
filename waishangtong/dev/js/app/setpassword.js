// 修改密码
define( [ 'common', 'cookiehandle'], function( common, cookiehandle ){
    return {
        // 初始化
        init: function() {

            // 保存页面需要用到的登录信息
            $( '.data-accout' ).text( cookiehandle.getCookie( 'account' ) );

            // 修改密码
            var $setPsdBtn = $( '#setPsdBtn' ),
                $setPsdForm = $( '#setPsdBtn' ).closest( 'form' );

            // 绑定jquery validate
            $setPsdForm.validate();
            // 提交事件
            $setPsdBtn.on( 'click', function( e ){
                e.preventDefault();
                var $this = $( this ),
                    oldPwd = $.trim( $( '[name="oldpsd"]' ).val() ),
                    newPwd = $.trim( $( '[name="newpsd"]' ).val() ),
                    reNewPwd = $.trim( $( '[name="renewpsd"]' ).val() );

                if( $setPsdForm.valid() ){  // 判断是否通过校验
                    $setPsdBtn.prop( 'disabled', true ).text( '正在提交...' );
                    // 请求加密
                    $.ajax({
                        url: Base.sitUrl + "/security/public_key.jhtml",
                        type: "GET",
                        dataType: "json",
                        cache: false,
                        success: function( keyResult ) {
                            var rsaKey = new RSAKey();
                            rsaKey.setPublic(b64tohex( keyResult.data.modulus ), b64tohex( keyResult.data.exponent ) );
                            var enOldPwd = hex2b64( rsaKey.encrypt( oldPwd ) ),
                                enNewPwd = hex2b64( rsaKey.encrypt( newPwd ) ),
                                enReNewPwd = hex2b64( rsaKey.encrypt( reNewPwd ) );
                            // 提交加密后的信息
                            $.ajax({
                                url: Base.reqUrl,
                                type: "POST",
                                data: {
                                    _mt: 'user_resetAccountPassword',
                                    oldPwd: enOldPwd,
                                    newPwd: enNewPwd,
                                    reNewPwd: enReNewPwd
                                },
                                dataType: "json",
                                success: function( result ) {
                                    if( result.success ){
                                        $.Alert( '密码修改成功！', '', function(){
                                            $setPsdForm.find( 'input' ).val( '' );
                                            $setPsdBtn.prop( 'disabled', false ).text( '提交' );
                                            //跳转到登录页
                                            location.href = Base.builtUrl + '/login.html';
                                        });
                                    }else{
                                        $.Alert( result.message );
                                        $setPsdForm.find( 'input' ).val( '' );
                                        $setPsdBtn.prop( 'disabled', false ).text( '提交' );
                                    };
                                }
                            });
                        }
                    });
                };
            });
        }
    }
});
// jquery validate 自定义校验规则
require( [ 'common' ], function(){
	require( [ 'validationLang' ], function(){
		// 增加手机邮箱自定义校验规则
	    $.validator.addMethod( "mobile", function( value, element ) {
	        var isMobilOrEmail =  /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test( value ) ||  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test( value ) ;
	        return isMobilOrEmail;
	    }, "请输入正确的手机号或者邮箱" );
	    // 增加邮箱自定义校验规则
	    $.validator.addMethod( "email", function( value, element ) {
	        var isEmail =  /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test( value ) ;
	        return isEmail;
	    }, "请输入正确的邮箱" );
	    // 相等校验
	    $.validator.addMethod( "equal", function( value, element, params ) {
	    	var val = $.trim( $(element).val() ),
	    		valTo = $.trim( $( '[name="' + params + '"]' ).val() );
	        return (  val === valTo );
	    }, "密码不一致" );
	    /*$.validator.addMethod( "password", function( value, element ) {
	        console.log( value );
	        var isPassword =  /^(?=.{6,16}$)(?![0-9]+$)(?!.*(.).*\1)[0-9a-zA-Z]+$/.test( value );
	        return isPassword;
	    }, "格式有误，由6-16位数字或者字母组成，以字母开头" );*/
		// 正整数
		$.validator.addMethod( "num", function( value, element ) {
	        var isNum = /^\+?[1-9][0-9]*$/.test( value );
	        return isNum;
	    }, "请输入正整数" );
    });
});
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0" />
<meta name="format-detection" content="telephone=no" />
<meta http-equiv="Cache-Control" content="no-transform"/>
<meta name="layoutmode" content="standard" />
<meta name="renderer" content="webkit" />
<!--uc浏览器判断到页面上文字居多时，会自动放大字体优化移动用户体验。添加以下头部可以禁用掉该优化-->
<meta name="wap-font-scale" content="no" />
<meta http-equiv="Pragma" content="no-cache" />
<title>登录密码重置</title>
<link type="text/css" rel="stylesheet" href="css/css.css" />
<script type="text/javascript" src="js/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="js/common.js"></script>
<script src="js/count.js"></script>
</head>

<body>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
		<form id="signupForm" name="resetPwd" method="post" action="<%=basePath %>pwdManage!resetLoginPassword.action">
			<div class="common-input">
				<input name="phoneNo" type="tel" placeholder="请输入您的手机号码" />
			</div>
			<div class="common-input2">
				<input style="width: 57%;" name="yzm" type="tel" placeholder="请输入验证码" maxlength="4" /> 
				<span id="get-code" class="get_code">获取验证码</span>
			</div>
			<div class="common-input">
				<input name="password" type="password" placeholder="请输入新密码" />
			</div>
			<div class="common-input2">
				<input name="confirmpassword" type="password" placeholder="请再次输入新密码" />
			</div>
			<button type="button" id="reset" class="submit unclick">确认</button>
		</form>
<script>
function reset(){
	var getPhoneVal = $("input[name='phoneNo']").val(),
	getTestVal = $("input[name='yzm']").val(),
	getPWDVal = $("input[name='password']").val(),
	getCfPwdVal = $("input[name='confirmpassword']").val();

	if(!testPhone(getPhoneVal)) return;
	if(!testCode(getTestVal)) return;
	if(!testPassword(getPWDVal)) return;
	if(!testPassword(getCfPwdVal)) return;
	
	if(getPWDVal != getCfPwdVal){
		alert("两次密码输入不一致！");
		return;
	}
	//手机号，验证码，密码检查格式正确之后，下一步！
	
	layer();
	
	$.ajax({
		url: "pwdManage!resetLoginPassword.action",
        type: "post",
        data: {"yzm": getTestVal , "phoneNo": getPhoneVal,"password": getPWDVal},
        success: function (data1) {
        	console.log(data1);
        	var data = stringToJson(data1);
        	
        	switch (data.retcode) {
            case "0":
	            $("#layer").remove();            	
            	alert("重置密码成功！");
            	location.href = "login.jsp";
                break;
            case "101"://这种情况基本不会出现
	            $("#layer").remove();
            	alert("新密码为空！");
                break;
            case "301":
	            $("#layer").remove();
            	alert("该手机号尚未注册，请先注册！");
            	location.href = "zhuce.jsp";
                break;
            case "401":
	            $("#layer").remove();
            	alert("验证码错误！请仔细核对！");
                break;
            case "402":
	            $("#layer").remove();
            	alert("验证码超时，请重新获取验证码！");
                break;
            default:
	            $("#layer").remove();
            	alert("未知错误！重置失败！");
                break;
        	}
        },
        error: function(i){
            $("#layer").remove();
        	alert("未知错误！请稍后重试！");
        	location.reload(true);
        }
	})	
}

function getCode(){
	var _time = 30;
	var _this = $(this);
	if(_this.hasClass("unclick")) return;
	
	var getPhoneNo =  $("input[name='phoneNo']").val();
	
	if (!testPhone(getPhoneNo)) return;
	
	_this.addClass("unclick");
	_this.html("已发送(<span class='code-time'>"+ _time +"</span>)");
	
	var t = setInterval(function(){
		
		if(_time <= 0){
			_this.html("重新发送").removeClass("unclick");
			clearInterval(t);
			return;
		}

		_time--;
		_this.html("已发送(<span class='code-time'>"+ _time +"</span>)");
	},1000);
    
    $.ajax({
        url: "pwdManage!getResetPwdCode.action",
        type: "post",
        data: $("form").serialize(),
        success: function (data) {
            var strToJson = stringToJson(data);
			if(strToJson.retcode === "1"){
				alert("验证码发送成功！");
				$("#reset").removeClass("unclick").unbind("touchend").on("touchend",reset);
				
			}else if(strToJson.retcode === "0"){
				alert("该手机号码尚未注册! 请先注册!");
            	location.href = "zhuce.jsp";
			}else if(strToJson.retcode === "112314"){
				alert("您的手机短信已超过今日限制，明天再试吧！");
			}else {
				alert("未知错误！请重试！");
			}
		},
        error: function(i){
        	alert("未知错误！请稍后重新发送！");
        	location.reload(true);
        }
    });
}

$(function(){
	$("#get-code").on("touchend",getCode);
})
</script>
</body>
</html>

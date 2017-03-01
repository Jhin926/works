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
<title>注册</title>
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
<div class="logo"><img src="<%=basePath%>images/logo.png" width="20%" alt="" /></div>
	<form method="post">
		<div class="common-input">
				<div class="ico-login">
					<img src="<%=basePath%>images/ico-login01.png" alt="" />
				</div>
			<input name="phoneNo" type="tel" style="width: 81%;" placeholder="请输入您的手机号码" />
		</div>
		<div class="common-input2">
				<div class="ico-login">
					<img src="<%=basePath%>images/ico-login02.png" alt="" />
				</div>
			<input id="password" name="password" style="width: 57%;" type="password" placeholder="请输入密码" />
			<span id="show-pwd"	class="show-pwd">
				<img style="width:30px;height:30px;" src="<%=basePath%>images/ico-showpwd_off.png" alt="" />
			</span>
		</div>
		<!-- <div class="common-input2">
			<input name="confirm_password" type="password" placeholder="请再次输入密码" />
		</div> -->
		<div class="common-input2">
			<input style="width: 57%;margin-left: 3%;" name="yzm" type="tel" placeholder="请输入四位验证码" maxlength="4" />
			<span id="get-code"	class="get_code2">获取验证码</span>
		</div>
		<div class="sub sub-recharge">
			<span class="checkbox-recharge checked-recharge"></span>
			阅读并同意&nbsp;<a href="http://www.umibank.com/terms_sy.html">《悠米钱包用户使用协议》</a>
		</div>
		<button type="button" id="register" class="submit login-register">注册</button>
		<div class="sub">
			<a href="login.jsp">已有账号？立即登录</a>
		</div>
	</form>
<script>
var getPhone = $("input[name='phoneNo']"),
	getTest = $("input[name='yzm']"),
	getPWD = $("input[name='password']");

function getCode(){
	var _time = 30;
	var _this = $(this);
	if(_this.hasClass("unclick")) return;
	
	var getPhoneNo = getPhone.val();
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
	    
	layer();
    $.ajax({
        url: "mainAction!sendMsg.action",
        type: "post",
        data: $("form").serialize(),
        success: function (data) {
        	console.log(data);
            var strToJson = stringToJson(data);
            if(strToJson.retcode === "2"){
	            $("#layer").remove();
            	alert("该号码已经注册过了!");
            }else if(strToJson.retcode === "0"){
	            $("#layer").remove();
				alert("验证码发送失败!请稍后重新发送！");
			}else if(strToJson.retcode === "1") {
	            $("#layer").remove();
				alert("发送成功！");
				$("#register").removeClass("unclick").unbind("touchend").on("touchend",register);				
			}else{
	            $("#layer").remove();
				alert("没有发送成功，也不是发送失败！");
			}
        },
        error: function(i){
            $("#layer").remove();
        	alert("未知错误！请稍后重新发送！");
        	location.reload(true);
        }
    })
}

function register(){
	
	if(!$(".checkbox-recharge").hasClass("checked-recharge")){
		alert("请先同意《悠米钱包用户使用协议》！");
		return;
	}
	
	var _this = $(this);
	if(_this.hasClass("unclick")) return;
	
	var getPhoneVal = getPhone.val(),
	getTestVal = getTest.val(),
	getPWDVal = getPWD.val();


	if (!testPhone(getPhoneVal)) return;
	if (!testCode(getTestVal)) return;
	if (!testPassword(getPWDVal)) return;

	layer();

	$.ajax({
		url : "mainAction!registerWeb.action",
		type : "post",
		data : $("form").serialize(),
		success : function(data) {
			var strToJson = stringToJson(data);
			switch (strToJson.retcode) {
			case "0":
				$("#layer").remove();
				alert("注册成功!");
				location.href = "login!loadIndexPage.action";
				break;
			case "1":
				$("#layer").remove();
				alert("该手机号已被注册！请直接登录！");
				location.href = 'login.jsp';
				break;
			case "2":
				$("#layer").remove();
				alert("验证码错误，请仔细核对！");
				break;
			case "3":
				$("#layer").remove();
				alert("验证码已失效，请重新发送！");
				break;
			default:
				$("#layer").remove();
				location.href = "500.jsp";
			}
		},
		error : function() {
			$("#layer").remove();
			alert("未知错误！请稍后重试！");
		}
	})
}

	$(function() {
		$(".checkbox-recharge").on("touchend",function(){
			$(this).toggleClass("checked-recharge");
		})
			
		$("#show-pwd").on("touchend",function(){
			var $this = $(this);
			var getSrc = $this.find("img").attr("src");
			if(getSrc.indexOf("_off.") >= 0) {
				$this.prev().attr("type","text");
				$this.find("img").attr("src",getSrc.replace("_off.","_on."));
			}else{
				$this.prev().attr("type","password");
				$this.find("img").attr("src",getSrc.replace("_on.","_off."));				
			}
		})
		$("#get-code").on("touchend", getCode);
	});
</script>
</body>
</html>

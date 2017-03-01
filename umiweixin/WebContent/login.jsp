<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<%@page import="com.nr.umi.util.CacheClearUtil"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="utf-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
	+ request.getServerName() + ":" + request.getServerPort()
	+ path + "/";
	Object obj = session.getAttribute("user");
	if (obj != null) {
		response.sendRedirect(basePath + "login!loadIndexPage.action");
	}else{
		CacheClearUtil.clearSession(session);
	}
%>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0" />
<meta name="format-detection" content="telephone=no" />
<meta http-equiv="Cache-Control" content="no-transform" />
<meta name="layoutmode" content="standard" />
<meta name="renderer" content="webkit" />
<!--uc浏览器判断到页面上文字居多时，会自动放大字体优化移动用户体验。添加以下头部可以禁用掉该优化-->
<meta name="wap-font-scale" content="no" />
<meta http-equiv="Pragma" content="no-cache" />
<title>登录</title>
<link type="text/css" rel="stylesheet" href="<%=basePath%>css/css.css" />
<script type="text/javascript" src="<%=basePath%>js/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/common.js"></script>
<script type="text/javascript" src="<%=basePath%>js/md5-min.js"></script>
<script src="<%=basePath %>js/count.js"></script>
</head>

<body>
	<div class="logo"><img src="<%=basePath%>images/logo.png" width="20%" alt="" /></div>
			<div class="common-input">
				<div class="ico-login">
					<img src="<%=basePath%>images/ico-login01.png" />
				</div>
				<input type="tel" name="tel" id="tel" class="right" style="width: 81%;" maxlength=11 placeholder="请输入注册时的手机号码" />
			</div>
			<div class="common-input2">
				<div class="ico-login">
					<img src="<%=basePath%>images/ico-login02.png" />
				</div>
				<input type="password" name="password"  class="right" style="width: 81%;" id="pwd" placeholder="请输入登录密码" />
			</div>
			<button id="btn-login" class="submit login-register" type="button">立即登录</button>
		<div class="sub">
			<a class="left" href="resetPwd.jsp">忘记密码？</a>
			<a href="zhuce.jsp">没有账号？立即注册</a>
		</div>
<script>
	function login(){
		var getPhoneNo = document.getElementById("tel").value;
		var getPWD = document.getElementById("pwd").value;
		if(!testPhone(getPhoneNo)) return;
		if(!testPassword(getPWD)) return;
		
		var encryptedPwd=hex_md5(getPWD);
		var url = "";
		if(isWeiXin()) url = getContextPath() + "/login!loginWeixin.action";//微信授权的情况
		else url= getContextPath() + "/login!login.action";//非微信授权的情况 
		layer();
		
		$.ajax({
			url: url,
	        type: "post",
	        data: {"tel":getPhoneNo,"password":encryptedPwd},
	        success: function (data) {
	        	//console.log(data);
	        	switch (data) {
                case "0":
                	setTimeout(function(){
                    	$("#layer").remove();
                		location.href = "login!loadIndexPage.action";
                	},500);
                    break;
                case "1":
                	alert("处理中，请稍后！");
                    break;
                case "202":
                	location.href = getContextPath()+"/error.jsp";
                    break;
                default:
	            	$("#layer").remove();
                	alert("用户名或者密码错误，请重新登录！");
                    break;
            	}
	        },
	        error: function(i){
	        	alert("未知错误！请重新登录！");
	        	location.reload(true);
	        }
		})
	}
	document.getElementById("btn-login").addEventListener("touchend",login,false);
</script>
</body>
</html>

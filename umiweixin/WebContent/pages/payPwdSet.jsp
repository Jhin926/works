<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
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
<title>设置支付密码</title>
<link type="text/css" rel="stylesheet" href="<%=basePath %>css/css.css" />
<script type="text/javascript" src="<%=basePath %>js/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="<%=basePath %>js/common.js"></script>
<script src="<%=basePath %>js/count.js"></script>
</head>
<body>
		<form method="post" action="<%=basePath %>pwdManage!payPwdSet.action">
			<div class="common-input">
				<input type="password" name="cashPwd" placeholder="请输入支付密码" maxlength="6" />
			</div>
			<div class="common-input">
				<input type="password" name="againPwd" placeholder="请再次输入新支付密码" maxlength="6" />
			</div>
			<button type="button" class="submit">确&nbsp;&nbsp;&nbsp;&nbsp;认</button>
		</form>
	<script>
		writeFooter(3,true);
		var getSubBtn = document.getElementsByClassName("submit")[0];
		
		getSubBtn.addEventListener("touchend",function(){
			var getPwd = document.getElementsByName("cashPwd")[0].value;
			var getCPwd = document.getElementsByName("againPwd")[0].value;
			if(!testPayPwd(getPwd)) return;
			if(!testPayPwd(getCPwd)) return;
			if(getPwd !== getCPwd) {
				alert("两次密码输入不一致！");
				return;
			}
			
			layer();
				
			$.ajax({
					url: "pwdManage!payPwdSet.action",
			        type: "post",
			        data: {"cashPwd":getPwd},
			        success: function (data1) {
			        	var data = stringToJson(data1);
			        	console.log(data);
			        	console.log(typeof data.retcode , data.retcode);
			        	
			        	switch (data.retcode) {
			            case "0":
			            	$("#layer").remove();
			            	alert("支付密码设置成功！");
			            	location.href = "login!loadIndexPage.action";
			                break;
			            case "101":
			            	$("#layer").remove();
			            	alert("支付密码为空！");
			                break;
			            case "201":
			            	$("#layer").remove();
			            	alert("个人信息有误，请重新登录！");
			            	location.href = "login!logout.action";
			                break;
			            default:
			            	$("#layer").remove();
			            	alert("修改失败！");//不知道服务器会不会抽风，出现这种情况
			                break;
			        	}
			        },
			        error: function(i){
		            	$("#layer").remove();
			        	alert("未知错误！请稍后重试！");
			        	location.reload(true);
			        }
				})
		},false)		
	</script>
</body>
</html>

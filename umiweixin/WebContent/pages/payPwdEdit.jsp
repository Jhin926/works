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
<title>修改支付密码</title>
<link type="text/css" rel="stylesheet" href="<%=basePath %>css/css.css" />
<script type="text/javascript" src="<%=basePath%>js/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/common.js"></script>
<script src="<%=basePath %>js/count.js"></script>
</head>
<body>
		<form name="search" method="post" action="<%=basePath %>pwdManage!payPwdUpdate.action">
			<div class="common-input">
					<input id="lastPwd" type="password" name="oldPwd" placeholder="请输入原支付密码" maxlength="6" />
			</div>
			<div class="common-input">
					<input id="newPwd" type="password" name="newPwd" placeholder="请输入新支付密码" maxlength="6" />
			</div>
			<div class="common-input2">
					<input id="cfmNewPwd" type="password" name="againPwd" placeholder="请再次输入新支付密码" maxlength="6" /> 
			</div>
			<button type="button" class="submit" id="sure">确&nbsp;&nbsp;&nbsp;&nbsp;认</button>
			<div class="sub"><a href="<%=basePath %>pages/payPwdReset.jsp">忘记支付密码？</a></div>
		</form>
</body>
<script>
	writeFooter(3,true);
	var getSure = document.getElementById("sure");
	
	function payPwdEdit(){
		
		var getOldPwd = document.getElementById("lastPwd").value;
		var getNewPWD = document.getElementById("newPwd").value;
		var getCfmNewPWD = document.getElementById("cfmNewPwd").value;
		
		if (getOldPwd === "") {
			alert("原密码不能为空");
			return;
		} else {
			if (getOldPwd.length < 6) {
				alert("原密码输入错误！");
				return;
			}
		}
		
		if(!testPayPwd(getNewPWD)) return;
		if(!testPayPwd(getCfmNewPWD)) return;
		
		if(getNewPWD !== getCfmNewPWD){
			alert("两次输入密码不一致！");
			return;
		}
		
		layer();
			$.ajax({
				url: "pwdManage!payPwdUpdate.action",
		        type: "post",
		        data: {"oldPwd":getOldPwd,"newPwd":getNewPWD},
		        success: function (data) {
		        	var data = stringToJson(data);
		        	switch (data.retcode) {
		            case "0":
			            $("#layer").remove();
		            	alert("支付密码修改成功！");
		            	location.href = "login!loadIndexPage.action";
		                break;
		            case "101"://这种情况基本不会出现
			            $("#layer").remove();
		            	alert("我们的后台验证很严格，请不要做无谓的尝试！");
		                break;
		            case "102"://这种情况基本不会出现
			            $("#layer").remove();
		            	alert("原支付密码错误！");
		                break;
		            case "201":
			            $("#layer").remove();
		            	alert("个人信息有误，请重新登录！");
		            	location.href = "login!logout.action";
		                break;
		            default:
			            $("#layer").remove();
		            	alert("修改失败！请稍后重试！");//不知道服务器会不会抽风，出现这种情况
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
	getSure.addEventListener("touchend",payPwdEdit,false);
</script>
</html>

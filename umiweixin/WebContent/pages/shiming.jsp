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
<title>实名认证</title>
<link type="text/css" rel="stylesheet" href="<%=basePath %>css/css.css" />
<script type="text/javascript" src="<%=basePath %>js/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="<%=basePath %>js/common.js"></script>
<script src="<%=basePath %>js/count.js"></script>
</head>
<body>
	<c:if test="${user.isVerified==1 }">
		<h3>您已实名验证成功,如有其它问题其联系客户</h3>
	</c:if>

	<c:if test="${user.isVerified==0 }">
		<p class="realname">您还未实名认证，请先实名认证!</p>
			<div class="common-input">
				<input name="name" type="text" placeholder="请输入您的真实姓名" />
			</div>
			<div class="common-input">
				<input name="identityCard" type="text" placeholder="请输入您的身份证号" maxlength="18" />
			</div>
			<button type="button" id="next" class="submit">提交</button>
	</c:if>
	 
	<script>
		writeFooter(3,true);
		function realName(){
			var userName = $("input[name='name']").val();
			var userIdcard = $("input[name='identityCard']").val();
			
			if(userName == ""){
				alert("请输入用户名！");
				return;
			}
			
			if (!isIdcard(userIdcard)) return;
			
			layer();
			
			$.ajax({
 				url: getContextPath() + "/realNameValAction!validateID.action",
 			    type: "post",
 			    data: {"name":userName,"identityCard":userIdcard},
 			    success: function (data1) {
 			      	var data = stringToJson(data1);
 			       	console.log(data);
 			       	console.log(typeof data.retcode , data.retcode);
 			       	switch (data.retcode) {
 			        	case "0":
 			       			$("#layer").remove();
 			       			alert("实名认证成功！");
 			       			location.href = getContextPath()+ "/login!loadIndexPage.action";
 			        		break;
 			         	case "1":
 			           		$("#layer").remove();
 			            	alert("实名认证失败："+data.retmessage);
 			                break;
 			            case "2":
 			            	alert("个人信息错误，请重新登录！");
 			            	location.href = getContextPath() + "/login!logout.action";
 			                break;
 			            case "3":
 			            	alert("本次实名认证已结束，稍后将自动回到首页！");
 			            	location.href = getContextPath()+ "/login!loadIndexPage.action";
 			                break;
 			            default:
 			            	$("#layer").remove();
 			            	alert("修改失败！服务器抽风了，sorry！");//不知道服务器会不会抽风，出现这种情况
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
		$(function(){
			$("#next").on("touchend", realName);
		})
	</script>
</body>
</html>

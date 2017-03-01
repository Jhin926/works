<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0" />
<meta name="format-detection" content="telephone=no" />
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta name="layoutmode" content="standard" />
<meta name="renderer" content="webkit" />
<!--uc浏览器判断到页面上文字居多时，会自动放大字体优化移动用户体验。添加以下头部可以禁用掉该优化-->
<meta name="wap-font-scale" content="no" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
<title>悠米首页</title>
<link type="text/css" rel="stylesheet" href="<%=basePath %>css/css.css" />
<script type="text/javascript" src="<%=basePath %>js/common.js"></script>
<script src="<%=basePath %>js/count.js"></script>
</head>

<body>
	<header class="brief">
		<p><img src="../images/photo.png" width="28%" alt="" /></p>
		<p>账号:&nbsp;${user.userNameCT}</p>
		<div class="brief-logout"><a class="logout" href="<%=basePath%>login!unbindWithWechat.action">注销</a></div>
	</header>
	<ul class="manage">
		<li>
			实名认证
			
			<c:if test="${user.isVerified==0 }">
				<%-- <li><a href="<%=basePath %>login!realNameVerify.action">
					实名认证 <span class="btn-manage"></span>
				</a></li> --%>
				<p class="confirm-status right"><a href="<%=basePath %>login!realNameVerify.action">&lt;点击认证&gt;</a></p>
			</c:if>
			<c:if test="${user.isVerified!=0 }">
				<p class="confirm-status right"><img src="../images/ico-confirm.png" width="14" alt="" />已认证</p>
			</c:if>
		</li>
		<li><a href="<%=basePath %>bankCardAction!loadUserBankInfo.action">银行卡管理
			<span class="btn-manage"></span>
		</a></li>
		<li><a href="<%=basePath%>servlet/jumpActivityDispatch.servlet?pathCode=1">体验金管理
			<span class="btn-manage"></span>
		</a></li>
	</ul>
	<ul class="manage">
		<c:if test="${empty user.cashPwd }">
			<li><a href="<%=basePath %>pwdManage!pwdManage.action?pwdType=3">设置支付密码
				<span class="btn-manage"></span>
			</a></li>
		</c:if>			
		<li><a href="<%=basePath %>pwdManage!pwdManage.action?pwdType=2">修改登录密码
			<span class="btn-manage"></span>
		</a></li>

		<c:if test="${!empty user.cashPwd }">		
			<li><a href="<%=basePath %>pwdManage!pwdManage.action?pwdType=1">修改支付密码
				<span class="btn-manage"></span>
			</a></li>
		</c:if>
	</ul>
	<ul class="manage">
		<li><a href="<%=basePath %>zhuce-liushui.html">流水查询
			<span class="btn-manage"></span>
		</a></li>
	</ul>
	<script>
		writeFooter(3,false);
	</script>
</body>
</html>

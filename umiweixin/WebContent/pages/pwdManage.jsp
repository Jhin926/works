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
<title>密码管理</title>
<link type="text/css" rel="stylesheet" href="<%=basePath %>css/css.css" />
<script src="<%=basePath %>js/count.js"></script>
</head>
<body>
		<c:if test="${empty user.cashPwd }">
			<div class="common-input">
					<a href="<%=basePath %>pwdManage!pwdManage.action?pwdType=3">
						<div class="btn-text left">设置支付密码</div>
						<div class="btn-arrow right">
							<img src="<%=basePath %>images/bg-btn2.png" />
						</div>
					</a>
			</div>
		</c:if>
		
		<div class="common-input">
				<a href="<%=basePath %>pwdManage!pwdManage.action?pwdType=2">
					<div class="btn-text left">修改登录密码</div>
					<div class="btn-arrow right">
						<img src="<%=basePath %>images/bg-btn2.png" />
					</div>
				</a>
		</div>

		<c:if test="${!empty user.cashPwd }">
			<div class="common-input">
					<a href="<%=basePath %>pwdManage!pwdManage.action?pwdType=1">
						<div class="btn-text left">修改支付密码</div>
						<div class="btn-arrow right">
							<img src="<%=basePath %>images/bg-btn2.png" />
						</div>
					</a>
			</div>
		</c:if>
</body>
</html>

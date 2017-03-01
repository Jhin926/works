<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page language="java" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
session.invalidate();
%>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0" />
<meta name="format-detection" content="telephone=no" />
<meta http-equiv="Cache-Control" content="no-transform"/>
<meta name="layoutmode" content="standard" />
<meta name="renderer" content="webkit" />
<!--uc浏览器判断到页面上文字居多时，会自动放大字体优化移动用户体验。添加以下头部可以禁用掉该优化-->
<meta name="wap-font-scale" content="no" />
<meta http-equiv="Pragma" content="no-cache" />
<title>500</title>
<!-- 500 处理页面 -->
<script src="<%=basePath %>js/count.js"></script>
<link type="text/css" rel="stylesheet" href="<%=basePath %>css/css.css" />
</head>

<body>
	<p class="error">500</p>
	<p class="error-text">服务器出错啦!!!</p>
	<p class="return-index">请点击这里<a href="login.jsp">返回重新登录</a></p>
	<p class="error-call">如果有问题请点击这里&nbsp;<a href="tel:4000177112">联系客服</a></p>
</body>
</html>
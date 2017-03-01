<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page language="java" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
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
<title>error</title>
<script src="<%=basePath %>js/count.js"></script>
</head>

<body style="background: #fff;color: #707070;">
	<p style="margin: 40px 0 15px 0;font-size: 36px;text-align: center;"><strong>error</strong></p>
	<p style="padding: 10px 30px; font-size: 12px">${session.error_message }</p>
	<p style="padding: 10px 30px; font-size: 12px">${session.wechatMessage }</p>
	<p style="padding: 10px 30px; font-size: 12px">${session.withdrawAction_message }</p>
	<p style="padding: 10px 30px; font-size: 12px">${session.chongzhiAction_message }</p>
</body>
</html>
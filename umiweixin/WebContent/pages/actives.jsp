<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html style="height:100%;">
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
<body style="height:100%;">		
	<iframe id="activeCenter" width="100%" height="100%" frameborder="0" seamless>
	</iframe>
	<script>
		writeFooter(1,false);
		setTimeout(function(){
			document.getElementById("activeCenter").src = "http://www.momibank.com/activitycenter/userAction!loginW"+location.search;
		},30);	
	</script>
</body>
</html>

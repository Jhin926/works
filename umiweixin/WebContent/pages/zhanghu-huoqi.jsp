<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
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
<title>悠米活期账户详情</title>
<script type="text/javascript" src="<%=basePath %>js/common.js"></script>
<script src="<%=basePath %>js/count.js"></script>
<script>
	isCompute();//判断收益是否计算完成
</script>
<link type="text/css" rel="stylesheet" href="<%=basePath %>css/css.css" />
</head>
<body>
<div class="trade-title">
		<div class="trade-class" style="line-height: 23px;">
			<img src="<%=basePath%>/images/index_09.png" width="25" alt="" />
			悠米活期
		</div>
		<div class="expect-income">
			<p>预期年化收益率</p>
			<span>8.</span>0%
		</div>
		<div class="account-total">
			<div class="income-total left">
				<p>昨日总收益(元)</p>
				<p class="mt10 ft25 red">
					<fmt:formatNumber value="${curDepAccount.profitAmt}" pattern="0.00"/>
				</p>
			</div>
			<div class="amount-total right">
				<p>账户总余额(元)</p>
				<p class="mt10 ft25 deepgray">
					<fmt:formatNumber value="${curDepAccount.balance}" pattern="0.00"/>
				</p>
			</div>
			<div class="clear"></div>
		</div>
		<div class="btn-account2">
			<c:if test="${curDepAccount.balance > 0}">
				<a class="btn-withdraw left" href="<%=basePath%>withdrawAction!loadDate.action?accountID=400&finaAccId=${curDepAccount.id}">转&nbsp;出</a>
			</c:if>
    		<c:if test="${curDepAccount.balance <= 0}">
    			<a class="btn-withdraw left unclick" href="javascript:;">转&nbsp;出</a>
    		</c:if>
			<a class="btn-recharge right" href="<%=basePath%>chongZhiAction!loadDate.action?accountID=400">转&nbsp;入</a>
			<p class="clear"></p>
		</div>
		<div class="custom-sub">
			<p class="trade-ensure">
				<span>100%本息保障</span>
			</p>
			<p>
				<span>到期后自动转为活期</span>
			</p>
			<p>
				<a href="<%=basePath %>help.html#1">了解更多&gt;&gt;</a>
			</p>
		</div>
	</div>
</body>
<script>
	writeFooter(2,true);
</script>
</html>

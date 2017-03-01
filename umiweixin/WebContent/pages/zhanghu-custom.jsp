<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0" />
<meta name="format-detection" content="telephone=no" />
<meta http-equiv="Cache-Control" content="no-transform"/>
<meta name="layoutmode" content="standard" />
<meta name="renderer" content="webkit" />
<!--uc浏览器判断到页面上文字居多时，会自动放大字体优化移动用户体验。添加以下头部可以禁用掉该优化-->
<meta name="wap-font-scale" content="no" />
<meta http-equiv="Pragma" content="no-cache" />
<!-- 定制 -->
<title>悠米定制账户详情</title>
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
			<img src="<%=basePath%>/images/logo-custom.png" width="25" alt="" />
			悠米定制
		</div>
		<div class="expect-income">
			<p>预期年化收益率</p>
			<span>8.</span>04% ~ <span>14.</span>5%
		</div>
		<div class="account-total">
			<div class="income-total left">
				<p>昨日总收益(元)</p>
				<p class="mt10 ft25 red">
					<fmt:formatNumber value="${profitSum}" pattern="0.00" />
				</p>
			</div>
			<div class="amount-total right">
				<p>账户总余额(元)</p>
				<p class="mt10 ft25 deepgray">
					<fmt:formatNumber value="${amountSum}" pattern="0.00" />
				</p>
			</div>
			<div class="clear"></div>
		</div>
		<a href="<%=basePath %>pages/custom-term.html"><p style="font-size: 3rem;" class="w80 center h47 btn-account btn-recharge">转&nbsp;入</p></a>
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
 <ul class="trade-list">
 	<c:forEach items="${accounts}" var="acc" varStatus="vs">
 		<li class="trade-datails">
				<ul class="income-detail">
					<c:if test="${acc.freezedAmount <= 0 && acc.principal>0}">
						<li>
							<p>本金(元)</p>
							<p class="income-amount mt8">
								<fmt:formatNumber value="${acc.principal}" pattern="0.00" />
							</p>
						</li>
					</c:if>
					<c:if test="${acc.freezedAmount > 0 && acc.principal<=0}">
						<li>
							<p>体验金(元)</p>
							<p class="income-amount mt8">
								<fmt:formatNumber value="${acc.freezedAmount}" pattern="0.00" />
							</p>
						</li>
					</c:if>
					<c:if test="${acc.freezedAmount > 0 && acc.principal>0}">
						<li>
							<p>本金(元)</p>
							<p class="income-amount mt8">
								<fmt:formatNumber value="${acc.principal}" pattern="0.00" />
							</p>
						</li>
						<li>
							<p>体验金(元)</p>
							<p class="income-amount mt8">
								<fmt:formatNumber value="${acc.freezedAmount}" pattern="0.00" />
							</p>
						</li>
					</c:if>
					<li>
						<p>预期收益(元)</p>
						<p class="income-amount mt8">
							<fmt:formatNumber value="${acc.profitExcepted}" pattern="0.00" />
						</p>
					</li>
					<li>
						<p>已实现收益(元)</p>
						<p class="income-amount mt8"><fmt:formatNumber value="${acc.profitAmtSum}" pattern="0.00" />
						</p>
					</li>
				</ul>
				<div class="income-other">
					<div class="income-time">
						<c:if test="${acc.remainDays == 0}">
							<p class="income-time-current">今日到期</p>
							<p>若未转出，第二天将<br />自动转入悠米活期</p>
						</c:if>
						<c:if test="${acc.remainDays != 0}">
							<c:if test="${acc.remainDays == acc.timeLimit}">
								<p><span class="ft20" style="margin:0 0;">1</span>天后开始计息</p>
								<p>将于${acc.expirationDate}到期</p>
							</c:if>

							<c:if test="${acc.remainDays != acc.timeLimit}">
								<div class="income-time-remaind"><p>还剩<span class="ft20">${acc.remainDays}</span>天</p></div>
								<p class="mt8">将于${acc.expirationDate}到期</p>
							</c:if>
						</c:if>
					</div>
					<div class="income-handle">
						<p>当前余额(元)</p>
						<p class="mt5 ft20 red">${acc.balance}</p>
						<c:if test="${acc.remainDays == 0}">
							<a class="btn-account btn-withdraw w70 center mt5" href="<%=basePath%>withdrawAction!loadDate.action?accountID=888&finaAccId=${acc.id}">转&nbsp;出</a>
						</c:if>
						<c:if test="${acc.remainDays > 0}">
							<a class="btn-account btn-withdraw w70 center mt5 unclick" href="javascript:;">转&nbsp;出</a>
						</c:if>
					</div>
				</div>
			</li>
 	</c:forEach>
 </ul>
</body>
<script type="text/javascript" src="<%=basePath %>js/common.js"></script>
<script>
	writeFooter(2,true);
</script>
</html>

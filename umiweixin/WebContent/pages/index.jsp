<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
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
<link type="text/css" rel="stylesheet" href="<%=basePath %>css/swiper.3.2.0.min.css" />
<link type="text/css" rel="stylesheet" href="<%=basePath %>css/css.css" />
<link type="text/css" rel="stylesheet" href="<%=basePath %>css/index.css" />
<script src="<%=basePath %>js/swiper.3.2.0.min.js"></script>
<script src="<%=basePath %>js/common.js"></script>
<script src="<%=basePath %>js/count.js"></script>
<script>
	isCompute();//判断收益是否计算完成
</script>
</head>

<body>	
<div id="container">
<div class="swiper-container">
    <div class="swiper-wrapper">
        <div class="swiper-slide"><a href="http://www.momibank.com/addactive/spring/index.html"><img src="images/banner06.png" width="100%" alt="" /></a></div>
        <div class="swiper-slide"><a href="http://www.momibank.com/addactive/first/index.html"><img src="images/banner04.png" width="100%" alt="" /></a></div>
        <div class="swiper-slide"><a href="http://www.momibank.com/friendshare/"><img src="images/banner02.png" width="100%" alt="" /></a></div>
        <div class="swiper-slide"><a href="<%=basePath %>security.html"><img src="images/banner07.png" width="100%" alt="" /></a></div>
    </div>
    <div class="swiper-pagination">
    	<span class="swiper-pagination-bullet"></span>
    	<span class="swiper-pagination-bullet"></span>
    </div>
</div>
</div>
<h2 class="index-title">我的资产</h2>
<ul class="assets">
<!-- 悠米活期   start  -->
		<li><a href="<%=basePath%>detail!jumpAccount.action?accountID=400">
			<div class="asset-detail">
				<div class="asset-tit left">
					<img src="./images/logo-current.png" width="43" alt="" />
					<p>悠米活期</p>
				</div>
				<div class="asset-amount left">
					账户余额(元)
					<p>
						<span><fmt:formatNumber value="${huoqiAmount}" pattern="0.00"/></span>
					</p>
				</div>
				<p class="btn-asset-detail right">
					详情 <span class="btn-manage"></span>
				</p>
				<div class="corner"></div>
				<p class="clear"></p>
			</div>
			<div class="asset-sub">
				<p class="asset-sub-ensure left">100%本息保障</p>
				<p class="asset-sub-time right">15:00前转出，第二天到账</p>
				<p class="clear"></p>
			</div>
		</a></li>
		<!-- 悠米活期   end  -->
		
<!-- 悠米定制   start  -->
		<li><a href="<%=basePath%>detail!jumpAccount.action?accountID=888">
			<div class="asset-detail">
				<div class="asset-tit left">
					<img src="./images/logo-custom2.png" width="43" alt="" />
					<p>悠米定制</p>
				</div>
				<div class="asset-amount left">
					账户余额(元)
					<p>
						<span><fmt:formatNumber value="${amountCustom}" pattern="0.00"/></span>
					</p>
				</div>
				<p class="btn-asset-detail right">
					详情 <span class="btn-manage"></span>
				</p>
				<div class="corner custom"></div>
				<p class="clear"></p>
			</div>
			<div class="asset-sub">
				<p class="asset-sub-ensure left">100%本息保障</p>
				<p class="asset-sub-time right">到期后第二天自动转为活期</p>
				<p class="clear"></p>
			</div>
		</a></li>
		<!-- 悠米定制   end  -->
</ul>
	<script>
	writeFooter(2,false);
    var mySwiper = new Swiper(".swiper-container",{
        roundLengths : true,
        autoplay: 3000,
        loop: true,
        pagination : '.swiper-pagination',
        paginationClickable :true
    })
    </script>
</body>
</html>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://"
			+ request.getServerName() + ":" + request.getServerPort()
			+ path + "/";
%>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<head>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0" />
<meta name="format-detection" content="telephone=no" />
<meta http-equiv="Cache-Control" content="no-transform" />
<meta name="layoutmode" content="standard" />
<meta name="renderer" content="webkit" />
<!--uc浏览器判断到页面上文字居多时，会自动放大字体优化移动用户体验。添加以下头部可以禁用掉该优化-->
<meta name="wap-font-scale" content="no" />
<meta http-equiv="Pragma" content="no-cache" />
<title>设置默认支付卡</title>
<link type="text/css" rel="stylesheet" href="<%=basePath%>css/css.css" />
<script type="text/javascript" src="<%=basePath%>js/jquery-1.11.0.min.js"></script>
<script type="text/javascript" src="<%=basePath%>js/common.js"></script>
<script src="<%=basePath %>js/count.js"></script>
</head>
<body>
<div class="default-card">请选择一张卡做为默认支付卡</div>
<c:if test="${empty bis }"> <a href="<%=basePath%>pages/bank.jsp" class="pay-card">您还没有添加过一张银行卡,请点击这里添加银行卡</a> </c:if>
<c:if test="${!empty bis }">
	<ul class="paycard">
		<c:forEach items="${bis }" var="bi">
			<li data-isVerified="${bi.isVerified }" data-cardId="${bi.cardId }">
				<p class="checkbox"></p>
				<div class="paycard-logo"> <img src="<%=basePath %>images/${bi.bankPic }" /> </div>
				<div class="paycard-info">
					${bi.bank }&nbsp;<span>(${bi.tailNum })</span>
					<p>支付限额：首次${bi.bankLimit.firstLimit }元&nbsp;单笔${bi.bankLimit.dayLimit }&nbsp;单日${bi.bankLimit.dayMaxLimit }</p>
				</div>
			</li>
		</c:forEach>
	</ul>
</c:if>
<div class="common-input"> <a href="<%=basePath%>pages/bank.jsp">
	<div class="btn-text left">添加一张新卡做为支付卡</div>
	<div class="btn-arrow right"> <img src="<%=basePath %>images/bg-btn2.png" /> </div>
	</a> </div>
<div class="sub">
	<a class="right" href="<%=basePath %>help.html#7">查看银行卡限额</a>
</div>
<script>
	writeFooter(3,true);
	$(function() {			
		function setDefault(_this){				
			if(_this.hasClass("default-bank")) return;
				_this.addClass("default-bank").siblings().removeClass("default-bank");
				layer();
				$.ajax({
					url: "bankCardAction!switchCards.action",
			        type: "post",
			        data: {"bankCard":_this.attr("data-cardId")},
			        success: function (data1) {
			        	console.log(data1);
			        	var data = stringToJson(data1);
			        	switch (data.retcode) {
		                case "0":
			            	$("#layer").remove();
		                	location.href = getContextPath()+"/pages/bindingBankCard-yanzheng.jsp";
		                    break;
		                case "1":
		                	alert("绑卡失败："+data.retmessage);
		                	_this.removeClass("default-bank");
		                    break;
		                case "2":
		                	alert("登录信息错误！");
	                		location.href = "login!logout.action";
		                    break;
		                default:
		                	alert("服务器抽风！基本不会出现这样情况。。");
		                    break;
		            	}

			        	if($("#layer")){
			            	$("#layer").remove();			        		
			        	}
			        },
			        error: function(i){
		            	$("#layer").remove();
			        	alert("未知错误！请重新选择！");
			        	location.reload(true);
			        }
				})
			}

			$(".paycard li").each(function(){
				var _this = $(this);
				var isVerified = _this.attr("data-isVerified");
				if(isVerified === "1"){
					_this.addClass("default-bank");
				}
				_this.on("touchend",function(){setDefault(_this);});
			})
		})
	</script>
</body>
</html>
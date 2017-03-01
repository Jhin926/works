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
<!-- 转账结果  -->
<title>${dataJson.webpageTitle }</title>
<link type="text/css" rel="stylesheet" href="<%=basePath %>css/css.css" />
<script type="text/javascript" src="<%=basePath %>js/jquery-1.11.0.min.js"></script>
<script src="<%=basePath %>js/common.js"></script>
<script src="<%=basePath %>js/count.js"></script>
</head>

<body>
	<div class="common-input2" style="height: auto; min-height: 50px;padding: 10px 0;">
		<p class="result-name left">账户</p>
		<div class="result-mes right">
			<p class="left"><img src="<%=basePath %>images/${dataJson.srcAccPic}" width="20" alt="" />${dataJson.srcAccName}<span>${dataJson.tailNum}</span></p>
			<p style="margin:0 5px;" class="left">→</p>
			<p class="left"><img src="<%=basePath %>images/${dataJson.dstAccPic}" width="20" alt="" />${dataJson.dstAccName}<span>${dataJson.tailNum}</span></p>
		</div>
		<p class="clear"></p>
	</div>
	<div class="common-input2">
		<p class="result-name left">金额</p>
		<p class="result-cont right">&yen;${dataJson.amount}</p>
		<p class="clear"></p>
	</div>
	<div class="common-input2">
		<p class="result-name left">类型</p>
		<p class="result-cont right">${dataJson.tradeType}</p>
		<p class="clear"></p>
	</div>
	<div class="common-input2">
		<p class="result-name left">创建时间</p>
		<p class="result-cont right">${dataJson.createDate}</p>
		<p class="clear"></p>
	</div>
	<div class="common-input2">
		<p class="result-name left">交易状态</p>
		<p class="result-cont right">${dataJson.statusMsg}</p>
		<p class="clear"></p>
	</div>
	<div class="timeline">	
		<div class="timeline-container">
			<div class="timeline-grey">
			</div>
			<div class="timeline-current">
				<div class="timeline-blue">
				</div>
			</div>
		</div>
		<ul class="timeline-stage">
		</ul>
	</div>
	<a href="<%=basePath%>detail!jumpAccount.action?accountID=${dataJson.acountID}"><button class="submit" type="button">确&nbsp;认</button></a>
	<input id="cashflow" type="hidden" value="${dataJson.cashflowId}" />
	<script>
	writeFooter(2,true);
	$(function(){
		var cashflow = $("#cashflow").val();
		$.ajax({
			url: "detail!getCashflowDetail?cashflowId="+cashflow,
			success: function(data){
				console.log(data);				
				var data;
				try{
					data=JSON.parse(data);
				} catch(e){
					return;
				}
				
				if(data.retcode == "0"){//成功取得交易信息
					$(".timeline").css("display","block");
					
					var getLength = data.message.length;
					for(var i=0;i<getLength;i++){//首先吧下面的文字和时间写上，不管步骤有几步
						var getName = data.message[i].name;
						var getDetail = '<li><p class="timeline-stage-name">'+getName+'</p><p class="timeline-stage-time">'+data.message[i].time+'</p></li>';
						$(".timeline-stage").append(getDetail);
					}
					
					
					if(data.message.length == 4){//其他充值
						$(".timeline-stage").css("width","304px").find("li").not(":first").not(":last").css("width","80px");
						var timeLine = '<p class="timeline-node"></p><p class="timeline-node"></p><p class="timeline-node"></p><p class="timeline-node"><span class="timeline-tick"></span></p>';
						
						$(".timeline-grey").append(timeLine);
						$(".timeline-blue").append(timeLine);
						
						if(data.step == "1"){
							$(".timeline-current").css("width","46px");
							$(".timeline-stage-name:first").addClass("current");
						}else if(data.step == "2"){
							$(".timeline-current").css("width","120px");
							$(".timeline-stage-name:lt(2)").addClass("current");							
						}else if(data.step == "3"){
							$(".timeline-current").css("width","199px");
							$(".timeline-stage-name:lt(3)").addClass("current");							
						}else if(data.step == "4"){
							$(".timeline-current").css("width","240px");
							$(".timeline-stage-name").addClass("current");							
						}	
					}else if(data.message.length == "3"){//活期充值
						$(".timeline-stage li:nth-child(2)").css("width","160px");
						
						var timeLine = '<p class="timeline-node"></p><p class="timeline-node timeline-node2"></p><p class="timeline-node"><span class="timeline-tick"></span></p>';
						$(".timeline-grey").append(timeLine);
						$(".timeline-blue").append(timeLine);
						if(data.step == "1"){
							$(".timeline-current").css("width","65px");
							$(".timeline-stage-name:first").addClass("current");
						}else if(data.step == "2"){
							$(".timeline-current").css("width","179px");
							$(".timeline-stage-name:lt(2)").addClass("current");							
						}else if(data.step == "3"){
							$(".timeline-current").css("width","240px");
							$(".timeline-stage-name").addClass("current");							
						}
					}
					
				}else{//没有成功取得交易信息
				}
			},
			error: function(){
				
			}
		})
	})
	</script>
</body>
</html>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0"/>
  <meta name="format-detection" content="telephone=no"/>
  <meta http-equiv="Cache-Control" content="no-transform"/>
  <meta name="layoutmode" content="standard"/>
  <meta name="renderer" content="webkit"/>
  <!--uc浏览器判断到页面上文字居多时，会自动放大字体优化移动用户体验。添加以下头部可以禁用掉该优化-->
  <meta name="wap-font-scale" content="no"/>
  <meta http-equiv="Pragma" content="no-cache"/>
  <title>悠米活期转入</title>
  <link type="text/css" rel="stylesheet" href="<%=basePath %>css/css.css"/>
  <link type="text/css" rel="stylesheet" href="<%=basePath %>css/modal.css"/>
  <script src="<%=basePath %>js/jquery-1.11.0.min.js"></script>
  <script src="<%=basePath %>js/common.js"></script>
  <script src="<%=basePath %>js/modal.js"></script>
  <script src="<%=basePath %>js/count.js"></script>
  <script>
    isCompute();//判断收益是否计算完成
  </script>
</head>

<body>
<div class="trade-class">
  <img src="<%=basePath %>images/index_09.png" width="40" alt=""/>
  悠米活期
</div>
<div class="trade-method">
 请选择转入方式:
</div>
<c:if test="${empty bi }">
  <a href="<%=basePath %>bankCardAction!loadUserBankInfo.action" class="pay-card">
    您还没有设置默认银行卡,请点击这里设置
  </a>
</c:if>
<c:if test="${!empty bi || !empty accounts }">
  <ul class="bank-info-container">
    <c:if test="${!empty bi }">
      <li class="bank-info">
        <p class="left"><span class="radio checked"></span></p>

        <p class="bank-logo2 left"><img src="<%=basePath %>images/${bi.bankPic }" width="36" alt=""/></p>

        <div class="left">
          <p class="bank-name">${bi.bank }</p>

          <p class="bank-num">${bi.tailNum }</p>
        </div>
        <div class="clear"></div>
      </li>
    </c:if>

    <c:forEach var="acc" items="${accounts }">
      <li class="bank-info" data-accId="${acc.accountID}" data-finaAccId="${acc.id}">
        <p class="left"><span class="radio"></span></p>

        <p class="bank-logo2 left"><img src="<%=basePath %>images/${acc.accountPic}" width="36" alt=""/></p>

        <div class="left">
          <p class="account-name">${acc.accountName}</p>
        </div>
        <div class="right">
          <p class="account-sum">可用：&yen;<span><fmt:formatNumber value="${acc.balance}" pattern="0.00"/></span></p>
        </div>
        <div class="clear"></div>
      </li>
    </c:forEach>
  </ul>
  <span id="maxAmount" style="display:none;"></span>
  <div class="common-input">
    <p class="input-title left">金额</p>
    <input class="withdraw-input" style="font-size: 2.2rem;" type="number" name="amount" placeholder="请输入转入金额(最少2元)"/>
    <p class="btn-all" style="display: none;">全部</p>
  </div>
  <div class="sub sub-recharge">
    <span class="checkbox-recharge checked-recharge"></span>
    我已阅读并同意<a id="agreement" data-username="${user.userName}" data-href="terms_hq.html">《悠米活期用户投资协议》</a>
  </div>
  <button type="button" class="recharge unclick">立即转入</button>
  <script>
    writeFooter(2, true);
    $(function () {
    	
      var isValue= false,//是否是合法值
        aim = 0,//转出的目标
        canAjax = false,
        agree = true;

      function canClick(_canAjax){//每次canAjax的值 改变之后才会用这个方法
        if(_canAjax){//由不能提交变成能提交
          if(!canAjax){
            canAjax = true;
            $(".recharge").removeClass("unclick");
          }
        }else{
          if(canAjax){//由能提交变成不能提交
            canAjax = false;
            $(".recharge").addClass("unclick");
          }
        }
      };

      function isLegal(_value,_aim){
        var pattern = /^[0-9]+(.[0-9]{0,2})?$/;
        if(pattern.test(_value) && Number(_value) >= 2){
          if(_aim != 0){
            if(Number(_value) <= Number($("#maxAmount").text())){
              isValue = true;
            }else {
              isValue = false;
            }
          }else{
            isValue = true;
          }
        }else{
          isValue = false;
        }
      };



      $("#agreement").on("touchend",function(){
        if(isValue){
          location.href= getContextPath() + "/"+ $(this).attr("data-href") +"?userId=" +$(this).attr("data-username")+"&amount="+$(".withdraw-input").val();
        }else	location.href= getContextPath() + "/"+ $(this).attr("data-href") +"?userId=" +$(this).attr("data-username");
      });

      $(".withdraw-input").keyup(function (){//判断输入的是否是合法值
        var getVal = $(this).val();

        isLegal(getVal,aim);

        if(agree && isValue){
          canClick(true);
        }else{
          canClick();
        };
      });

      $(".btn-all").on("touchend",function(){
        var getAll = $("#maxAmount").text();
        $(this).prev().val(getAll);
        isValue = true;//出现全部按钮，只能是定制！

        if(agree){
          canClick(true);
        }else{
          canClick();
        }
      });

      $(".checkbox-recharge").on("touchend", function () {//是否同意转入协议
        $(this).toggleClass("checked-recharge");
        agree==false?agree=true:agree=false;

        if (agree && isValue) canClick(true);
        else canClick();
      });

      $(".bank-info").on("touchend", function () {//选择转入方式
        if (!$(this).find(".radio").hasClass("checked")){
          $(".radio").removeClass("checked");
          $(this).find(".radio").addClass("checked");
          aim = $(".radio").index($(this).find(".radio"));
        };
        var getVal = $(".withdraw-input").val();
        if(aim !=0){
          $("#maxAmount").text($(".radio.checked").parent().next().next().next().find("span").text());//最大值给#maxAmount
          $(".btn-all").show();

          isLegal(getVal,aim);

          if(agree && isValue) canClick(true);
          else canClick();

        }else{//选择从银行转入
          $(".btn-all").hide();
          isLegal(getVal,aim);

          if(agree && isValue) canClick(true);
          else canClick();
        }
      });

      $(".recharge").on("touchend", function () {

        if (!canAjax) {//判断是否同意协议
          if (!isValue) {
            alert("请输入正确的转出金额！");
            return;
          } else {
            alert("请先同意《悠米活期用户投资协议》！");
            return;
          }
        }
        ;

        var getAmount = $("input[name='amount']").val();

        var url = "chongZhiAction!asseAmount.action",
          data = {"srcID": 200, "dstID": 400, "amount": getAmount},
          jumpHref = "pages/chongzhi-yanzheng.jsp";
        
        if($(".radio").index($(".radio.checked")) != 0){//银行卡之外的转入方式
          var getParent = $(".radio.checked").parents("li"),
          	  accId = getParent.attr("data-accId"),
              finaAccId = getParent.attr("data-finaAccId");

          url = "detail!transfer.action";
          data = {"srcID": accId, "dstID": 400, "finaAccId": finaAccId, "amount": getAmount, "accountID":400 };
          jumpHref = "pages/transferResult.jsp";
        };

        layer();//弹出加载中图片

        $.ajax({
          url: url,
          type: "post",
          data: data,
          success: function (data) {
            var data = stringToJson(data);
            switch (data.retcode) {
              case "0":
                location.href = jumpHref;
                break;
              case "1":
                alert("转入失败：" + data.retmessage);
                $("#layer").remove();
                break;
              case "2":
                $("body").createModal({
                  background: "#000",//设定弹窗之后的覆盖层的颜色
                  width: "260px",//设定弹窗的宽度
                  height: "168px",//设定弹窗的高度
                  resizable: false,//设定弹窗是否可以拖动改变大小
                  move: false,//规定弹窗是否可以拖动
                  bgClose: false,//规定点击背景是否可以关闭
                  html: "<div class='modal-promot-mess'>登录状态失效(太久未登录或在别处登录引起)</div>" +
                    "<p class='insure-btn-con'><span class='sure-btn'>重新登录</span></p>",
                  addFunction: function(){//增加的方法
                    $(".sure-btn").on("touchend",function(){
                      location.href = getContextPath() + "/login!logout.action";
                    });

                    $(".modal-close").on("touchend",function(){
                      $("#modal-container").remove();
                    });
                  }
                });
                break;
              case "501":
                alert("您的转出申请已提交，请耐心等待！");
                break;
              case "502":
                alert("本次操作已经结束！");
                location.href = getContextPath() + "/login!loadIndexPage.action";
                break;
              default:
                alert("修改失败！服务器抽风了，sorry！");//不知道服务器会不会抽风，出现这种情况
                $("#layer").remove();
                break;
            }
          },
          error: function () {
            alert("未知错误！请重新登录！");
            $("#layer").remove();
            location.href = getContextPath() + "/login!logout.action";
          }
        })
      });
    })
  </script>
</c:if>
</body>
</html>

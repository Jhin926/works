<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
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
  <title>悠米活期转出</title>
  <link type="text/css" rel="stylesheet" href="<%=basePath %>css/css.css"/>
  <link type="text/css" rel="stylesheet" href="<%=basePath %>css/modal.css"/>
  <script type="text/javascript" src="<%=basePath %>js/jquery-1.11.0.min.js"></script>
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
  请选择转出至:
</div>
<c:if test="${empty bankInfo }">
  <a href="<%=basePath%>bankCardAction!loadUserBankInfo.action" class="pay-card">您还没有设置默认银行卡,请点击这里设置</a>
</c:if>

<c:if test="${!empty bankInfo }">
  <ul class="bank-info-container">
    <li class="bank-info">
      <p class="left"><span class="radio checked">	<input type="radio" checked="checked" name="aim"
                                                           value="bank"/></span>
      </p>

      <p class="bank-logo2 left"><img src="<%=basePath %>images/${bankInfo.bankPic }" width="36" alt=""/></p>

      <div class="left">
        <p class="bank-name">${bankInfo.bank }</p>

        <p class="bank-num">${bankInfo.tailNum }</p>
      </div>
      <div class="clear"></div>
    </li>
    <li class="bank-info">
      <p class="left"><span class="radio"></span></p>

      <p class="bank-logo2 left"><img src="<%=basePath %>images/logo-custom.png" width="36" alt=""/></p>

      <div class="left"><p class="account-name">悠米定制</p></div>
      <p class="btn-limit">修改</p>

      <div class="clear"></div>
    </li>
  </ul>
  <form id="search" name="search" method="post" action="<%=basePath%>withdrawAction!asseAmount.action">
    <div class="common-input">
      <p class="input-title left">金额</p>
      <input id="withdrawAmount" style="width: 60%;font-size: 2.2rem;" class="withdraw-input" type="number"
             name="amount" placeholder="您最多可转出${withdrawalAmount }元"/>

      <p class="btn-all">全部</p>
    </div>
    <span id="maxAmount" style="display:none;">${withdrawalAmount }</span>

    <div class="sub sub-recharge" style="display: none;">
      <span class="checkbox-recharge checked-recharge"></span>
      我已阅读并同意<a id="agreement" data-username="${user.userName}" data-href="terms_hq.html">《悠米定制用户投资协议》</a>
    </div>
    <button type="button" id="with-draw" class="submit unclick">立即转出</button>
  </form>
</c:if>
<script>
  writeFooter(2, true);

  $(function () {

    var hasLimit = false;//是否已经选择期限
    var isValue= false,//是否是合法值
        aim = 0,//转出的目标
        canAjax = false;

    var getSearch = location.search.substring(1);
    if (getSearch.indexOf("timeLimit") >= 0) {//选择期限之后来的
      hasLimit = true;
      aim = 1;

      $(".btn-limit").show();
      $(".sub").show();
      $(".radio").removeClass("checked").eq(aim).addClass("checked");

      var getLimit = getSearch.substring(getSearch.indexOf("timeLimit") + 10);
      if (getLimit.indexOf("&") > 0) {
        getLimit = getLimit.substring(0, getLimit.indexOf("&"));
      }
      ;

      $(".account-name:last").text("悠米定制-" + getLimit + "天");

      $(".btn-limit").click(function (e) {
        e.preventDefault();//阻止向父元素传播，触发父元素事件
        location.href = "pages/custom-term.html" + location.search.substring(0, location.search.indexOf("timeLimit") - 1);
      });
    }
    ;

    function canClick(_canAjax){//每次canAjax的值 改变之后才会用这个方法
      if(_canAjax){//由不能提交变成能提交
        if(!canAjax){
          canAjax = true;
          $("#with-draw").removeClass("unclick");
        }
      }else{
        if(canAjax){//由能提交变成不能提交
          canAjax = false;
          $("#with-draw").addClass("unclick");
        }
      }
    };

    function isLegal(_value,_aim){
      var pattern = /^[0-9]+(.[0-9]{0,2})?$/;
      if(pattern.test(_value) && Number(_value)<=Number($("#maxAmount").text())){
        if(_aim != 0){
          if(Number(_value) >= 2){
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

    $("#withdrawAmount").keyup(function () {//判断输入的是否是合法值
      var getVal = $(this).val();

      if (aim == 0) {
        isLegal(getVal,aim);
        canClick(isValue);
      } else {
        isLegal(getVal,aim);
        if ($(".checkbox-recharge").hasClass("checked-recharge") && isValue) canClick(true);
        else canClick();
      }
    });

    $(".checkbox-recharge").on("touchend", function (){//是否同意协议
      $(this).toggleClass("checked-recharge");
      if ($(this).hasClass("checked-recharge") && isValue) canClick(true);
      else canClick();
    });

    $(".btn-all").on("touchend", function (){//全部转出
      var getAll = $("#maxAmount").text();
      $(this).prev().val(getAll);
      isValue = true;
      if(aim == 0) canClick(true);
      else {
        if($(".checkbox-recharge").hasClass("checked-recharge")) canClick(true);
        else canClick();
      }
    });

    $(".bank-info").on("touchend", function () {//选择转出方式
      if (!$(this).find(".radio").hasClass("checked")) {
        aim = $(".radio").index($(this).find(".radio"));
        $(".radio").removeClass("checked").eq(aim).addClass("checked");
      }
      ;

      var getVal = $("#withdrawAmount").val();
      if (aim != 0) {//选择的是定制账户
        $(".sub").show();
        isLegal(getVal,aim);
        if ($(".checkbox-recharge").hasClass("checked-recharge") &&  isValue) canClick(true);
        else canClick();

        if (!hasLimit) {//如果还没有选择期限
          location.href = "pages/custom-term.html" + location.search;
        }
        ;
      } else {//选择银行
        $(".sub").hide();
        isLegal(getVal,aim);

        if (isValue) canClick(true);
      }
      ;
    });

    $("#with-draw").on("touchend", withDraw);

    function withDraw() {
      if (!canAjax) {
        if (!isValue) {
          alert("请输入正确的转出金额！");
          return;
        } else {
          alert("请先同意《悠米定制用户投资协议》！");
          return;
        }
      }

      if (aim == 0) {//转出到银行卡
        $("#search").submit();
      } else {//转出到定制账户
        var getLimit = $(".account-name").text();
        var timeLimit = getLimit.substring(5, getLimit.length - 1);
        var data = {"srcID": 400, "dstID": 888, "timeLimit": timeLimit, "amount": $("#withdrawAmount").val(), "accountID": 400};

        layer();
        $.ajax({
          url: "detail!transfer.action",
          type: "post",
          data: data,
          success: function (data) {
            var data = stringToJson(data);

            switch (data.retcode) {
              case "0":
                location.href = "pages/transferResult.jsp";
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
        });
      }
    }
    ;
  });
</script>

</body>
</html>

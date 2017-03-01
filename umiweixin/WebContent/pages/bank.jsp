<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
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
  <title>添加银行卡</title>
  <link type="text/css" rel="stylesheet" href="<%=basePath%>css/css.css"/>
  <script type="text/javascript" src="<%=basePath%>js/jquery-1.11.0.min.js"></script>
  <script type="text/javascript" src="<%=basePath%>js/common.js"></script>
  <script src="<%=basePath %>js/modal.js"></script>
  <script src="<%=basePath %>js/count.js"></script>
</head>
<body>
<div id="main">
  <div class="demo">
    <ul class="nav">
      <li><span><img src="<%=basePath %>images/bg-btn3.png"/></span>
        <a href="javascript:;">选择银行卡<i>(目前仅支持借记卡)</i></a>
        <ul id="bank-list">
          <li>
            <div class="bank-logo" data-bank="BOC">
              <img src="<%=basePath %>images/bk-zg.png"/>
            </div>
            中国银行
          </li>
          <li>
            <div class="bank-logo" data-bank="ABC">
              <img src="<%=basePath %>images/bk-ny.png"/>
            </div>
            农业银行
          </li>
          <li>
            <div class="bank-logo" data-bank="CCB">
              <img src="<%=basePath %>images/bk-js.png"/>
            </div>
            建设银行
          </li>
          <li>
            <div class="bank-logo" data-bank="ICBC">
              <img src="<%=basePath %>images/bk-gs.png"/>
            </div>
            工商银行
          </li>
          <li>
            <div class="bank-logo" data-bank="CMB">
              <img src="<%=basePath %>images/bk-zs.png"/>
            </div>
            招商银行
          </li>
          <li>
            <div class="bank-logo" data-bank="CITIC">
              <img src="<%=basePath %>images/bk-zx.png"/>
            </div>
            中信银行
          </li>
          <li>
            <div class="bank-logo" data-bank="CMBC">
              <img src="<%=basePath %>images/bk-ms.png"/>
            </div>
            民生银行
          </li>
          <li>
            <div class="bank-logo" data-bank="GDB">
              <img src="<%=basePath %>images/bk-gf.png"/>
            </div>
            广东发展银行
          </li>
          <li>
            <div class="bank-logo" data-bank="CIB">
              <img src="<%=basePath %>images/bk-xy.png"/>
            </div>
            兴业银行
          </li>
          <li>
            <div class="bank-logo" data-bank="CEB">
              <img src="<%=basePath %>images/bk-gd.png"/>
            </div>
            光大银行
          </li>
          <li>
            <div class="bank-logo" data-bank="SPDB">
              <img src="<%=basePath %>images/bk-pf.png"/>
            </div>
            浦东发展银行
          </li>
          <li>
            <div class="bank-logo" data-bank="PSBC">
              <img src="<%=basePath %>images/bk-yc.png"/>
            </div>
            中国邮储银行
          </li>
          <li>
            <div class="bank-logo" data-bank="SZPAB">
              <img src="<%=basePath %>images/bk-pa.png"/>
            </div>
            平安银行
          </li>
          <li>
            <div class="bank-logo" data-bank="HXB">
              <img src="<%=basePath %>images/bk-hx.png"/>
            </div>
            华夏银行
          </li>
          <li>
            <div class="bank-logo" data-bank="BOS">
              <img src="<%=basePath %>images/bk-sh.png"/>
            </div>
            上海银行
          </li>
        </ul>
      </li>
    </ul>
  </div>
  <div class="bank-limit empty"></div>
  <form id="search" name="search" method="post"
        action="<%=basePath %>bankCardAction!bindingBankCard.action">
    <div class="common-input">
      <input type="tel" name="cardNo" placeholder="请输入银行卡号" onkeyup="formatBankNo(this)" onkeydown="formatBankNo(this)"/>
    </div>
    <div class="common-input">
      <input type="tel" name="phoneNo" placeholder="请输入银行预留手机号" maxlength="11"/>
    </div>
    <button class="submit" type="button">下一步</button>
  </form>
</div>

<script>
  writeFooter(3, true);
  $(function () {
    var bankName = null;
    var getStartX = 0, getStartY = 0, getEndX = 0, getEndY = 0;

    $(".nav > li").on("touchstart", function () {
      var getEvent = window.event || arguments.callee.caller.arguments[0];
      getStartX = getEvent.changedTouches[0].pageX;
      getStartY = getEvent.changedTouches[0].pageY;
    });

    $(".nav > li").on("touchend", function () {
      var getEvent = window.event || arguments.callee.caller.arguments[0];
      getEndX = getEvent.changedTouches[0].pageX;
      getEndY = getEvent.changedTouches[0].pageY;

      if (getEndX === getStartX && getEndY === getStartY) {
        $(this).children("ul").slideToggle(100);
        $(this).find("span > img").toggleClass("bank-open");
      };
    });


    $("#bank-list > li").on("touchend", function () {
      if ($(this).hasClass("xuanze")) return;

      var getEvent = window.event || arguments.callee.caller.arguments[0];
      getEndX = getEvent.changedTouches[0].pageX;
      getEndY = getEvent.changedTouches[0].pageY;

      if (getEndX === getStartX && getEndY === getStartY) {
        $(this).addClass("xuanze").siblings().removeClass("xuanze");
        bankName = $(this).children("div").attr("data-bank");
        $(this).parent().prev().html($(this).html());

        $.ajax({
          type: "post",
          data: {"bankCode": bankName},
          url: getContextPath() + "/bankCardAction!loadBankLimit.action",
          success: function (data) {
            var dataJson = JSON.parse(data);

            var bankLimit = '支付限额：首次' + dataJson.firstLimit +
              '元&nbsp;单笔' + dataJson.dayLimit +
              '&nbsp;单日' + dataJson.dayMaxLimit;
            $(".bank-limit").removeClass("empty").html(bankLimit);
          }
        });
      };
    });

    $(".submit").on("touchend", function () {
      var getCardNo = $("input[name='cardNo']").val();
      var getPhoneNo = $("input[name='phoneNo']").val();
      if (bankName === null) {
        alert("请先选择银行！");
        return;
      }

      if (getCardNo === "") {
        alert("银行卡号不能为空！");
        return;
      }

      if (!testPhone(getPhoneNo)) {
        return;
      }

      layer();

      $.ajax({
        type: "post",
        url: getContextPath() + "/bankCardAction!bindingBankCard.action",
        data: {"cardNo": getCardNo, "phoneNo": getPhoneNo, "bankCode": bankName},
        success: function (data) {
          var data = stringToJson(data);
          if (data.retcode === "0") {
            $("#layer").remove();
            location.href = getContextPath() + "/pages/bindingBankCard-yanzheng.jsp";
          } else if (data.retcode === "1") {
            $("#layer").remove();
            alert("绑卡失败：" + data.retmessage);
          }else if (data.retcode === "2") {
              $("#layer").remove();
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
            } else {
            $("#layer").remove();
            alert("服务器抽风中...sorry！");
          }
        },
        error: function () {
          alert("对不起！未知错误，请联系客服！");
        }
      })

    })
  });
</script>
</body>
</html>






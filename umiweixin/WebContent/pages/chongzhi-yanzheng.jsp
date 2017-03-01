<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>
<head>
  <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0"/>
  <meta name="format-detection" content="telephone=no"/>
  <meta http-equiv="Cache-Control" content="no-transform"/>
  <meta name="layoutmode" content="standard"/>
  <meta name="renderer" content="webkit"/>
  <!--uc浏览器判断到页面上文字居多时，会自动放大字体优化移动用户体验。添加以下头部可以禁用掉该优化-->
  <meta name="wap-font-scale" content="no"/>
  <meta http-equiv="Pragma" content="no-cache"/>
  <title>请输入验证码</title>
  <link type="text/css" rel="stylesheet" href="<%=basePath %>css/css.css"/>
  <script type="text/javascript" src="<%=basePath %>js/jquery-1.11.0.min.js"></script>
  <script type="text/javascript" src="<%=basePath %>js/common.js"></script>
  <script src="<%=basePath %>js/count.js"></script>
  <script>
    isCompute();//判断收益是否计算完成
  </script>
</head>

<body>
<div class="proving-user">账号：${user.userNameCT}</div>
<div class="common-input">
  <input type="tel" name="verCode" placeholder="请输入验证码" style="width: 65%;" class="left" maxlength="6"/>
  <input name="code-btn" type="button" value="30" class="resend-btn unclick right"/>
</div>
<button type="button" class="submit">确认</button>
<script type="text/javascript">
  writeFooter(2, true);
  var resendBtn = $("input[name='code-btn']");
  var maxResendTime = resendBtn.val();
  var resendTime = maxResendTime;

  var cd = setInterval(function () {

    if (resendTime <= 0) {
      resendTime = maxResendTime;
      resendBtn.val("重发").removeClass("unclick");
      clearInterval(cd);
      return;
    }

    resendTime--;
    resendBtn.val(resendTime);
  }, 1000);

  function resend() {
    if ($(this).hasClass("unclick")) return;

    $(this).addClass("unclick").val(resendTime);

    var reCd = setInterval(function () {
      if (resendTime <= 0) {
        resendBtn.val("重发").removeClass("unclick");
        clearInterval(reCd);
        return;
      }
      resendTime--;
      resendBtn.val(resendTime);
    }, 1000)

    $.ajax({
      type: "get",
      url: getContextPath() + "/chongZhiAction!getVerCode.action",
      success: function (data) {
        if (data === "0") {
          alert("短信发送成功，请注意查收!");
        } else if (data === "1") {
          alert("短信发送失败，请稍后重新发送！");
        }else if (data === "2") {
          alert("登录信息失效!");
          location.href = getContextPath() + "/login!logout.action";
        }else if (data === "502") {
          alert("本次操作已经结束，请返回首页!");
          location.href = getContextPath() + "/login!loadIndexPage.action";
        }
      }
    })
  }

  function doSubmit() {
    var verCode = $("input[name='verCode']").val();

    if (verCode == "") {
      alert("请输入验证码!");
      return;
    }

    layer();

    $.ajax({
      url: getContextPath() + "/chongZhiAction!verCode.action",
      type: "post",
      data: {"verCode": verCode},
      success: function (data1) {
        var data = stringToJson(data1);
        switch (data.retcode) {
          case "0":
            $("#layer").remove();
            location.href = "transferResult.jsp";
            break;
          case "104":
            $("#layer").remove();
            alert(data.retmessage);
            break;
          case "501":
            $("#layer").remove();
            alert("正在处理请稍后！");
            break;
          case "502":
            $("#layer").remove();
            alert("本次操作已经结束!");
            location.href = getContextPath() + "/login!loadIndexPage.action";
            break;
          case "2":
            location.href = getContextPath() + "/login!logout.action";
            break;
          default:
            $("#layer").remove();
            alert("修改失败！服务器抽风了，sorry！");//不知道服务器会不会抽风，出现这种情况
            break;
        }
      },
      error: function (i) {
        $("#layer").remove();
        alert("未知错误！请稍后重试！");
      }
    })
  }

  $(function () {
    $("button.submit").on("touchend", doSubmit);
    resendBtn.on("touchend", resend)
  })
</script>
</body>
</html>

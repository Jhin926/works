<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="utf-8"%>
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
  <title>转出</title>
  <link type="text/css" rel="stylesheet" href="<%=basePath %>css/css.css"/>
  <script type="text/javascript" src="<%=basePath %>js/jquery-1.11.0.min.js"></script>
  <script type="text/javascript" src="<%=basePath %>js/common.js"></script>
  <script src="<%=basePath %>js/count.js"></script>
  <script>
    isCompute();//判断收益是否计算完成
  </script>
</head>

<body>
<div class="withdraw">
  <div class="withdraw-class">从 ${finaAcc.accountName } 转出到 银行卡</div>
  <div class="withdraw-sum">${amount }元</div>
</div>
<form name="withdraw" method="post" action="<%=basePath %>withdrawAction!confirmPwd.action">
  <div class="common-input">
    <input name="cashPwd" type="password" placeholder="请输入6位支付密码" maxlength="6"/>
  </div>
  <button type="button" class="submit">确认</button>
</form>
<script>
  writeFooter(2, true);
  var getSubmit = document.getElementsByClassName("submit")[0];
  var isAjax = false;

  getSubmit.addEventListener("touchend", function () {
    var getPwd = document.getElementsByName("cashPwd")[0].value;
    if (!testPassword(getPwd)) return;//密码格式不正确，返回！
    if (!isAjax) {
      isAjax = true;
      layer();
      $.ajax({
        url: getContextPath() + "/withdrawAction!confirmPwd.action",
        type: "post",
        data: {"cashPwd": getPwd},
        success: function (data1) {
          var data = stringToJson(data1);
          isAjax = false;
          switch (data.retcode) {
            case "0":
              alert("转出成功！");
              location.href = "transferResult.jsp";
              break;
            case "1":
              alert("转出失败：" + data.retmessage);
              $("#layer").remove();
              break;
            case "201":
              alert("个人信息错误，请重新登录！");
              location.href = getContextPath() + "/login!logout.action";
              break;
            case "501":
              alert("您的转出申请已提交，请耐心等待！");
              break;
            case "502":
              alert("本次操作已经结束！");
              location.href = getContextPath() + "/login!loadIndexPage.action";
              break;
            case "503":
              alert(data.retmessage);
              location.href = getContextPath() + "/login!loadIndexPage.action";		//返回首页
              break;
            default:
              alert("修改失败！服务器抽风了，sorry！");//不知道服务器会不会抽风，出现这种情况
              $("#layer").remove();
              break;
          }
        },
        error: function (i) {
          alert("未知错误！请稍后重试！");
          $("#layer").remove();
          location.reload(true);
        }
      })
    }
  }, false);
</script>
</body>
</html>
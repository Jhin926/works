<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>充值处理中</title>
<script src="js/count.js"></script>
<script type="text/javascript">
	//获取根目录
	function getContextPath() {
		var pathName = document.location.pathname;
		var index = pathName.substr(1).indexOf("/");
		var result = pathName.substr(0, index + 1);
		return result;
	}

	function countDown(secs) {
		document.getElementById("jump").innerHTML = secs;
		if (--secs > 0) {
			setTimeout("countDown(" + secs + " )", 1000);
		} else {
			location.href = getContextPath() + "/login!loadIndexPage.action";
		}
	}
</script>
</head>
<body style="overflow: auto;" onload="javascript:countDown(3);">
	<center>
		<h1 style="font-size: 48px">处理中......</h1>
		<label style="font-size: 36px">页面将在<span id="jump" style="color: red"></span>秒后自动跳转到首页......</label>
	</center>
</body>
</html>
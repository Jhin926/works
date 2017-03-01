// JavaScript Document
// 验证手机号是否合法（11位不含字母的数字）
function testPhone(_phoneNum) {
	var unreg = new RegExp("[0-9]{11}");
	if (_phoneNum === "" || _phoneNum === undefined) {
		alert("手机号码不能为空");
		return false;
	} else {
		if (!(unreg.test(_phoneNum)) || _phoneNum.length > 11) {
			alert("请输入正确的11位手机号码！");
			return false;
		}
	}
	return true;
}

//验证支付密码是否合法
function testPayPwd(_payPwd) {
	var unreg = new RegExp("[0-9]{6}");
	if (_payPwd === "" || _payPwd === undefined) {
		alert("支付密码不能为空！");
		return false;
	} else {
		if (!(unreg.test(_payPwd)) || _payPwd.length > 11) {
			alert("请输入正确的6位纯数字支付密码！");
			return false;
		}
	}
	return true;
}

//验证密码是否合法（不少于6位）
function testPassword(_password) {
	if (_password === "") {
		alert("密码不能为空");
		return false;
	} else {
		if (_password.length < 6) {
			alert("请输入不少于6位的密码！");
			return false;
		}
	}
	return true;
}

//验证验证码是否合法（不少于4位）
function testCode(_code) {
	if (_code === "") {
		alert("验证码不能为空");
		return false;
	} else {
		if (_code.length != 4) {
			alert("请输入4位验证码！");
			return false;
		}
	}
	return true;
}

//判断是否是微信浏览器
function isWeiXin() {
	var ua = window.navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		return true;
	} else {
		return false;
	}
}

//判断身份证号是否合法
function isIdcard(num){
    num = num.toUpperCase();
    //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。
    if (!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(num))){
        alert('输入的身份证号长度不对，或者号码不符合规定！\n15位号码应全为数字，18位号码末位可以为数字或X。');
        return false;
    }
    //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
    //下面分别分析出生日期和校验位
    var len, re;
    len = num.length;
    if (len == 15){
        re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/);
        var arrSplit = num.match(re);

        //检查生日日期是否正确
        var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay){
            alert('输入的身份证号里出生日期不对！');
            return false;
        }else{
                //将15位身份证转成18位
                //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var nTemp = 0, i;
                num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
                for(i = 0; i < 17; i ++){
                    nTemp += num.substr(i, 1) * arrInt[i];
                }
                num += arrCh[nTemp % 11];
                return true;
        }
    }
    if (len == 18){
        re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/);
        var arrSplit = num.match(re);

        //检查生日日期是否正确
        var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]);
        var bGoodDay;
        bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4]));
        if (!bGoodDay)
        {
            alert('输入的身份证号里出生日期不对！');
            return false;
        }else{
        //检验18位身份证的校验码是否正确。
        //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。
        var valnum;
        var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
        var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
        var nTemp = 0, i;
        for(i = 0; i < 17; i ++){
            nTemp += num.substr(i, 1) * arrInt[i];
        }
        valnum = arrCh[nTemp % 11];
        if (valnum != num.substr(17, 1)){
            alert('18位身份证的校验码不正确！应该为：' + valnum);
            return false;
        }
        return true;
    }
    }
    return false;
}

//验证输入并格式化，银行卡号
function formatBankNo (BankNo){
    if (BankNo.value == "") return;
    var account = new String (BankNo.value);
    account = account.substring(0,24); /*帐号的总数, 包括空格在内 */
    if (account.match (".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null){
        /* 对照格式 */
        if (account.match (".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" +
                ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") == null){
            var accountNumeric = accountChar = "", i;
            for (i=0;i<account.length;i++){
                accountChar = account.substr (i,1);
                if (!isNaN (accountChar) && (accountChar != " ")) accountNumeric = accountNumeric + accountChar;
            }
            account = "";
            for (i=0;i<accountNumeric.length;i++){    /* 可将以下空格改为-,效果也不错 */
                if (i == 4) account = account + " "; /* 帐号第四位数后加空格 */
                if (i == 8) account = account + " "; /* 帐号第八位数后加空格 */
                if (i == 12) account = account + " ";/* 帐号第十二位后数后加空格 */
                if (i == 16) account = account + " ";/* 帐号第十六位后数后加空格 */
                account = account + accountNumeric.substr (i,1)
            }
        }
    }
    else
    {
        account = " " + account.substring (1,5) + " " + account.substring (6,10) + " " + account.substring (14,18) + "-" + account.substring(18,25);
    }
    if (account != BankNo.value) BankNo.value = account;
}

//限制输入金额只能是含有小数点的数字
function inputAmount(_this) {
	if((!_this.value.match(/^[\+\-]?\d*?\.?\d*?$/)) && !_this.t_value) _this.value='';//第一次输入，而且不是数字
	else if((!_this.value.match(/^[\+\-]?\d*?\.?\d*?$/)) && _this.t_value) _this.value=_this.t_value; //不是第一次输入，输入的不是数字，且已经含有数字
	else if(_this.value.match(/^[\+\-]?\d*?\.?\d*?$/)) _this.t_value=_this.value;//输入的是数字或者小数点
}

//json字符串转换成json对象
function stringToJson(_string){
	var json;
	try{
		json=Function('return '+_string)();
	} catch(e){
		location.href= getContextPath() +"/500.jsp";
	}
	return json;
}

//获取根目录
function getContextPath() {
	var pathName = document.location.pathname;
	var index = pathName.substr(1).indexOf("/");
	var result = pathName.substr(0, index + 1);
	return result;
}

function layer(){
	var layer = document.createElement("div"),
		layerInner = document.createElement("div"),
		image = document.createElement("img");

    var pageWidth = window.innerWidth,
        pageHeight = window.innerHeight;
    if (typeof pageWidth != "number"){
        if (document.compatMode == "CSS1Compat"){
            pageWidth = document.documentElement.clientWidth;
            pageHeight = document.documentElement.clientHeight;
        } else {
            pageWidth = document.body.clientWidth;
            pageHeight = document.body.clientHeight;
        }
    }    

    layer.id = "layer";
    layer.style.cssText = "position: absolute; width: 100%;height: 100%; left:0;top:0;z-index:99;";
    
    var cssStyle = "position:fixed;width: 88px;height: 88px; top: "+ (pageHeight-88)/2 +
    				"px; left: "+ (pageWidth-88)/2+"px; border-radius: 15px;"+
    				"background:url('" + getContextPath() + "/images/loading1.png') no-repeat center center rgba(0,0,0,.5); text-align:center;";
    layerInner.style.cssText = cssStyle;
    
    image.src = getContextPath() + "/images/loading2.png";
    image.style.cssText = "width: 70px;margin-top: 9px;animation: loading 2s linear infinite;-o-animation: loading 2s linear infinite;-webkit-animation: loading 2s linear infinite;-ms-animation: loading 2s linear infinite;-moz-animation: loading 2s linear infinite;";
    
    layerInner.appendChild(image);
    layer.appendChild(layerInner);
    
    document.body.appendChild(layer);
}

function writeFooter(_current,_isLink){
    var footer = document.createElement("footer"),
    	footerUl = document.createElement("ul"),
        liArr = [],
        footerNav=['<a href="/umiweixin/servlet/jumpActivityDispatch.servlet?pathCode=2"><p class="footer-ico footer-active"></p><p class="footer-text">活动中心</p></a>','<a href="/umiweixin"><p class="footer-ico footer-asset"></p><p class="footer-text">账户资产</p></a>','<a href="/umiweixin/pages/account.jsp"><p class="footer-ico footer-account"></p><p class="footer-text">我的账号</p></a>','<a href="/umiweixin/help.html"><p class="footer-ico footer-help"></p><p class="footer-text">常见问题</p></a>'];
    footerUl.className = "footer-nav";
    for(var i = 0; i<4;i++){
        liArr.push(document.createElement("li"));
    }
    switch (_current){
        case 1:
            liArr[0].className = "footer-current";
            if(!_isLink){
                footerNav[0] = '<p class="footer-ico footer-active"></p><p class="footer-text">活动中心</p>';
            }
            break;
        case 2:
            liArr[1].className = "footer-current";
            if(!_isLink){
                footerNav[1] = '<p class="footer-ico footer-asset"></p><p class="footer-text">账户资产</p>';
            }
            break;
        case 3:
            liArr[2].className = "footer-current";
            if(!_isLink){
                footerNav[2] = '<p class="footer-ico footer-account"></p><p class="footer-text">我的账号</p>';
            }
            break;
        case 4:
            liArr[3].className = "footer-current";
            if(!_isLink){
                footerNav[3] = '<p class="footer-ico footer-help"></p><p class="footer-text">常见问题</p>';
            }
            break;
        default :
            break;
    }
    
    for(var i = 0; i<4;i++){
        liArr[i].innerHTML = footerNav[i];
        footerUl.appendChild(liArr[i]);
    }
    footer.appendChild(footerUl);
    document.body.appendChild(footer);
}

function isCompute(){
    var ajaxObject;
    try{
      ajaxObject=new XMLHttpRequest();
    }catch(e){
      try{
        ajaxObject=new ActiveXObject('Microsoft.XMLHTTP');
      }catch(e){
      }
    }
    if(!ajaxObject) return;
    if(ajaxObject.overrideMimeType){
      ajaxObject.overrideMimeType('text/html');
    }
    
    ajaxObject.open('get',"login!judgeAccToday.action");
    ajaxObject.send(null);
    
    ajaxObject.onreadystatechange=function(){
    
      if (ajaxObject.readyState==4 && ajaxObject.status==200){
    	  if(ajaxObject.responseText == "1"){
    		location.href=getContextPath() + "/compute.html";
    	  }
      }
      
    };
  }

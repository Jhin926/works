	WEB_SOCKET_SWF_LOCATION = "WebSocketMain.swf";
	WEB_SOCKET_DEBUG = false;
	try {WebSocket.loadFlashPolicyFile("xmlsocket://" + host + ":10843");} catch (e) {}
	var host = window.location.host.split(":")[0];	
	var defaultUrl ="ws://" + host + ":8085/";
	var ws;
	function websocket(listener,url,group_id,user_id) {
		if(url == null || url==""){
			url = defaultUrl;
		}
		ws = new WebSocket(url);
	    ws.onopen = function () {
	    	console.log("websocket onOpen : "+ url);
	    };
	    ws.onmessage = function (e) {
	    	var data = e.data;
	    	var jsonObj = eval('('+e.data+')');
	    	if(jsonObj.type == 1){
	    		var connectionId = jsonObj.data;
	    		if(undefined == user_id){
	    			user_id = "";
	    		}
	    		var uuid = generateUUID();
	    		var message = "{\"id\":\""+ uuid  +"\",\"type\":1,\"data\":{\"id\":\""+ connectionId +"\",\"group_id\":\""+ group_id +"\",\"user_id\":\""+ user_id +"\"}}";
	    		ws.send(message);
	    	}else if(jsonObj.type == 2){
	    		//心跳包，不处理
	    		// console.log(jsonObj.data);
	    	}else if(jsonObj.type == 100){
	    		console.log(jsonObj);
	    		listener(jsonObj.data);
	    	}
	    };
	    ws.onclose = function () {
	    	console.log("websocket onClose : "+ url);
	    };
	    ws.onerror = function () {
	    	console.log("websocket onError : "+ url);
	    };
	}
	
	function send(data){
		var uuid = generateUUID();
		
		var message = "{\"id\":\""+ uuid  +"\",\"type\":100,\"data\":\""+ data +"\"}";
		ws.send(message);
	}
	
	function generateUUID() {
	    var s = [];
	    var hexDigits = "0123456789abcdef";
	    for (var i = 0; i < 36; i++) {
	        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
	    }
	    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
	    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
	    s[8] = s[13] = s[18] = s[23] = "-";

	    var uuid = s.join("");
	    return uuid;
	}

	
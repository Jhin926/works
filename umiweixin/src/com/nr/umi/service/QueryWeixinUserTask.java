package com.nr.umi.service;

import java.util.TimerTask;


import com.nr.umi.util.UrlConnectionTool;

public class QueryWeixinUserTask extends TimerTask{

	@Override
	public void run() {
		String url="http://localhost:8080/umiweixin/mainAction!queryAndSaveUserInfo.action";
		UrlConnectionTool.requestData(url);
	}

}

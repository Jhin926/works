package com.nr.umi.util;

import java.io.UnsupportedEncodingException;

import net.sf.json.JSONObject;

import com.nr.umi.bean.WechatToken;

public class ConnectUtil {
	public static JSONObject connect() {
		String ret = UrlConnectionTool.requestData(
				"https://api.weixin.qq.com/cgi-bin/token", 
				"grant_type=client_credential&appid=wx4b07bb9f614703fa&secret=6be06e1aa0fd8eba69c25aef94bc80ea", "GET");
		System.out.println(ret);
		JSONObject json = JSONObject.fromObject(ret);
		String access_token = json.getString("access_token");
		
		ret = UrlConnectionTool.requestData(
				"https://api.weixin.qq.com/cgi-bin/ticket/getticket", 
				"access_token=" + access_token + "&type=jsapi", "GET");
		json = JSONObject.fromObject(ret);
		System.out.println(ret);
		return json;
	}
	
	public static WechatToken share(String code,WechatToken wechatToken) {
		String appid = WeixinConfigurationUtil.getValue("AppID");
		String secret = WeixinConfigurationUtil.getValue("AppSecret");
		
		if((wechatToken == null || wechatToken.getTime() == 0 || wechatToken.getExpiresIn() == 0)) {
			String url = "https://api.weixin.qq.com/sns/oauth2/access_token";
			String params = "appid=" + appid + "&secret=" + secret + "&code=" + code + "&grant_type=authorization_code";
			
			String ret = UrlConnectionTool.requestData(url, params, "GET");
			JSONObject json = JSONObject.fromObject(ret);
			if(!json.containsKey("errcode")) {
				String access_token = json.getString("access_token");
				String openid = json.getString("openid");
				int expires_in = json.getInt("expires_in");
				String refresh_token = json.getString("refresh_token");
				
				wechatToken = new WechatToken();
				wechatToken.setAccessToken(access_token);
				wechatToken.setCode(code);
				wechatToken.setExpiresIn(expires_in);
				wechatToken.setOpenid(openid);
				wechatToken.setRefreshToken(refresh_token);
				wechatToken.setTime(System.currentTimeMillis());
			}
		}else if(System.currentTimeMillis() - wechatToken.getTime() > wechatToken.getExpiresIn() * 1000&&System.currentTimeMillis() - wechatToken.getTime()<=7*24*3600*1000){
			String url = "https://api.weixin.qq.com/sns/oauth2/refresh_token";
			String params = "appid=" + appid + "&grant_type=refresh_token&refresh_token=" + wechatToken.getRefreshToken();
			
			String ret = UrlConnectionTool.requestData(url, params, "GET");
			JSONObject json = JSONObject.fromObject(ret);
			if(!json.containsKey("errcode")) {
				String access_token = json.getString("access_token");
				String openid = json.getString("openid");
				int expires_in = json.getInt("expires_in");
				String refresh_token = json.getString("refresh_token");
				
				wechatToken.setAccessToken(access_token);
				wechatToken.setExpiresIn(expires_in);
				wechatToken.setOpenid(openid);
				wechatToken.setRefreshToken(refresh_token);
				wechatToken.setTime(System.currentTimeMillis());
			}
		}else if (System.currentTimeMillis() - wechatToken.getTime()>=7*24*3600*1000) {
			String url = "https://api.weixin.qq.com/sns/oauth2/access_token";
			String params = "appid=" + appid + "&secret=" + secret + "&code=" + code + "&grant_type=authorization_code";
			
			String ret = UrlConnectionTool.requestData(url, params, "GET");
			JSONObject json = JSONObject.fromObject(ret);
			if(!json.containsKey("errcode")) {
				String access_token = json.getString("access_token");
				String openid = json.getString("openid");
				int expires_in = json.getInt("expires_in");
				String refresh_token = json.getString("refresh_token");
				
				wechatToken = new WechatToken();
				wechatToken.setAccessToken(access_token);
				wechatToken.setCode(code);
				wechatToken.setExpiresIn(expires_in);
				wechatToken.setOpenid(openid);
				wechatToken.setRefreshToken(refresh_token);
				wechatToken.setTime(System.currentTimeMillis());
			}
		} else {
			return wechatToken;
		}
		
		
		String url = "https://api.weixin.qq.com/sns/userinfo";
		String params = "access_token=" + wechatToken.getAccessToken() + "&openid=" + wechatToken.getOpenid() + "&lang=zh_CN";
		String ret = UrlConnectionTool.requestData(url, params, "GET");
		System.out.println(ret);
		JSONObject json = JSONObject.fromObject(ret);
		try {
			wechatToken.setRet(json.toString().getBytes("gbk"));
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		/*String access_token = json.getString("access_token");
		
		ret = UrlConnectionTool.requestData(
				"https://api.weixin.qq.com/cgi-bin/ticket/getticket", 
				"access_token=" + access_token + "&type=jsapi", "GET");
		json = JSONObject.fromObject(ret);*/
		return wechatToken;
	}
}

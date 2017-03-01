package com.nr.umi.action;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.io.PrintWriter;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.apache.struts2.ServletActionContext;

import com.nr.umi.bean.UMIUser;
import com.nr.umi.bean.UserSession;
import com.nr.umi.bean.WechatToken;
import com.nr.umi.service.UmiService;
import com.nr.umi.util.ConnectUtil;
import com.nr.umi.util.Sign;
import com.opensymphony.xwork2.ActionSupport;
public class ShareAction extends ActionSupport {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Resource(name="umiService")
	private UmiService service;
	private String code;
	private String openid;
	private String shareUrl;
	
	public String getUrl() {
		return shareUrl;
	}

	public void setUrl(String url) {
		this.shareUrl = url;
	}
	public String getOpenid() {
		return openid;
	}

	public void setOpenid(String openid) {
		this.openid = openid;
	}
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public void share(){
		HttpServletResponse response = ServletActionContext.getResponse();
		HttpServletRequest request = ServletActionContext.getRequest();
		UserSession session = service.findSession();
		
		String jsapi_ticket = (String)session.getTicket();
		long timestamp = session.getFreshTime();
		if(jsapi_ticket == null || jsapi_ticket.equals("") || timestamp ==0 || System.currentTimeMillis() - timestamp > 7200000) {
			JSONObject json = ConnectUtil.connect();
			if(json.getString("errcode").equals("0")) {
				jsapi_ticket = json.getString("ticket");
				session.setTicket(jsapi_ticket);
				session.setFreshTime(System.currentTimeMillis());
				service.addOrUpdate(session);
			}else {
				try {
					response.getWriter().write(0);
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		if(shareUrl == null) {
			shareUrl = (String)request.getAttribute("shareUrl");
		}
		if(shareUrl == null || shareUrl.equals("")) {
			shareUrl = "http://www.umibank.com:8080/umiweixin/turntable/wxtest/index.html";
		}
		
		Map<String, String> result = Sign.sign(jsapi_ticket, shareUrl);
		JSONObject js = JSONObject.fromObject(result);
		
		try {
			response.getWriter().write(js.toString());
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	public void shareW(){
		
		HttpServletResponse response = ServletActionContext.getResponse();
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpSession session = request.getSession();
		UMIUser user = (UMIUser)session.getAttribute("user");
		code = (String)request.getAttribute("code");
		WechatToken wechatToken = null;
		if(user != null) {
			wechatToken = service.findWechatTokenByUserID(user.getId());
			if(wechatToken == null) {
				wechatToken = ConnectUtil.share(code,null);
			}else if(System.currentTimeMillis() - wechatToken.getTime() > wechatToken.getExpiresIn() * 1000){
				wechatToken = ConnectUtil.share(code,wechatToken);
			}
		}else {
			wechatToken = ConnectUtil.share(code,null);
		}
		wechatToken.setUserID(user.getId());
		byte[] ret = wechatToken.getRet();
		String rett = null;
		if(ret != null) {
			try {
				rett = new String(ret,"gbk");
				request.setCharacterEncoding("utf-8");
				response.setContentType("text/html;charset=utf-8");
				response.setHeader("Cache-Control", "no-cache"); 
				PrintWriter out = response.getWriter();   
				out.print(rett);
				out.flush();
				out.close();
				service.addOrUpdate(wechatToken);
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
	public void shareLink() {
		
		HttpServletResponse response = ServletActionContext.getResponse();
		HttpServletRequest request = ServletActionContext.getRequest();
		openid = (String)request.getAttribute("openid");		
		WechatToken wechatToken = service.findWechatTokenByOpenID(openid);
		
		byte[] ret = wechatToken.getRet();
		String rett = null;
		if(ret != null) {
			try {
				rett = new String(ret,"gbk");
				JSONObject json = JSONObject.fromObject(rett);
				double amount = service.queryFreezedAmount(wechatToken.getUserID());
				json.put("amount", amount);
				String result = json.toString();
				request.setCharacterEncoding("utf-8");
				response.setContentType("text/html;charset=utf-8");
				response.setHeader("Cache-Control", "no-cache"); 
				PrintWriter out = response.getWriter();
				out.print(result);
				out.flush();
				out.close();
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
}

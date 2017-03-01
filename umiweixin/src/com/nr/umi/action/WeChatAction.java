package com.nr.umi.action;

import java.util.Date;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

import com.nr.umi.bean.UMIUser;
import com.nr.umi.bean.User;
import com.nr.umi.service.UmiService;
import com.nr.umi.service.WeChatService;
import com.nr.umi.util.CutStringUtil;
import com.nr.umi.util.IPUtil;
import com.nr.umi.util.TokenUtil;
import com.opensymphony.xwork2.ActionContext;

import net.sf.json.JSONObject;

/**
 * 微信客户通过公众号访问umiweixin
 * 
 * @author yi.yuan
 *
 *         Established in 2015年11月3日
 */
public class WeChatAction {
	@Resource
	private WeChatService weChatService;
	@Resource
	private UmiService umiService;

	Logger logger = Logger.getLogger(WeChatAction.class);
	/*
	 * 该uri用于提供给微信
	 */
	public String accessChannel() {
		System.out.println(new Date() + "...com.nr.umi.action.WeChatAction.accessChannel()...");
		HttpServletRequest request = ServletActionContext.getRequest();
		Map<String, Object> session = ActionContext.getContext().getSession();

		if (code == null) {
			session.put("wechatMessage", "微信信息获取失败,请重新返回微信授权");
			return "error";
		}

		// 拉取到的微信用户信息
		JSONObject retObj = JSONObject.fromObject(weChatService.getAccess_token(code));
		if (retObj.containsKey("errcode")) {
			session.put("wechatMessage", "微信信息获取失败,请重新返回微信授权");
			return "error";
		}

		String access_token = retObj.getString("access_token");
		String openId = retObj.getString("openid");
		String weChatUserInfo = weChatService.getWeChatUserInfo(access_token, openId);
		if (weChatUserInfo.contains("errcode")) {
			logger.error("拉取微信用户个人信息失败,返回内容： " + weChatUserInfo + " ; 用户openId为:" + openId);
		}
		weChatUserInfo = weChatService.filterEmoji(weChatUserInfo);

		JSONObject wechat_info = new JSONObject();
		wechat_info.put("openId", openId);
		// 设置微信用户信息,没有进行二进制字节流转换
		wechat_info.put("weChatUserInfo", weChatUserInfo);
		session.put("wechat_info", wechat_info);

		// String openId="oGPTQvrcRQnslYj0NKLpL2OoFxTE";
		User weChat_user = weChatService.queryUserByOpenId(openId);
		// 如果不存在 umi <——> user 关联关系 或者 关联关系中的umiId为0,则跳转到登录页面
		if (weChat_user == null || weChat_user.getUmiId() == 0) {
			return "unbounded";
		}
		UMIUser user = umiService.findUserByID(weChat_user.getUmiId() + "");
		if (user == null) {
			return "unbounded";
		}
		// 已经绑定过,则更新微信用户信息;否则,不更新
		weChat_user.setRet(weChatUserInfo.getBytes());
		weChatService.saveOrUpdate(weChat_user);

		user.setToken(TokenUtil.getToken(user.getId()));
		user.setLastLogonIP(IPUtil.getLocalIp(request));
		user = (UMIUser) umiService.addOrUpdate(user);

		user.setUserNameCT(CutStringUtil.getHidePhone(user.getUserName().trim()));
		session.put("user", user);
		return "bounded";
	}

	private String code;
	private String state;

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

}

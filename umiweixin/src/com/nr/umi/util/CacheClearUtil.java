package com.nr.umi.util;

import java.util.Enumeration;
import java.util.Map;

import javax.servlet.http.HttpSession;

/**
 * 
 * @author yi.yuan
 *
 *         Established in 2015年10月13日
 * 			<br />
 *         清理缓存工具类
 */
public class CacheClearUtil {

	/**
	 * 清理HttpSession中的除了user和wechat_info对象以外的其他对象,<br />
	 * wechat_info是微信用户的相关信息json对象,<br />
	 * 主要包括openId、微信用户个人信息weChatUserInfo,均以字符串类型保存
	 */
	public static void clearOtherSession(HttpSession session) {
		Enumeration<String> objs = session.getAttributeNames();
		String keyName = null;
		while (objs.hasMoreElements()) {
			keyName = objs.nextElement();
			if (!"user".equals(keyName) && !"wechat_info".equals(keyName)) {
				session.removeAttribute(keyName);
			}
		}
	}

	/**
	 * 清理HttpSession中的除了user和wechat_info对象以外的其他对象,<br />
	 * wechat_info是微信用户的相关信息json对象,<br />
	 * 主要包括openId、微信用户个人信息weChatUserInfo,均以字符串类型保存
	 */
	public static void clearSession(HttpSession session) {
		Enumeration<String> objs = session.getAttributeNames();
		String keyName = null;
		while (objs.hasMoreElements()) {
			keyName = objs.nextElement();
			if (!"wechat_info".equals(keyName)) {
				session.removeAttribute(keyName);
			}
		}
	}

	/**
	 * 清理struts封装好的Map类型的session,除了user和wechat_info对象以外的其他对象,<br />
	 * wechat_info是微信用户的相关信息json对象,<br />
	 * 主要包括openId、微信用户个人信息weChatUserInfo,均以字符串类型保存
	 */
	public static void clearOtherSession(Map<String, Object> session) {
		Object user = session.get("user");
		Object wechat_info = session.get("wechat_info");
		session.clear();
		session.put("user", user);
		session.put("wechat_info", wechat_info);
	}

	/**
	 * 清理struts封装好的Map类型的session,除了user和wechat_info对象以外的其他对象,<br />
	 * wechat_info是微信用户的相关信息json对象,<br />
	 * 主要包括openId、微信用户个人信息weChatUserInfo,均以字符串类型保存
	 */
	public static void clearSession(Map<String, Object> session) {
		Object wechat_info = session.get("wechat_info");
		session.clear();
		session.put("wechat_info", wechat_info);
	}
}

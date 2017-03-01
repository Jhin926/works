package com.nr.umi.service;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import com.nr.umi.bean.UMIUser;
import com.nr.umi.bean.User;
import com.nr.umi.constants.WebConstant;
import com.nr.umi.dao.WeChatDao;
import com.nr.umi.util.UrlConnectionTool;

import net.sf.json.JSONObject;

public class WeChatService {
	@Resource
	private WeChatDao weChatDao;
	/**
	 * 根据code获取唯一标识符openId
	 * @param code
	 * @return 返回json字符串.<br />
	 * 		   retcode为  1 表示失败  ; 0 表示成功
	 */
	public String getOpenId(String code) {
		System.out.println("com.nr.umi.service.WeChatService.getOpenId(String code)....");
		String wechatRet=this.getAccess_token(code);
		JSONObject json=JSONObject.fromObject(wechatRet);
		if(wechatRet.contains("errcode")){
			System.out.println(wechatRet);
			return "{\"retcode\":\"1\",\"retmessage\":\"" + json.getString("errmsg") + "\"}";
		}
		return "{\"retcode\":\"0\",\"retmessage\":\"" + json.getString("openid") + "\"}";
	}
	
	/**
	 * step2:获取用户基本信息,获取access_token
	 * 
	 * @return
	 * 	访问成功返回 : { "access_token":"ACCESS_TOKEN", "expires_in":7200,
	 *              "refresh_token":"REFRESH_TOKEN", "openid":"OPENID",
	 *              "scope":"SCOPE", "unionid": "o6_bmasdasdsad6_2sgVt7hMZOPfL"}<br /> <br />
	 *  访问失败返回eg: {"errcode":40029,"errmsg":"invalid code"}
	 */
	public String getAccess_token(String code) {
		StringBuffer url = new StringBuffer();
		url.append("https://api.weixin.qq.com/sns/oauth2/access_token");
		url.append("?appid=" + WebConstant.APPID);
		url.append("&secret=" + WebConstant.APPSECRET);
		url.append("&code=" + code);
		url.append("&grant_type=authorization_code");
		return UrlConnectionTool.requestData(url.toString());
	}
	
	/**
	 * step3:获取用户基本信息,根据refresh_token刷新access_token
	 * 
	 * @return 
	 * 访问成功返回 : { "access_token":"ACCESS_TOKEN", "expires_in":7200,
	 *         		"refresh_token":"REFRESH_TOKEN", "openid":"OPENID",
	 *         		"scope":"SCOPE" }<br /><br />
	 * 访问失败返回eg:  {"errcode":40029,"errmsg":"invalid code"}
	 */
	public String refreshAccess_token(String refresh_token) {
		StringBuffer url = new StringBuffer();
		url.append("https://api.weixin.qq.com/sns/oauth2/refresh_token");
		url.append("?appid=" + WebConstant.APPID);
		url.append("&grant_type=refresh_token");
		url.append("&refresh_token=" + refresh_token);
		return UrlConnectionTool.requestData(url.toString());
	}
	
	/**
	 * step4: 拉取微信用户的信息
	 * @param access_token 凭证
	 * @param openid 用户的唯一标识
	 * @return
	 * 访问成功返回 : json对象	<br />
	 * 访问失败返回eg:  {"errcode":40003,"errmsg":" invalid openid "}
	 */
	public String getWeChatUserInfo(String access_token, String openid) {
		StringBuffer url = new StringBuffer();
		url.append("https://api.weixin.qq.com/sns/userinfo");
		url.append("?access_token=" + access_token);
		url.append("&openid=" + openid);
		url.append("&lang=zh_CN");
		return UrlConnectionTool.requestData(url.toString());
	}
	
	/**
	 * 过滤微信用户信息中的特殊字符
	 */
	public String filterEmoji(String source) {  
        if(StringUtils.isNotBlank(source)){  
            return source.replaceAll("[\\ud800\\udc00-\\udbff\\udfff\\ud800-\\udfff]", "");  
        }else{  
            return source;  
        }  
    }  
	
	/**
	 * 校验access_token是否有效
	 * @param access_token
	 * @param openid
	 * @return
	 * 校验成功返回 :  { "errcode":0,"errmsg":"ok"}
	 * 											<br />
	 * 校验失败返回:  { "errcode":40003,"errmsg":"invalid openid"}
	 */
	public String inspectToken(String access_token, String openid){
		StringBuffer url = new StringBuffer();
		url.append("https://api.weixin.qq.com/sns/auth");
		url.append("?access_token=" + access_token);
		url.append("&openid=" + openid);
		return UrlConnectionTool.requestData(url.toString());
	}
	
	/**
	 * 根据openId查找该微信用户是否已经与umi用户绑定
	 * @param openId
	 */
	public User queryUserByOpenId(String openId) {
		return weChatDao.queryUserByOpenId(openId);
	}

	/**
	 * 将微信账号与umi账号绑定
	 * @param openId 微信用户唯一标识符
	 * @param uimId	 umi用户
	 */
	public void bindWeChat(String openId, Integer umiId) {
		this.updateUser(umiId, openId);
		User user = weChatDao.getUserByuimId(umiId);
		if (user == null) {
			user = new User();
			user.setUmiId(umiId);
		}
		user.setWenXinNo(openId);
		this.saveOrUpdate(user);
	}

	/**
	 *  更新user
	 * @param user
	 * @return
	 */
	public Object saveOrUpdate(User user) {
		return weChatDao.saveOrUpdate(user);
	}

	/**
	 * 解除微信用户与umi用户之间的关联关系
	 * @param uimId		umi用户
	 * @param openId	
	 */
	public void updateUser(Integer uimId, String openId) {
		weChatDao.unbindContact(uimId,openId);
	}

	/**
	 * 绑定微信,将悠米账户id保存到 悠米——微信 表中
	 * @param user
	 * @param wetChatUser
	 */
	public void bindWeChat(UMIUser user, User wetChatUser) {
		this.updateUser(user.getId(), wetChatUser.getWenXinNo());
		User wet_user = weChatDao.getUserByuimId(user.getId());
		if (wet_user == null) {
			this.saveOrUpdate(wetChatUser);
		} else {
			wet_user.setWenXinNo(wetChatUser.getWenXinNo());
			wet_user.setRet(wetChatUser.getRet());
			this.saveOrUpdate(wet_user);
		}
	}
}

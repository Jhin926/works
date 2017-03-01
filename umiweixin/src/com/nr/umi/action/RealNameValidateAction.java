package com.nr.umi.action;

import java.io.IOException;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;

import com.nr.umi.bean.UMIUser;
import com.nr.umi.service.UmiService;
import com.nr.umi.util.CacheClearUtil;
import com.nr.umi.util.SinaUtil;
import com.opensymphony.xwork2.ActionContext;

import net.sf.json.JSONObject;

public class RealNameValidateAction {
	@Resource
	private UmiService umiService;

	private UMIUser user;

	public void validateID() {
		Map<String, Object> session = ActionContext.getContext().getSession();
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("UTF-8");
		user = (UMIUser) session.get("user");
		try {
			if (user == null) {
				CacheClearUtil.clearSession(session);
				response.getWriter().print("{\"retcode\":\"2\"}");
				return;
			}
			if (!session.containsKey("realNameVerifyToken")) {
				request.setAttribute("validateID_message", "本次实名认证操作已结束,请返回首页!");
				response.getWriter().print("{\"retcode\":\"3\",\"retmessage\":\"本次实名认证操作已结束,请返回首页!\"}");
				return;
			}
		} catch (IOException e) {
			e.printStackTrace();
			return;
		}
		String identityCard = request.getParameter("identityCard");
		String name = request.getParameter("name");
		JSONObject ic_json = new JSONObject();
		ic_json.put("identityCard", identityCard);
		ic_json.put("name", name);
		String retStr = SinaUtil.realNameVerify(umiService, user, ic_json);
		JSONObject retObj = JSONObject.fromObject(retStr);
		try {
			if (retObj.getInt("retcode") == 0) {
				System.out.println("验证成功!");
				response.getWriter().print("{\"retcode\":\"0\",\"retmessage\":\"验证成功!\"}");
			} else {
				System.out.println("验证失败:" + retObj.getString("retmessage"));
				response.getWriter()
						.print("{\"retcode\":\"1\",\"retmessage\":\"" + retObj.getString("retmessage") + "\"}");
				return;
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		user = umiService.findUserByID(user.getId() + "");
		CacheClearUtil.clearSession(session);
		session.put("user", user);
		return;
	}
}

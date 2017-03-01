package com.nr.umi.action;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.struts2.ServletActionContext;

import com.nr.umi.bean.UMIUser;
import com.nr.umi.service.UmiService;
import com.nr.umi.util.CacheClearUtil;
import com.nr.umi.util.CreateCheckCode;
import com.nr.umi.util.MD5;

import net.sf.json.JSONObject;

public class PwdManageAction {
	
	@Resource(name = "umiService")
	private UmiService service;
	private String pwdManageAction_message;

	public String pwdManage() throws Exception {
		System.out.println("com.nr.umi.action.PwdManageAction.pwdManage()()...");
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpSession session = request.getSession();
		CacheClearUtil.clearOtherSession(session);
		UMIUser user = (UMIUser) session.getAttribute("user");
		if (user == null) {
			return "userIsNull";
		}
		String pwdType = null;
		pwdType = request.getParameter("pwdType");
		if (pwdType == null || pwdType.equals("")) {
			return "pwdManage";
		} 
		pwdType=pwdType.trim();
		//支付密码修改
		if (pwdType.equals("1")) {
			return "payPwd";
		//登录密码修改
		} else if (pwdType.equals("2")) {
			return "loginPwd";
		//支付密码设置
		} else if (pwdType.equals("3")) {
			if (user.getCashPwd() != null && !user.getCashPwd().equals("")) {
				return "payPwd";
			}
			return "payPwdSet";
		} else {
			return "error";
		}
	}
	
	/**
	 *  设置支付密码
	 * @throws IOException 
	 */
	public void payPwdSet() throws IOException {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response= ServletActionContext.getResponse();
		response.setCharacterEncoding("UTF-8");
		HttpSession session = request.getSession();
		UMIUser user = (UMIUser) session.getAttribute("user");
		if (user == null) {
			response.getWriter().print("{\"retcode\":\"201\",\"retmessage\":\"个人信息有误,请重新登录!\"}");
			return ;
		}
		String cashPwd = request.getParameter("cashPwd");
		if (cashPwd == null || cashPwd.equals("")) {
			pwdManageAction_message = "支付密码设置失败,请重新输入密码";
			response.getWriter().print("{\"retcode\":\"101\",\"retmessage\":\"支付密码不能为空!\"}");
			return ;
		}
		cashPwd = MD5.getMD5Code(cashPwd.trim());
		user.setCashPwd(cashPwd);
		user=(UMIUser) service.addOrUpdate(user);
		pwdManageAction_message = "支付密码设置成功";
		session.setAttribute("user", user);
		session.setAttribute("pwdManageAction_message", pwdManageAction_message);
		System.out.println(pwdManageAction_message);
		response.getWriter().print("{\"retcode\":\"0\"}");
		return ;

	}
	
	/**
	 *  修改支付密码
	 * @throws IOException 
	 */
	public void payPwdUpdate() throws IOException {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response= ServletActionContext.getResponse();
		response.setCharacterEncoding("UTF-8");
		HttpSession session = request.getSession();
		UMIUser user = (UMIUser) session.getAttribute("user");
		if (user == null) {
			response.getWriter().print("{\"retcode\":\"201\",\"retmessage\":\"个人信息有误,请重新登录!\"}");
			return;
		}
		String oldPwd = request.getParameter("oldPwd");
		String newPwd = request.getParameter("newPwd");
		if (oldPwd == null || "".equals(oldPwd.trim()) || newPwd == null || "".equals(newPwd.trim())) {
			response.getWriter().print("{\"retcode\":\"101\",\"retmessage\":\"支付密码不能为空!\"}");
			return;
		}
		oldPwd = MD5.getMD5Code(oldPwd.trim());
		newPwd = MD5.getMD5Code(newPwd.trim());
		String password = user.getCashPwd();
		if (!password.equals(oldPwd)) {
			pwdManageAction_message = "修改失败,您所输入的旧支付密码不正确";
			response.getWriter().print("{\"retcode\":\"102\",\"retmessage\":\"原来支付密码不正确!\"}");
			return ;
		}
		user.setCashPwd(newPwd);
		user=(UMIUser) service.addOrUpdate(user);
		pwdManageAction_message = "密码修改成功";
		session.setAttribute("user", user);
		session.setAttribute("pwdManageAction_message", pwdManageAction_message);
		response.getWriter().print("{\"retcode\":\"0\"}");
		System.out.println(pwdManageAction_message);
		return ;

	}
	
	/**
	 * 重置支付密码
	 * @throws IOException 
	 */
	@SuppressWarnings("unchecked")
	public void resetPayPwd() throws IOException {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response= ServletActionContext.getResponse();
		response.setCharacterEncoding("UTF-8");
		HttpSession session = request.getSession();
		UMIUser user = (UMIUser) session.getAttribute("user");
		if (user == null) {
			response.getWriter().print("{\"retcode\":\"201\",\"retmessage\":\"个人信息有误,请重新登录\"}");
			return ;
		}
		String yzm = request.getParameter("yzm");
		String userName = request.getParameter("phoneNo");
		String password = request.getParameter("password");
		Map<String, Object> map = (Map<String, Object>) session.getAttribute(userName);
		String checkCode = (String) map.get("checkCode");
		long checkTime = (long) map.get("checkTime");
		userName = (String) map.get("phoneNo");
		UMIUser userTemp = service.userCheck(userName);
		if (userTemp == null) {
			pwdManageAction_message = "支付密码重置失败,错误原因:该手机号码尚未注册!";
			response.getWriter().print("{\"retcode\":\"301\",\"retmessage\":\"该手机号码尚未注册,请注册\"}");
			return ;
		} else if (!yzm.equals(checkCode)) {
			pwdManageAction_message = "支付密码重置失败,错误原因:验证码出错!";
			response.getWriter().print("{\"retcode\":\"401\",\"retmessage\":\"验证码出错\"}");
			return ;
		} else if ((System.currentTimeMillis() - checkTime) > 300000 || checkCode == null) {
			pwdManageAction_message = "支付密码重置失败,错误原因:验证码超时!";
			response.getWriter().print("{\"retcode\":\"402\",\"retmessage\":\"验证码超时\"}");
			return ;
		} else {
			user.setCashPwd(MD5.getMD5Code(password));
			user = (UMIUser) service.addOrUpdate(user);
			session.setAttribute("user", user);
			pwdManageAction_message = "支付密码重置成功";
			response.getWriter().print("{\"retcode\":\"0\"}");
		}
		session.setAttribute("pwdManageAction_message", pwdManageAction_message);
		System.out.println(pwdManageAction_message);
		return ;
	}
	
	
	
	/**
	 *  修改登录密码
	 * @throws IOException 
	 */
	public void loginPwdUpdate() throws IOException {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response= ServletActionContext.getResponse();
		response.setCharacterEncoding("UTF-8");
		HttpSession session = request.getSession();
		UMIUser user = (UMIUser) session.getAttribute("user");
		if (user == null) {
			response.getWriter().print("{\"retcode\":\"201\",\"retmessage\":\"个人信息有误,请重新登录\"}");
			return ;
		}
		String oldPwd = request.getParameter("oldPwd");
		String newPwd = request.getParameter("newPwd");
		if (oldPwd == null || "".equals(oldPwd.trim()) || newPwd == null || "".equals(newPwd.trim())) {
			response.getWriter().print("{\"retcode\":\"101\",\"retmessage\":\"登录密码不能为空!\"}");
			return ;
		}
		oldPwd = MD5.getMD5Code(oldPwd.trim());
		newPwd = MD5.getMD5Code(newPwd.trim());
		String password = user.getPassword();
		if (!password.equals(oldPwd)) {
			pwdManageAction_message = "修改失败,您所输入的老登录密码不正确";
			response.getWriter().print("{\"retcode\":\"102\",\"retmessage\":\"原来登录密码不正确!\"}");
			return ;
		}
		user.setPassword(newPwd);
		user=(UMIUser) service.addOrUpdate(user);
		pwdManageAction_message = "密码修改成功";
		session.setAttribute("user", user);
		session.setAttribute("pwdManageAction_message", pwdManageAction_message);
		response.getWriter().print("{\"retcode\":\"0\"}");
		System.out.println(pwdManageAction_message);
		return ;
	}

	/**
	 * 重置登录密码 <br />
	 * 不需要将user放到session中
	 * @throws IOException 
	 */
	@SuppressWarnings("unchecked")
	public void resetLoginPassword() throws IOException {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response= ServletActionContext.getResponse();
		response.setCharacterEncoding("UTF-8");
		HttpSession session = request.getSession();
		String yzm = request.getParameter("yzm");
		String userName = request.getParameter("phoneNo");
		String password = request.getParameter("password");
		if (yzm == null || yzm.equals("") || userName == null || userName.equals("") || password == null
				|| password.equals("")) {
			response.getWriter().print("{\"retcode\":\"101\",\"retmessage\":\"输入的数据有误\"}");
			return ;
		}
		Map<String, Object> map = (Map<String, Object>) session.getAttribute(userName);
		String checkCode = (String) map.get("checkCode");
		long checkTime = (long) map.get("checkTime");
		userName = (String) map.get("phoneNo");
		UMIUser user = service.userCheck(userName);
		if (user == null) {
			pwdManageAction_message = "登录密码重置失败,错误原因:该手机号码尚未注册,请先注册";
			response.getWriter().print("{\"retcode\":\"301\",\"retmessage\":\"该手机号码尚未注册,请注册\"}");
			return ;
		} else if (!yzm.equals(checkCode)) {
			pwdManageAction_message = "登录密码重置失败,错误原因:验证码出错!";
			response.getWriter().print("{\"retcode\":\"401\",\"retmessage\":\"验证码出错\"}");
			return ;
		} else if ((System.currentTimeMillis() - checkTime) > 300000 || checkCode == null) {
			pwdManageAction_message = "登录密码重置失败,错误原因:验证码超时!";
			response.getWriter().print("{\"retcode\":\"402\",\"retmessage\":\"验证码超时\"}");
			return ;
		} else {
			user.setPassword(MD5.getMD5Code(password));
			service.addOrUpdate(user);
			pwdManageAction_message = "登录密码重置成功";
			response.getWriter().print("{\"retcode\":\"0\"}");
		}
		session.setAttribute("pwdManageAction_message", pwdManageAction_message);
		System.out.println(pwdManageAction_message);
		return ;
	}
	
	/**
	 * 重置密码,获取验证码
	 */
	public void getResetPwdCode() {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("UTF-8");
		HttpSession session = request.getSession();
		String phoneNo = (String) request.getParameter("phoneNo");

		UMIUser user = service.userCheck(phoneNo);

		if (user == null) {
			try {
				response.getWriter().print("{\"retcode\":\"0\"}");
				return;
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		JSONObject resJSON = CreateCheckCode.sendCheckCode(phoneNo);
		String statusCode = resJSON.getString("statusCode");

		try {
			if (statusCode.equals("000000")) {
				Map<String, Object> map = new HashMap<String, Object>();
				map.put("checkCode", resJSON.getString("checkCode"));
				map.put("phoneNo", phoneNo);
				map.put("checkTime", System.currentTimeMillis());
				CacheClearUtil.clearOtherSession(session);
				session.setAttribute(phoneNo, map);
				response.getWriter().print("{\"retcode\":\"1\"}");
			}else if(statusCode.equals("112314")){
				response.getWriter().print("{\"retcode\":\"112314\"}");
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
}

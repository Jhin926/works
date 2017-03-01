package com.nr.umi.action;

import java.io.IOException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

import com.nr.umi.bean.CashFlow;
import com.nr.umi.bean.ExtensionWorker;
import com.nr.umi.bean.UMIUser;
import com.nr.umi.bean.UserAccountInfo;
import com.nr.umi.bean.UserRelation;
import com.nr.umi.bean.UserSummary;
import com.nr.umi.bean.WechatToken;
import com.nr.umi.service.UmiService;
import com.nr.umi.util.CacheClearUtil;
import com.nr.umi.util.ConfigurationUtil;
import com.nr.umi.util.CreateCheckCode;
import com.nr.umi.util.CutStringUtil;
import com.nr.umi.util.DrawUtil;
import com.nr.umi.util.MD5;
import com.nr.umi.util.TokenUtil;
import com.opensymphony.xwork2.ModelDriven;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class MainAction implements ModelDriven<ExtensionWorker> {
	
	private static Logger logger = Logger.getLogger(MainAction.class);
	
	@Resource(name = "umiService")
	private UmiService service;
	private ExtensionWorker worker = new ExtensionWorker();
	private String phoneNo;
	private String password;
	private String confirm_password;
	private String phone;
	private String yzm;

	public void registerWeb() {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("UTF-8");
		HttpSession session = request.getSession();
		phoneNo = request.getParameter("phoneNo");
		yzm = request.getParameter("yzm");
		password = request.getParameter("password");
		Map<String, Object> map = (Map<String, Object>) session.getAttribute(phoneNo);
		String checkCode = (String) map.get("checkCode");
		long checkTime = (long) map.get("checkTime");
		phoneNo = (String) map.get("phoneNo");
		UMIUser user = service.userCheck(phoneNo);
		if (user != null) {
			try {
				response.getWriter().write("{retcode:'1'}");
			} catch (IOException e) {
				e.printStackTrace();
			}
			return;
		} else if (!yzm.equals(checkCode)) {
			try {
				response.getWriter().write("{retcode:'2'}");
			} catch (IOException e) {
				e.printStackTrace();
			}

			return;
		} else if ((System.currentTimeMillis() - checkTime) > 300000 || checkCode == null) {
			try {
				response.getWriter().write("{retcode:'3'}");
			} catch (IOException e) {
				e.printStackTrace();
			}
			return;
		} else {
			user = new UMIUser();
			user.setUserName(phoneNo);
			user.setPassword(MD5.getMD5Code(password));
			user.setUserMobile(phoneNo);
			user.setMobileVerified(1);
			user.setRegisterTime(new Date());
			user.setRegisterIP(request.getRemoteAddr());
			user.setToken(TokenUtil.getToken(user.getId()));
			user = (UMIUser) service.addOrUpdate(user);

			user.setUserNameCT(CutStringUtil.getHidePhone(user.getUserName().trim()));
			CacheClearUtil.clearSession(session);
			session.setAttribute("user", user);
			try {
				response.getWriter().write("{retcode:'0'}");
			} catch (IOException e) {
				e.printStackTrace();
			}
			return;
		}
	}

	// 发送验证码
	public void sendMsg() {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		HttpSession session = request.getSession();
		phoneNo = request.getParameter("phoneNo");
		if (phoneNo == null || "".equals(phoneNo)) {
			return;
		}
		UMIUser user = service.userCheck(phoneNo);
		if (user != null) {
			try {
				response.getWriter().print("{'retcode':'2'}");
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
				session.setAttribute(phoneNo, map);
				response.getWriter().print("{'retcode':'1'}");
			} else {
				// 验证码发送失败
				response.getWriter().print("{'retcode':'0'}");
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@SuppressWarnings("unchecked")
	public void registerWeixin() {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		HttpSession session = request.getSession();
		phoneNo = (String) request.getAttribute("phoneNo");
		yzm = (String) request.getAttribute("yzm");
		password = (String) request.getAttribute("password");
		Map<String, Object> map = (Map<String, Object>) session.getAttribute(phoneNo);
		String checkCode = (String) map.get("checkCode");
		long checkTime = (long) map.get("checkTime");
		phoneNo = (String) map.get("phoneNo");
		/*
		 * String codeBeforeCheck = request.getParameter("codeValue"); String
		 * password = request.getParameter("password");
		 */
		UMIUser user = service.userCheck(phoneNo);
		if (user != null) {
			try {
				response.getWriter().write("1");// 手机号已经注册
			} catch (IOException e) {
				e.printStackTrace();
			}
		} else if (!yzm.equals(checkCode)) {
			try {
				response.getWriter().write("2");// 验证码错误
			} catch (IOException e) {
				e.printStackTrace();
			}

		} else if ((System.currentTimeMillis() - checkTime) > 300000 || checkCode == null) {
			try {
				response.getWriter().write("3");// 验证码已失效
			} catch (IOException e) {
				e.printStackTrace();
			}
		} else {
			user = new UMIUser();
			user.setUserName(phoneNo);
			user.setPassword(MD5.getMD5Code(password));
			user.setUserMobile(phoneNo);
			user.setRegisterTime(new Date());
			user.setRegisterIP(request.getRemoteAddr());
			user.setIsDrawed(0);
			service.addOrUpdate(user);

			session.setAttribute("user", user);
			try {
				response.getWriter().write("4");// 注册成功
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	public void querylink() {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		HttpSession session = request.getSession();
		UMIUser user = (UMIUser) session.getAttribute("user");
		List<UserSummary> summarys = service.querySummaryRefererId(user.getId());
		try {
			response.getWriter().print(JSONArray.fromObject(summarys).toString());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public void queryRelation() {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		HttpSession session = request.getSession();
		UserRelation relation = service.queryRelationByUserId(((UMIUser) session.getAttribute("user")).getId());
		try {
			response.getWriter().print(JSONObject.fromObject(relation).toString());
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	public void draw() {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		HttpSession session = request.getSession();
		UMIUser user = (UMIUser) session.getAttribute("user");
		if (user == null) {
			try {
				response.getWriter().write(1);
			} catch (IOException e) {
				e.printStackTrace();
			}
			return;
		}
		if (user.getIsDrawed() == 1) {
			try {
				response.getWriter().write("0.0");
			} catch (IOException e) {
				e.printStackTrace();
			}
			return;
		}
		// 调用抽奖工具类抽出中奖等级，然后配置文件中查出中奖等级对应的金额
		String ret = "amount" + DrawUtil.draw();
		double amount = Double.parseDouble(ConfigurationUtil.getValue(ret));
		// 抽中的金额转入用户的悠米6天账户中，并把资金冻结
		String today = new SimpleDateFormat("yyMMdd").format(new Date());
		List<UserAccountInfo> accs = service.findAllAcc(user.getId(), null, "100" + today);
		UserAccountInfo acc;
		if (accs == null || accs.size() == 0) {
			acc = new UserAccountInfo();
			acc.setPrincipal(amount);

			acc.setBoughtDate(new Date());
			acc.setRemainDays(7);
		} else {
			acc = accs.get(0);
			acc.setNoCashFlow(1);
			acc.setPrincipal(acc.getPrincipal() + amount);
		}
		acc.setDate(new Date());
		acc.setUser_id(user.getId());
		acc.setAccountID("100" + today);
		acc.setAccountName("悠米6天");
		acc.setFreezedAmount(amount);
		acc.setBalance(acc.getPrincipal());
		acc.setProfitExcepted(acc.getPrincipal() * service.getRate("rate_7", null) / 365 / 100 * 6);
		// 生成流水
		CashFlow cashFlow = new CashFlow();
		cashFlow.setAmount(amount);
		cashFlow.setAccountID(acc.getAccountID());
		cashFlow.setAccountName(acc.getAccountName());
		cashFlow.setCreateTimestamp(new Date());
		cashFlow.setSystemGenerated(1);
		cashFlow.setUserId(user.getId());
		cashFlow.setUpdateTimeStamp(new Timestamp(new Date().getTime()));

		WechatToken wechatToken = service.findWechatTokenByUserID(user.getId());
		if (wechatToken == null) {
			wechatToken = new WechatToken();
			wechatToken.setUserID(user.getId());
		}
		wechatToken.setAmount(amount);
		service.addOrUpdate(wechatToken);
		UserAccountInfo accsum = service.findAllAcc(user.getId(), null, "800").get(0);
		accsum.setBalance(accsum.getBalance() + amount);
		List<Object> list = new ArrayList<Object>();
		user.setIsDrawed(1);
		list.add(user);
		list.add(accsum);
		list.add(acc);
		list.add(cashFlow);
		service.updateList(list);
		try {
			response.getWriter().write(amount + "");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 获取协议所需信息
	 * @throws IOException 
	 */
	public void queryProtocolInfo() {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setContentType("text/html");
		response.setCharacterEncoding("UTF-8");
		try {
			String phoneNo = request.getParameter("phoneNo");
			UMIUser user = service.userCheck(phoneNo);
			if (user == null) {
				response.getWriter().print("{\"retcode\":\"1\"}");
				return;
			} else if (user.getRealName() == null || user.getCertNo() == null || user.getCertNo().length() < 10) {
				logger.error("用户 " + user.getId() + " 基本信息不全");
				response.getWriter().print("{\"retcode\":\"1\"}");
				return;
			}
			Calendar now = Calendar.getInstance();
			int year = now.get(Calendar.YEAR);
			int mouth = now.get(Calendar.MONTH);
			int day = now.get(Calendar.DAY_OF_MONTH);
			JSONObject userObj = new JSONObject();
			userObj.put("year", year);
			userObj.put("mouth", mouth + 1);
			userObj.put("day", day);
			userObj.put("certNo", CutStringUtil.getHideCertNo(user.getCertNo()));
			userObj.put("userId", CutStringUtil.getHidePhone(user.getUserName()));
			userObj.put("realName", user.getRealName());
			response.getWriter().print("{\"retcode\":\"0\",\"retmessage\":" + userObj + "}");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	
	@Override
	public ExtensionWorker getModel() {
		return worker;
	}

	public String getYzm() {
		return yzm;
	}

	public void setYzm(String yzm) {
		this.yzm = yzm;
	}

	public String getConfirm_password() {
		return confirm_password;
	}

	public void setConfirm_password(String confirm_password) {
		this.confirm_password = confirm_password;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getPhoneNo() {
		return phoneNo;
	}

	public void setPhoneNo(String phoneNo) {
		this.phoneNo = phoneNo;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

}

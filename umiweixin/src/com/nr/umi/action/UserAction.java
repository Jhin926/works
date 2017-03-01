package com.nr.umi.action;

import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

import com.nr.umi.bean.BankLimit;
import com.nr.umi.bean.UMIUser;
import com.nr.umi.bean.User;
import com.nr.umi.bean.UserAccountInfo;
import com.nr.umi.service.UmiService;
import com.nr.umi.service.WeChatService;
import com.nr.umi.util.CacheClearUtil;
import com.nr.umi.util.CutStringUtil;
import com.nr.umi.util.IPUtil;
import com.nr.umi.util.TokenUtil;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;

import net.sf.json.JSONObject;

public class UserAction extends ActionSupport {

	private static final long serialVersionUID = -1180470750774211185L;

	private static Logger logger = Logger.getLogger(UserAction.class);

	private String tel;
	private String password;
	private double huoqiAmount = 0.0;
	private double amount6 = 0.0;
	private double amount30 = 0.0;
	private double amount60 = 0.0;
	private double amount90 = 0.0;
	// 悠米定制账户总余额
	private double amountCustom = 0.0;
	private String userName;
	private String type;

	@Resource(name = "umiService")
	private UmiService service;

	@Resource
	private WeChatService weChatService;

	/*
	 * 以下属性是从 UMIbank_bak项目中:
	 * /UMIbank_bak/src/com/nr/umibank/bean/UserAction.java拷贝出来的
	 * 
	 */

	private Integer id;
	// 用户id
	private int user_id;
	// 动作类型
	private String action_type;
	// 动作细节
	private String action_detail;
	// 动作结果
	private String action_res;
	private String action_ip;
	private String action_amount;
	private String action_src_name;
	private String action_src_id;
	private String action_dst_name;
	private String action_dst_id;
	// 生成的交易号
	private String tradeNo;

	/**
	 * 登录成功后,重定向到这个action
	 * 
	 * @return 跳转到index.jsp
	 */
	public String loadIndexPage() throws Exception {
		System.out.println("com.nr.umi.action.UserAction.loadIndexPage()......");
		Map<String, Object> session = ActionContext.getContext().getSession();
		CacheClearUtil.clearOtherSession(session);

		UMIUser user = (UMIUser) session.get("user");
		if (user == null) {
			return "userIsNull";
		}
		// DecimalFormat df = new DecimalFormat("#0.00");
		String date = service.getMaxDateOfAccount(user.getId());
		List<UserAccountInfo> accs = service.findAllAcc(user.getId(), date, null);
		if (accs == null) {
			CacheClearUtil.clearSession(session);
			return LOGIN;
		}
		for (UserAccountInfo acc : accs) {
			if (acc.getAccountID().startsWith("400")) {
				if (acc.getBalance() == null) {
					huoqiAmount = 0.0;
				} else {
					huoqiAmount += acc.getBalance();
				}
			} else if (acc.getAccountID().startsWith("888")) {
				amountCustom += acc.getBalance() - acc.getFreezedAmount();
			}
		}
		

		logger.info("用户 " + user.getId() + " ,加载首页,\t最近一天是:" + date + ",400账户总金额为:" + huoqiAmount + ",888账户总金额为:"
				+ amountCustom);

		return "loadIndexPage";
	}

	/**
	 * 管理---->>>>> 实名认证
	 * 
	 * @return 返回到实名认证页面
	 */
	public String realNameVerify() {
		System.out.println("com.nr.umi.action.UserAction.realNameVerify()......");
		Map<String, Object> session = ActionContext.getContext().getSession();
		UMIUser user = (UMIUser) session.get("user");
		if (user == null) {
			return "userIsNull";
		}
		// 已经实名认证过
		if (user.getIsVerified() == 1) {
			return "certificatedInfo";
		}
		// 反之,还未实名认证
		String realNameVerifyToken = TokenUtil.getToken(user.getId());
		session.put("realNameVerifyToken", realNameVerifyToken);
		return "realNameVerify";

	}

	/**
	 * 获取银行卡限额数据
	 * 
	 * @return
	 */
	public String queryBankLimit() {
		System.out.println("com.nr.umi.action.UserAction.queryBankLimit()......");
		HttpServletRequest request = ServletActionContext.getRequest();
		List<BankLimit> bls = service.queryAllBanklimit();
		request.setAttribute("bls", bls);
		return "queryBankLimit";
	}

	/**
	 * 一般浏览器登录 返回 1 表示表单重复提交 返回 0 表示成功 其他表示重新登录
	 */
	public void login() throws Exception {
		System.out.println("com.nr.umi.action.UserAction.login()...");
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		Map<String, Object> session = ActionContext.getContext().getSession();
		if (session.containsKey("loginToken")) {
			response.getWriter().print("1");
			return;
		}

		tel = (String) request.getAttribute("tel");
		password = (String) request.getAttribute("password");
		UMIUser user = service.userCheck(tel);
		if (user == null) {
			session.clear();
			return;
		}
		if (user.getPassword().equals(password)) {
			user.setToken(TokenUtil.getToken(user.getId()));
			user.setLastLogonIP(IPUtil.getLocalIp(request));
			user.setLastLogonTime(new Date());
			user = (UMIUser) service.addOrUpdate(user);

			user.setUserNameCT(CutStringUtil.getHidePhone(user.getUserName().trim()));
		} else {
			session.clear();
			return;
		}
		session.clear();
		session.put("loginToken", TokenUtil.getToken(user.getId()));
		session.put("user", user);
		response.getWriter().print("0");
	}

	/**
	 * 获得微信授权,登录入口
	 */
	public void loginWeixin() throws Exception {
		System.out.println("com.nr.umi.action.UserAction.loginWeixin()...");
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		Map<String, Object> session = ActionContext.getContext().getSession();

		// 判断微信是否授权,若获取微信信息失败,则以普通方式登录
		if (!session.containsKey("wechat_info")) {
			/*
			 * 期初是在微信浏览器的访问下,若没有获取微信授权则,不予以访问 response.getWriter().print("202");
			 * session.clear(); session.put("wechatMessage", "获取微信信息失败,请重新授权");
			 */
			this.login();
			return;
		}

		if (session.containsKey("loginWeixinToken")) {
			response.getWriter().print("1");
			return;
		}
		JSONObject wechat_info = (JSONObject) session.get("wechat_info");
		User wetChatUser = new User(wechat_info.getString("openId"),
				wechat_info.getString("weChatUserInfo").getBytes());

		tel = (String) request.getAttribute("tel");
		password = (String) request.getAttribute("password");
		UMIUser user = service.userCheck(tel);
		if (user == null) {
			CacheClearUtil.clearSession(session);
			return;
		}
		if (user.getPassword().equals(password)) {
			user.setToken(TokenUtil.getToken(user.getId()));
			user.setLastLogonIP(IPUtil.getLocalIp(request));
			user.setLastLogonTime(new Date());
			user = (UMIUser) service.addOrUpdate(user);
			user.setUserNameCT(CutStringUtil.getHidePhone(user.getUserName().trim()));
		} else {
			CacheClearUtil.clearSession(session);
			return;
		}
		wetChatUser.setUmiId(user.getId());
		weChatService.bindWeChat(user, wetChatUser);
		CacheClearUtil.clearSession(session);
		session.put("loginWeixinToken", TokenUtil.getToken(user.getId()));
		session.put("user", user);
		response.getWriter().print("0");
	}

	/**
	 * 判断今天的账户是否生成
	 */
	public void judgeAccToday() throws Exception {
		System.out.println("com.nr.umi.action.UserAction.judgeAccToday()...");
		HttpServletResponse response = ServletActionContext.getResponse();
		Map<String, Object> session = ActionContext.getContext().getSession();
		UMIUser user = (UMIUser) session.get("user");
		if (user == null) {
			response.getWriter().print("201");
			return;
		}
		if (service.todayAccIsGenerated(user.getId())) {
			response.getWriter().print("0");
		} else {
			response.getWriter().print("1");
		}

	}

	
	
	/**
	 * 注销
	 */
	public String logout() throws Exception {
		System.out.println("logout...");
		Map<String, Object> session = ActionContext.getContext().getSession();
		CacheClearUtil.clearSession(session);
		return "logout";
	}

	/**
	 * 解除与微信之间的绑定
	 */
	public String unbindWithWechat() {
		System.out.println("unbindWithWechat...");
		Map<String, Object> session = ActionContext.getContext().getSession();
		// 微信授权
		if (session.containsKey("wechat_info") && session.containsKey("user")) {
			UMIUser user = (UMIUser) session.get("user");
			weChatService.updateUser(user.getId(), null);
			CacheClearUtil.clearSession(session);
		} else {
			session.clear();
		}
		return "logout";
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getTel() {
		return tel;
	}

	public void setTel(String tel) {
		this.tel = tel;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public double getHuoqiAmount() {
		return huoqiAmount;
	}

	public void setHuoqiAmount(double huoqiAmount) {
		this.huoqiAmount = huoqiAmount;
	}

	public double getAmount6() {
		return amount6;
	}

	public void setAmount6(double amount6) {
		this.amount6 = amount6;
	}

	public double getAmount30() {
		return amount30;
	}

	public void setAmount30(double amount30) {
		this.amount30 = amount30;
	}

	public double getAmount60() {
		return amount60;
	}

	public void setAmount60(double amount60) {
		this.amount60 = amount60;
	}

	public double getAmount90() {
		return amount90;
	}

	public void setAmount90(double amount90) {
		this.amount90 = amount90;
	}

	public double getAmountCustom() {
		return amountCustom;
	}

	public void setAmountCustom(double amountCustom) {
		this.amountCustom = amountCustom;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public UmiService getService() {
		return service;
	}

	public void setService(UmiService service) {
		this.service = service;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public int getUser_id() {
		return user_id;
	}

	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}

	public String getAction_type() {
		return action_type;
	}

	public void setAction_type(String action_type) {
		this.action_type = action_type;
	}

	public String getAction_detail() {
		return action_detail;
	}

	public void setAction_detail(String action_detail) {
		this.action_detail = action_detail;
	}

	public String getAction_res() {
		return action_res;
	}

	public void setAction_res(String action_res) {
		this.action_res = action_res;
	}

	public String getAction_ip() {
		return action_ip;
	}

	public void setAction_ip(String action_ip) {
		this.action_ip = action_ip;
	}

	public String getAction_amount() {
		return action_amount;
	}

	public void setAction_amount(String action_amount) {
		this.action_amount = action_amount;
	}

	public String getAction_src_name() {
		return action_src_name;
	}

	public void setAction_src_name(String action_src_name) {
		this.action_src_name = action_src_name;
	}

	public String getAction_src_id() {
		return action_src_id;
	}

	public void setAction_src_id(String action_src_id) {
		this.action_src_id = action_src_id;
	}

	public String getAction_dst_name() {
		return action_dst_name;
	}

	public void setAction_dst_name(String action_dst_name) {
		this.action_dst_name = action_dst_name;
	}

	public String getAction_dst_id() {
		return action_dst_id;
	}

	public void setAction_dst_id(String action_dst_id) {
		this.action_dst_id = action_dst_id;
	}

	public String getTradeNo() {
		return tradeNo;
	}

	public void setTradeNo(String tradeNo) {
		this.tradeNo = tradeNo;
	}

	@Override
	public String toString() {
		return "UserAction [user_id=" + user_id + ", action_type=" + action_type + ", action_detail=" + action_detail
				+ ", action_res=" + action_res + ", action_ip=" + action_ip + ", action_amount=" + action_amount
				+ ", action_src_name=" + action_src_name + ", action_src_id=" + action_src_id + ", action_dst_name="
				+ action_dst_name + ", action_dst_id=" + action_dst_id + ", tradeNo=" + tradeNo + "]";
	}

}

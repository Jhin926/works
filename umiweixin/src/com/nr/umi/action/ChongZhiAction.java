package com.nr.umi.action;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

import com.nr.umi.bean.BankInfo;
import com.nr.umi.bean.CashFlow;
import com.nr.umi.bean.CenterProcess;
import com.nr.umi.bean.OrderDetail;
import com.nr.umi.bean.UMIUser;
import com.nr.umi.bean.UserAccountInfo;
import com.nr.umi.service.UmiService;
import com.nr.umi.service.UserAccountInfoService;
import com.nr.umi.util.CacheClearUtil;
import com.nr.umi.util.CutStringUtil;
import com.nr.umi.util.IPUtil;
import com.nr.umi.util.OrderUtil;
import com.nr.umi.util.SinaUtil;
import com.nr.umi.util.TokenUtil;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;

import net.sf.json.JSONObject;

/**
 * 充值业务
 */
public class ChongZhiAction extends ActionSupport {

	private static final long serialVersionUID = -8149998878105505327L;
	Logger logger = Logger.getLogger(ChongZhiAction.class);
	// 记录url上账户的参数
	private String accountID;
	private UMIUser user;
	@Resource(name = "umiService")
	private UmiService umiService;

	@Resource(name = "userAccountInfoService")
	private UserAccountInfoService userAccountInfoService;

	public String loadDate() throws Exception {
		System.out.println("com.nr.umi.action.ChongZhiAction.loadDate()");
		Map<String, Object> session = ActionContext.getContext().getSession();
		CacheClearUtil.clearOtherSession(session);
		HttpServletRequest request = ServletActionContext.getRequest();
		user = (UMIUser) session.get("user");
		if (user == null) {
			return "userIsNull";
		}
		BankInfo bi = umiService.findDBC(user.getId());
		if (bi == null) {
			request.setAttribute("loadDate_message", "还没有绑定过银行卡");
			System.out.println("NO_defaultBankCard");
		}
		request.setAttribute("bi", bi);

		List<UserAccountInfo> accounts = null;
		if (accountID.equals("400")) {
			accounts = umiService.findAccByRemainDays("888", user.getId(), 0, null);
		}
		request.setAttribute("accounts", accounts);
		session.put("transfer_step1_token", TokenUtil.getToken(user.getId()));
		return "loadDate" + accountID;
	}

	/**
	 * 悠米定制
	 */
	public String customMade() {
		System.out.println("com.nr.umi.action.ChongZhiAction.customMade()...");
		Map<String, Object> session = ActionContext.getContext().getSession();

		CacheClearUtil.clearOtherSession(session);
		HttpServletRequest request = ServletActionContext.getRequest();
		JSONObject customMadeJson = new JSONObject();
		user = (UMIUser) session.get("user");
		int timeLimit = 0;
		try {
			timeLimit = Integer.parseInt(request.getParameter("timeLimit").trim());
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e.getMessage());
			return "error";
		}
		if (timeLimit < 7) {
			session.put("chongzhiAction_message", "悠米定制期限不能少于7天");
			return "error";
		}
		customMadeJson.put("timeLimit", timeLimit);
		session.put("customMadeJson", customMadeJson);

		BankInfo bi = umiService.findDBC(user.getId());
		if (bi == null) {
			System.out.println("NO_defaultBankCard");
		}
		request.setAttribute("bi", bi);

		List<UserAccountInfo> accounts = null;
		accounts = umiService.findAccByRemainDays(new String[] { "400", "888" }, user.getId(), 0, null);
		request.setAttribute("accounts", accounts);

		JSONObject accInfos = new JSONObject();
		accInfos.put("bankInfo", bi);
		accInfos.put("accounts", accounts);
		System.out.println(accInfos);

		session.put("transfer_step1_token", TokenUtil.getToken(user.getId()));
		return "loadDate888";
	}

	// assessment , 输入充值金额,发送验证码
	public void asseAmount() throws Exception {
		System.out.println("------com.nr.umi.action.ChongZhiAction.asseAmount()----------");
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("UTF-8");
		Map<String, Object> session = ActionContext.getContext().getSession();
		user = (UMIUser) session.get("user");
		if (user == null) {
			response.getWriter().print("{\"retcode\":\"2\"}");
			return;
		}
		// 每次充值操作生成一个token,放到session中,充值结束,删除该token
		String topUpOperationToken = TokenUtil.getToken(user.getId());
		HttpServletRequest request = ServletActionContext.getRequest();
		String srcID = request.getParameter("srcID");
		String dstID = request.getParameter("dstID");

		session.put("srcID", srcID);
		session.put("dstID", dstID);
		session.put("topUpOperationToken", topUpOperationToken);

		// 充值金额
		double amount = new Double(request.getParameter("amount")).doubleValue();
		session.put("amount", amount);

		String recStr = SinaUtil.createHostingDeposit(umiService, user, amount);
		System.out.println("--------------------------------------------------------------------");
		System.out.println(recStr);
		System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
		JSONObject obj = JSONObject.fromObject(recStr);

		if (obj.getString("retcode").equals(1)) {
			response.getWriter().print("{\"retcode\":\"1\",\"retmessage\":\"" + obj.get("response_message") + "\"}");
			return;
			// token无效
		} else if (obj.getString("retcode").equals(2)) {
			response.getWriter().print("{\"retcode\":\"2\"}");
			return;
		}
		session.put("out_trade_no", obj.get("out_trade_no"));
		response.getWriter().print("{\"retcode\":\"0\"}");
	}

	/**
	 * verification 验证,核实验证码 ajax返回值, 0 表示返回到充值结果页面 ; 1表示重复提交
	 * 
	 * @throws Exception
	 */
	public void verCode() throws Exception {
		System.out.println("------com.nr.umi.action.ChongZhiAction.verCode()----------");
		Map<String, Object> session = ActionContext.getContext().getSession();
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("UTF-8");
		// 充值结果
		user = (UMIUser) session.get("user");
		// 服务端防止重复请求
		try {
			if (!session.containsKey("topUpOperationToken")) {
				System.out.println("本次操作已经结束请返回首页");
				response.getWriter().print("{\"retcode\":\"502\"}");
				return;
			}
			if (session.containsKey("verCodeToken")) {
				response.getWriter().print("{\"retcode\":\"501\"}");
				System.out.println("重复提交!");
				return;
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		session.put("verCodeToken", TokenUtil.getToken(user.getId()));

		BankInfo bi = umiService.findDBC(user.getId());
		String validate_code = request.getParameter("verCode");
		String dstID = (String) session.get("dstID");
		String srcID = (String) session.get("srcID");
		String out_trade_no = (String) session.get("out_trade_no");

		UserAccountInfo bankAcc = umiService.queryAccountByUseridAccountID(user.getId(), srcID);
		// 充值金额
		double amount = (double) session.get("amount");

		OrderDetail orderDetail = new OrderDetail();
		orderDetail.setCreateTime(new Date());
		orderDetail.setType(1);

		String dstName = null;// 目的账户的名称
		String accPic = null; // 目的账户的图标
		if (dstID.startsWith("4")) {
			dstName = "悠米活期";
			accPic = "index_09.png";
		} else if (dstID.startsWith("888")) {
			accPic = "logo-custom.png";
			orderDetail.setType(3);
			if (!session.containsKey("customMadeJson")) {
				response.getWriter().print("{\"retcode\":\"104\",\"retmessage\":\"数据丢失,请重新定义期限!\"}");
				return;
			}
			int timeLimit = JSONObject.fromObject(session.get("customMadeJson")).getInt("timeLimit");
			dstID = dstID + new SimpleDateFormat("yyMMdd").format(new Date()) + CutStringUtil.getTimeLimit(timeLimit);
			dstName = "悠米定制-" + timeLimit + "天";
		}
		orderDetail.setStep(1);
		orderDetail.setIsSuccess(1);
		orderDetail = (OrderDetail) umiService.addOrUpdate(orderDetail);

		// 充值action
		UserAction userAction = new UserAction();
		userAction.setUser_id(user.getId());
		userAction.setTradeNo(out_trade_no);
		userAction.setAction_type("充值");
		userAction.setAction_amount(amount + "");
		userAction.setAction_detail(bankAcc.getAccountName() + "转入到" + dstName + "  ...微信端");
		userAction.setAction_res("转账中");
		userAction.setAction_src_name(bankAcc.getAccountName());
		userAction.setAction_src_id(srcID);
		userAction.setAction_dst_name(dstName);
		userAction.setAction_dst_id(dstID);
		userAction.setAction_ip(IPUtil.getLocalIp(request));
		userAction = (UserAction) umiService.addOrUpdate(userAction);

		// 这里的cashflow是记录银行卡转出的流水记录
		CashFlow cashflow = new CashFlow();
		cashflow.setUserId(user.getId());
		cashflow.setAccountID(srcID);
		cashflow.setAccountName(bi.getBankCode() + "_" + bi.getBankName());
		cashflow.setAmount(0 - amount);
		cashflow.setCategoryID(1);
		cashflow.setCategoryName("投资");
		cashflow.setSystemGenerated(1);
		cashflow.setCreateTimestamp(new Date());
		cashflow.setStatus(1);
		cashflow.setOrderID(orderDetail.getId());
		cashflow.setDstAccountID(dstID);
		cashflow.setDstAccountName(dstName);
		cashflow = (CashFlow) umiService.addOrUpdate(cashflow);

		// 理财账户转入流水
		CashFlow dstCashflow = new CashFlow();
		dstCashflow.setUserId(user.getId());
		dstCashflow.setAccountID(dstID);
		dstCashflow.setAccountName(dstName);
		dstCashflow.setAmount(amount);
		dstCashflow.setCategoryID(1);
		dstCashflow.setCategoryName("投资");
		dstCashflow.setSystemGenerated(1);
		dstCashflow.setCreateTimestamp(new Date());
		dstCashflow.setStatus(1);
		dstCashflow.setOrderID(orderDetail.getId());
		dstCashflow.setDstAccountID(srcID);
		dstCashflow.setDstAccountName(bi.getBankCode() + "_" + bi.getBankName());
		dstCashflow = (CashFlow) umiService.addOrUpdate(dstCashflow);

		// 生成中间表，作为回调数据
		CenterProcess process = new CenterProcess();
		process.setAmount(amount);
		process.setSrcID(srcID);
		process.setDstID(dstID);
		process.setUserID(user.getId());
		process.setOrderNo(out_trade_no);
		process.setCashID(cashflow.getId());
		process.setDstCashID(dstCashflow.getId());
		process = (CenterProcess) umiService.addOrUpdate(process);

		// 对验证码经行验证
		String sinaRespon = SinaUtil.depositAdvance(umiService, user, validate_code);
		// String sinaRespon = SinaUtil.createHostingDepositTest();

		System.out.println("--------------------------------------------------------------------");
		System.out.println(sinaRespon);
		System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

		// 验证失败——>充值失败
		if (!sinaRespon.contains("APPLY_SUCCESS")) {
			JSONObject obj = JSONObject.fromObject(sinaRespon);
			StringBuffer recharge_message = new StringBuffer("用户 ");
			recharge_message.append(user.getId());
			recharge_message.append(" 充值失败,错误原因: ");
			recharge_message.append(obj.get("response_message"));
			recharge_message.append(",删除本次操作的2条流水,id分别为: ");
			recharge_message.append(cashflow.getId());
			recharge_message.append(", ");
			recharge_message.append(dstCashflow.getId());
			logger.info(recharge_message);

			umiService.delCashFlowByIds(new Integer[] { cashflow.getId(), dstCashflow.getId() }, user.getId());
			if (!obj.containsKey("retcode")) {
				response.getWriter().print("{\"retcode\":\"2\"}");
			} else {
				response.getWriter()
						.print("{\"retcode\":\"104\",\"retmessage\":\"" + obj.get("response_message") + "\"}");
			}
			session.remove("verCodeToken");
			return;
			// 验证成功,充值成功——>转账
		}

		bankAcc.setBalance(bankAcc.getBalance() - amount);
		umiService.addOrUpdate(bankAcc);

		int count = 10;
		while (count != 0) {
			try {
				Thread.sleep(500);
			} catch (InterruptedException e) {
				logger.error(e.getMessage());
			}
			userAction = umiService.findAction(user.getId(), out_trade_no, null);
			if (userAction != null && userAction.getAction_res().contains("转账完成")) {
				logger.info("用户回调成功,action 如下: " + userAction);

				OrderDetail orderTemp = umiService.getOrderDetail(orderDetail.getId());
				orderTemp = OrderUtil.orderStep(cashflow, orderTemp);
				umiService.addOrUpdate(orderTemp);
				break;
			}
			count--;
		}

		// 创建数据传输对象,输送到前端
		JSONObject dataJson = new JSONObject();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		dataJson.put("webpageTitle", "充值结果");
		dataJson.put("srcAccPic", bi.getBankPic());
		dataJson.put("srcAccName", bi.getBank());
		dataJson.put("tailNum", "(" + bi.getTailNum() + ")");
		dataJson.put("amount", session.get("amount"));
		dataJson.put("acountID", session.get("dstID"));
		dataJson.put("dstAccPic", accPic);
		dataJson.put("cashflowId", cashflow.getId());
		dataJson.put("tradeType", cashflow.getCategoryName());

		// 充值目的,即悠米理财账户,含(400)
		UserAccountInfo dstAcc = umiService.queryAccountByUseridAccountID(user.getId(), dstID,
				new SimpleDateFormat("yyyyMMdd").format(new Date()));
		if (dstAcc == null || !userAction.getAction_res().contains("转账完成")) {
			logger.info("用户" + user.getId() + ", out_trade_no为:" + out_trade_no + " 本次充值回调正在处理中... ");
			dstAcc = new UserAccountInfo();
			dstAcc.setAccountName(dstName);
			dataJson.put("dstAccName", dstAcc);
			dataJson.put("createDate", sdf.format(new Date()));
			// 处理中
			dataJson.put("statusMsg", "处理中");
			CacheClearUtil.clearOtherSession(session);
			session.put("recharge_message", "充值成功,请返回首页!");
			session.put("dataJson", dataJson);
			response.getWriter().print("{\"retcode\":\"0\"}");
			return;
		}
		// 投资成功
		dataJson.put("statusMsg", "交易成功");
		dataJson.put("dstAccName", dstAcc);
		dataJson.put("createDate", sdf.format(new Date()));
		CacheClearUtil.clearOtherSession(session);
		session.put("recharge_message", "充值成功,请返回首页!");
		session.put("dataJson", dataJson);
		response.getWriter().print("{\"retcode\":\"0\"}");
	}

	/**
	 * 获取验证码 返回 0表示成功,1表示失败
	 */
	public void getVerCode() throws Exception {
		System.out.println("------com.nr.umi.action.ChongZhiAction.getVerCode()----------");
		Map<String, Object> session = ActionContext.getContext().getSession();
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("UTF-8");

		if (!session.containsKey("topUpOperationToken")) {
			System.out.println("本次操作已经结束请返回首页");
			response.getWriter().print("502");
			return;
		}

		// 充值金额
		double amount = (double) session.get("amount");
		user = (UMIUser) session.get("user");

		String recStr = SinaUtil.createHostingDeposit(umiService, user, amount);
		System.out.println("--------------------------------------------------------------------");
		System.out.println(recStr);
		System.out.println("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
		JSONObject obj = JSONObject.fromObject(recStr);

		// 获取验证码失败
		if (obj.getString("retcode").equals(1)) {
			response.getWriter().print("1");
			return;
			// 用户token失效
		} else if (obj.getString("retcode").equals(2)) {
			response.getWriter().print("2");
			return;
		}
		// 获取验证码成功
		session.put("out_trade_no", obj.get("out_trade_no"));
		response.getWriter().print("0");
	}

	/**
	 * 生成一个OrderDetail,暂未使用
	 * 
	 * @param type
	 *            : 1 or 3 <br />
	 *            1: 活期 3: 理财产品
	 */
	public void createOrderDetail(int type) {
		OrderDetail orderDetail = new OrderDetail();
		orderDetail.setCreateTime(new Date());
		orderDetail.setType(type);
		orderDetail.setStep(1);
		orderDetail.setIsSuccess(1);
	}

	public String getAccountID() {
		return accountID;
	}

	public void setAccountID(String accountID) {
		this.accountID = accountID;
	}

}

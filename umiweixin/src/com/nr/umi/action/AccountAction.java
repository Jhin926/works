package com.nr.umi.action;

import java.io.IOException;
import java.sql.Timestamp;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
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
import org.springframework.beans.BeanUtils;

import com.nr.umi.bean.CashFlow;
import com.nr.umi.bean.OrderDetail;
import com.nr.umi.bean.TransferRemark;
import com.nr.umi.bean.UMIUser;
import com.nr.umi.bean.UserAccountInfo;
import com.nr.umi.bean.Yield;
import com.nr.umi.beanVo.CurrentAccountVo;
import com.nr.umi.constants.WebConstant;
import com.nr.umi.service.UmiService;
import com.nr.umi.util.CacheClearUtil;
import com.nr.umi.util.CashFlowUtil;
import com.nr.umi.util.CutStringUtil;
import com.nr.umi.util.ExAmountUtil;
import com.nr.umi.util.IPUtil;
import com.nr.umi.util.OrderUtil;
import com.nr.umi.util.TokenUtil;
import com.opensymphony.xwork2.ActionContext;
import com.opensymphony.xwork2.ActionSupport;

import net.sf.json.JSONObject;

public class AccountAction extends ActionSupport {

	private static final long serialVersionUID = 4872377538835762856L;

	private static Logger logger = Logger.getLogger(AccountAction.class);

	@Resource(name = "umiService")
	private UmiService service;

	/**
	 * 昨日总收益
	 */
	private double profitSum = 0.0;
	/**
	 * 账户总金额
	 */
	private double amountSum = 0.0;
	private List<UserAccountInfo> accounts;
	private String accountID;

	/*
	 * 跳转理财账户页面,目前只是在充值提现结果页面; 以后重新整理,再重新修改
	 */
	public String jumpAccount() throws Exception {
		System.out.println("com.nr.umi.action.AccountAction.jumpAccount()...");
		if (accountID == null) {
			return "error";
		}
		if ("400".equals(accountID.trim())) {
			return currentDeposit();
		}
		if ("888".equals(accountID.trim())) {
			return customMadeDeposit();
		}
		return "error";
	}

	/**
	 * 悠米定制
	 */
	public String customMadeDeposit() {
		System.out.println("com.nr.umi.action.AccountAction.customMadeDeposit()...");
		HttpServletRequest request = ServletActionContext.getRequest();
		UMIUser user = (UMIUser) request.getSession().getAttribute("user");
		if (user == null) {
			return "userIsNull";
		}

		String date = service.getMaxDateOfAccount(user.getId());
		accounts = service.findAllAcc(user.getId(), date, accountID);
		logger.info("用户 " + user.getId() + " 的" + accountID + "账户如下:" + accounts);

		DecimalFormat df = new DecimalFormat("#0.00");
		if (accounts != null && accounts.size() > 0) {
			for (UserAccountInfo acc : accounts) {
				profitSum += acc.getProfitAmt();
				amountSum += acc.getBalance() - acc.getFreezedAmount();

				// 设置账户余额,账户表中c_amount字段减去体验金c_freezed_amount
				acc.setBalance(Double.parseDouble(df.format(acc.getBalance() - acc.getFreezedAmount())));

				// 设置用户真实本金,只作为显示
				acc.setPrincipal(acc.getPrincipal() - acc.getFreezedAmount());

				// 设置账户期限
				acc.setTimeLimit(Integer.parseInt(acc.getAccountID().substring(9)) + 1);
				if (acc.getRemainDays() == 0) {
					acc = service.checkAccount(user.getId(), acc);
				}
				// 设置账户到期时间期限
				Calendar expireDate = Calendar.getInstance();
				expireDate.add(Calendar.DATE, acc.getRemainDays());
				acc.setExpirationDate(new SimpleDateFormat("yyyy-MM-dd").format(expireDate.getTime()));
			}
		}
		return "success" + accountID;
	}

	/**
	 * 悠米活期详情
	 */
	public String currentDeposit() throws Exception {
		System.out.println("com.nr.umi.action.AccountAction.currentDeposit()...");
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpSession session = request.getSession();
		UMIUser user = (UMIUser) session.getAttribute("user");
		if (user == null) {
			return "userIsNull";
		}

		String date = service.getMaxDateOfAccount(user.getId());
		UserAccountInfo account_400 = service.queryAccountByUseridAccountID(user.getId(), accountID, date);
//		UserAccountInfo account_401 = service.queryWithdrawAmount(user, "401", date);
		if (account_400 == null) {
			session.setAttribute("error_message", "您好,数据正在维护中,请稍后...");
			return "error";
		}
		CurrentAccountVo huoqiAccount = new CurrentAccountVo();
		BeanUtils.copyProperties(account_400, huoqiAccount);

		huoqiAccount.setIncreasing_money(account_400.getBalance());
		/*if (account_401 != null) {
			huoqiAccount.setWaiting_money(account_401.getBalance());
			huoqiAccount.setBalance(account_400.getBalance() + account_401.getBalance());
		} else {
			huoqiAccount.setWaiting_money(0.0);
		}*/
		if (huoqiAccount.getBalance() == null || huoqiAccount.getBalance() < 0.005) {
			huoqiAccount.setBalance(0.0);
		}
		if (huoqiAccount.getProfitAmt() == null) {
			huoqiAccount.setProfitAmt(0.0);
		}
		if (huoqiAccount.getProfitAmt1m() == null) {
			huoqiAccount.setProfitAmt1m(0.0);
		}
		if (huoqiAccount.getProfit7d() == null) {
			Yield yield = service.getYields();
			if (yield != null) {
				huoqiAccount.setProfit7d(yield.getdRate());
			} else {
				huoqiAccount.setProfit7d(3.9999);
			}
		}
		logger.info("用户 " + user.getId() + " 的" + accountID + "账户如下:" + huoqiAccount);
		request.setAttribute("curDepAccount", huoqiAccount);
		return "success" + accountID;
	}
	
	/**
	 * 悠米账户内部转账
	 * @throws IOException 
	 */
	public void transfer() throws IOException {
		System.out.println("com.nr.umi.action.AccountAction.transfer()...");
		Map<String, Object> session = ActionContext.getContext().getSession();
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();

		UMIUser user = (UMIUser) session.get("user");
		if (user == null) {
			CacheClearUtil.clearSession(session);
			response.getWriter().print("{\"retcode\":\"201\"}");
			return;
		}
		// 服务端防止重复请求
		try {
			if (!session.containsKey("transfer_step1_token")) {
				System.out.println("本次操作已经结束请返回首页");
				response.getWriter().print("{\"retcode\":\"502\"}");
				return;
			}
			if (session.containsKey("transfer_step2_token")) {
				response.getWriter().print("{\"retcode\":\"501\"}");
				System.out.println("重复提交!");
				return;
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		session.put("transfer_step2_token", TokenUtil.getToken(user.getId()));
		
		double rate400 = JSONObject.fromObject(service.findText("rate_400", "").getContent()).getDouble("rate");
		String srcID = request.getParameter("srcID");
		String dstID = request.getParameter("dstID");
		String srcAccPic = null;
		String dstAccPic = null;
		double amount = new Double(request.getParameter("amount"));
		int timeLimit=0;
		if (dstID.equals("888")) {
			timeLimit = Integer.parseInt(request.getParameter("timeLimit"));
			dstID = dstID + new SimpleDateFormat("yyMMdd").format(new Date()) + CutStringUtil.getTimeLimit(timeLimit);
			dstAccPic = "logo-custom.png";
		} else if (dstID.equals("400")) {
			dstID = "401";
			dstAccPic = "index_09.png";
		}
		UserAccountInfo accSrc = null;
		String today = new SimpleDateFormat("yyyyMMdd").format(new Date());
		// 400账户转出
		if (srcID.startsWith("4")) {
			srcAccPic = "index_09.png";
			// 401
			accSrc = service.queryAccountByUseridAccountID(user.getId(), "401", today);
			if (accSrc != null) {
				if (accSrc.getBalance() > amount) {
					accSrc.setBalance(accSrc.getBalance() - amount);
					accSrc.setPrincipal(accSrc.getBalance());
					accSrc.setTimestamp(new Timestamp(new Date().getTime()));
					service.addOrUpdate(accSrc);
				} else if (accSrc.getBalance() <= amount && accSrc.getBalance() > 0) {
					accSrc.setBalance(0.0);
					accSrc.setPrincipal(0.0);
					accSrc.setTimestamp(new Timestamp(new Date().getTime()));
					accSrc.setIsValid(0);
					service.addOrUpdate(accSrc);
				}
			}
			// 400
			accSrc = service.queryAccountByUseridAccountID(user.getId(), "400", today);
			if (accSrc.getBalance() - amount < (-0.01)) {
				response.getWriter().print("{\"retcode\":\"1\",\"retmessage\":\"余额不足\"}");
				session.remove("transfer_step2_token");
				return;
			}
			accSrc.setBalance(accSrc.getBalance() - amount);
			accSrc.setPrincipal(accSrc.getBalance());
			accSrc.setProfitExcepted(accSrc.getBalance() * rate400 / 36500);
			accSrc.setTimestamp(new Timestamp(new Date().getTime()));
			accSrc = (UserAccountInfo) service.addOrUpdate(accSrc);
		} else {
			srcAccPic = "logo-custom.png";
			// 888账户转出
			String finaAccId = request.getParameter("finaAccId");
			System.out.println("finaAccId 为: " + finaAccId);
			if (finaAccId == null) {
				return;
			}
			accSrc = service.getUserAccountInfo(Integer.parseInt(finaAccId.trim()), null);
			if (accSrc.getBalance() - amount < (-0.01)) {
				response.getWriter().print("{\"retcode\":\"1\",\"retmessage\":\"余额不足\"}");
				session.remove("transfer_step2_token");
				return;
			}
			double balance = accSrc.getBalance() - amount;
			accSrc.setBalance(Math.round(balance * 100) / 100.0);
			if (balance < 0.01) {
				accSrc.setIsValid(0);
				// 账户余额小于0.01
				service.updateAccountOfWithdraw(user.getId(), accSrc.getAccountID(), accSrc.getDate());
			}
			accSrc.setTimestamp(new Timestamp(new Date().getTime()));
			accSrc = (UserAccountInfo) service.addOrUpdate(accSrc);
		}
		int srcInt = Integer.parseInt("" + srcID.charAt(0));
		int dstInt = Integer.parseInt("" + dstID.charAt(0));
		String payer_identity_id = null;
		String payee_identity_id = null;
		switch (srcInt) {
		case 4:
			payer_identity_id = WebConstant.COMPANY_400_ID;
			break;
		case 8:
			payer_identity_id = WebConstant.COMPANY_888_ID;
			break;
		}
		switch (dstInt) {
		case 4:
			payee_identity_id = WebConstant.COMPANY_400_ID;
			break;
		case 8:
			payee_identity_id = WebConstant.COMPANY_888_ID;
			break;
		}
		if (payer_identity_id != null && payee_identity_id != null) {
			JSONObject user_json = new JSONObject();
			user_json.put("userID", user.getId());
			user_json.put("amount", amount);

//			SinaUtil.transferSina(service, user_json, payer_identity_id, payee_identity_id);

		}

		// 账户更新,401 || 888
		UserAccountInfo dstAcc = service.queryAccountByUseridAccountID(user.getId(), dstID, today);
		if (dstAcc == null) {
			dstAcc = new UserAccountInfo();
			dstAcc.setAccountID(dstID);
			dstAcc.setPrincipal(amount);
			if (dstID.startsWith("4")) {
				dstAcc.setAccountName("悠米活期");
				dstAcc.setProfitExcepted(amount * rate400 / 100 / 365);
				// 400账户
				UserAccountInfo acc = service.queryAccountByUseridAccountID(user.getId(), "400", today);
				acc.setPrincipal(acc.getPrincipal() + amount);
				acc.setBalance(acc.getBalance() + amount);
				acc.setProfitExcepted(acc.getPrincipal() * rate400 / 100 / 365);
				acc.setTimestamp(new Timestamp(new Date().getTime()));
				service.addOrUpdate(acc);
			} else if (dstID.startsWith("888")) {
				dstAcc.setAccountName("悠米定制-" + timeLimit + "天");
				dstAcc.setRemainDays(timeLimit + 1);
				double rate = service.getRate(timeLimit);
				dstAcc.setProfitExcepted(amount * rate / 100 / 365 * timeLimit);
				dstAcc.setDuration(timeLimit);
			}
			dstAcc.setBalance(amount);
			dstAcc.setBoughtDate(new Date());
			dstAcc.setDate(new Date());
			dstAcc.setIsValid(1);
			dstAcc.setUser_id(user.getId());
			dstAcc.setTimestamp(new Timestamp(new Date().getTime()));
		} else {
			if (dstID.startsWith("888")) {
				dstAcc.setTimestamp(new Timestamp(new Date().getTime()));
				dstAcc.setBalance(dstAcc.getBalance() + amount);
				dstAcc.setPrincipal(dstAcc.getPrincipal() + amount);
				double rate = service.getRate(timeLimit);
				dstAcc.setProfitExcepted(dstAcc.getPrincipal() * rate / 100 / 365 * timeLimit);
				dstAcc.setDuration(timeLimit);
			} else if (dstID.startsWith("4")) {
				dstAcc.setBalance(dstAcc.getBalance() + amount);
				dstAcc.setPrincipal(dstAcc.getBalance() + amount);
				dstAcc.setProfitExcepted((dstAcc.getBalance() + amount) * rate400 / 100 / 365);
				dstAcc.setTimestamp(new Timestamp(new Date().getTime()));

				UserAccountInfo acc = service.queryAccountByUseridAccountID(user.getId(), "400", today);
				acc.setPrincipal(acc.getPrincipal() + amount);
				acc.setBalance(acc.getBalance() + amount);
				acc.setProfitExcepted(acc.getPrincipal() * rate400 / 100 / 365);
				acc.setTimestamp(new Timestamp(new Date().getTime()));
				service.addOrUpdate(acc);
			}
		}
		dstAcc = (UserAccountInfo) service.addOrUpdate(dstAcc);
		if (dstID.equals("401")) {
			dstID = "400";
		}
		// 转出账户流水
		CashFlow cashFlowSrc = new CashFlow();
		// 转入账户流水
		CashFlow cashFlowDst = new CashFlow();
		// 订单详情
		OrderDetail order = new OrderDetail();
		if (dstID.equals("400")) {
			order.setStep(2);
			order.setType(1);
			order.setComTime(new Date());
			order.setIsSuccess(0);
		} else if (dstID.startsWith("888")) {
			order.setStep(2);
			order.setType(3);
			order.setComTime(new Date());
			order.setIsSuccess(0);
		}
		order.setCreateTime(new Date());
		order = (OrderDetail) service.addOrUpdate(order);
		// 生成转出流水
		cashFlowSrc.setAccountID(accSrc.getAccountID());
		cashFlowSrc.setAccountName(accSrc.getAccountName());
		cashFlowSrc.setAmount(0 - amount);
		cashFlowSrc.setCreateTimestamp(new Date());
		cashFlowSrc.setUpdateTimeStamp(new Timestamp(new Date().getTime()));
		cashFlowSrc.setDstAccountID(dstID);
		cashFlowSrc.setDstAccountName(dstAcc.getAccountName());
		cashFlowSrc.setSystemGenerated(1);
		cashFlowSrc.setUserId(user.getId());
		cashFlowSrc.setStatus(0);
		cashFlowSrc.setCategoryID(3);
		cashFlowSrc.setCategoryName("转账");
		cashFlowSrc.setOrderID(order.getId());
		cashFlowSrc = (CashFlow) service.addOrUpdate(cashFlowSrc);
		// 生成转入流水
		cashFlowDst.setAccountID(dstID);
		cashFlowDst.setAccountName(dstAcc.getAccountName());
		cashFlowDst.setAmount(amount);
		cashFlowDst.setCreateTimestamp(new Date());
		cashFlowDst.setUpdateTimeStamp(new Timestamp(new Date().getTime()));
		cashFlowDst.setDstAccountID(accSrc.getAccountID());
		cashFlowDst.setDstAccountName(accSrc.getAccountName());
		cashFlowDst.setSystemGenerated(1);
		cashFlowDst.setUserId(user.getId());
		cashFlowDst.setStatus(0);
		cashFlowDst.setCategoryID(3);
		cashFlowDst.setCategoryName("转账");
		cashFlowDst.setOrderID(order.getId());
		cashFlowDst = (CashFlow) service.addOrUpdate(cashFlowDst);
		// 生成userAction
		UserAction action = new UserAction();
		action.setUser_id(user.getId());
		action.setAction_src_name(accSrc.getAccountName());
		action.setAction_dst_name(dstAcc.getAccountName());
		action.setAction_detail(accSrc.getAccountName() + "转入到" + dstAcc.getAccountName() + "  ...微信端");
		action.setAction_amount(amount + "");
		action.setAction_ip(IPUtil.getLocalIp(request));
		action.setAction_dst_id(dstID);
		action.setAction_src_id(accSrc.getAccountID());
		action.setAction_type("转账");
		action.setAction_res("转账中");
		action = (UserAction) service.addOrUpdate(action);

		// 生成转账标记,以供审核
		TransferRemark tr = new TransferRemark();
		tr.setIdentityId(user.getIdentityId());
		tr.setAmount(amount);
		tr.setComment("转账," + accSrc.getAccountID() + "转入" + dstID + "  ...微信端");
		tr.setIsCompleted(1);
		tr.setTransferType(2);
		tr.setCashID(cashFlowSrc.getId());
		tr.setActionID(action.getId());
		tr.setOrderID(order.getId());
		tr.setUserID(user.getId());
		tr.setDstCashID(cashFlowDst.getId());
		tr.setCreateTime(new Timestamp(new Date().getTime()));
		service.addOrUpdate(tr);

		// 产生体验金
		if (dstID.startsWith("888")) {
			int dayz = 0;
			if (dstID.length() > 9) {
				dayz = Integer.parseInt(dstID.substring(9));
			}
			if (dayz > 29) {
				if (dayz > 29 && dayz < 60) {
					dayz = 30;
				} else if (dayz > 59 && dayz < 90) {
					dayz = 60;
				} else if (dayz > 89 && dayz < 365) {
					dayz = 90;
				}
				ExAmountUtil.exTransfer(service, dayz, user.getId(), amount);
			}
		}
		// 创建数据传输对象,输送到前端
		JSONObject dataJson = new JSONObject();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		dataJson.put("webpageTitle", "转账结果");
		dataJson.put("srcAccPic", srcAccPic);
		dataJson.put("dstAccPic", dstAccPic);
		dataJson.put("srcAccName", accSrc.getAccountName());
		dataJson.put("dstAccName", dstAcc.getAccountName());
		dataJson.put("amount", amount);
//		accountID = request.getParameter("accountID");
		System.out.println("accountID:\t" + accountID);
		dataJson.put("acountID", accountID);
		dataJson.put("cashflowId", cashFlowSrc.getId());
		dataJson.put("tradeType", cashFlowSrc.getCategoryName());
		dataJson.put("statusMsg", "交易成功");
		dataJson.put("createDate", sdf.format(new Date()));
		CacheClearUtil.clearOtherSession(session);
		session.put("dataJson", dataJson);
		response.getWriter().print("{\"retcode\":\"0\"}");
	}
	
	/**
	 * 查询该账户流水线
	 */
	public void queryCashFlow() throws Exception {
		System.out.println("com.nr.umi.action.AccountAction.queryCashFlow()");
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("UTF-8");
		HttpSession session = request.getSession();
		UMIUser user = (UMIUser) session.getAttribute("user");
		if (user == null) {
			return;
		}
		int currCount = 0; // 当前已经加载的流水数量
		int pageCount = 5; // 每次加载量,默认5; 也是第一次加载量,默认10
		int index = 0; // 查询起始索引,保存应从 开始查询起始记录的位置
		String cfCountsStr = request.getParameter("cfCounts").trim();
		if (cfCountsStr != null && !"".equals(cfCountsStr) && !"0".equals(cfCountsStr)) {
			currCount = Integer.parseInt(cfCountsStr);
			index = currCount;
		}
		// 初始化
		if (currCount == 0) {
			pageCount = 10;
		}

		Map<String, Object> params = new HashMap<String, Object>();
		params.put("userId", user.getId());
		params.put("index", index);
		params.put("pageCount", pageCount);

		Map<String, List<JSONObject>> cfMap = CashFlowUtil.processResult(service.queryCashFlow(params));
		JSONObject jsonObj = new JSONObject();
		if (cfMap == null) {
			if (currCount == 0) {
				// retcode为2 表示 数据初始加载,没有获取到数据
				jsonObj.put("retcode", 2);
			} else {
				// retcode为1 表示 数据加载完成,没有数据了
				jsonObj.put("retcode", 1);
			}
			response.getWriter().print(jsonObj);
			return;
		}
		JSONObject cfjson = JSONObject.fromObject(cfMap);
		logger.info("用户 " + user.getId() + " 的当前流水信息为: " + cfjson);
		response.getWriter().print(cfjson);

		return;
	}

	/**
	 * 获取单条流水详情
	 */
	public void getCashflowDetail() throws IOException {
		System.out.println("com.nr.umi.action.AccountAction.getCashflowDetail()...");
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		// 设置文本类型(content type)
		response.setContentType("text/html");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("Cache-Control", "no-cache");

		int cashflowId = 0;
		try {
			cashflowId = Integer.parseInt(request.getParameter("cashflowId").trim());
		} catch (Exception e) {
			e.printStackTrace();
			// 参数为空
			response.getWriter().print("{\"retcode\":\"105\"}");
			return;
		}
		try {
			CashFlow cf = service.queryCashflowById(cashflowId);
			if (cf.getOrderID() == null || cf.getOrderID() == 0) {
				logger.info("用户查看 " + cashflowId + " 流水详情,此流水没有orderId");
				// 不存在流水详情
				response.getWriter().print("{\"retcode\":\"0\",\"cfJsonObj\":" + CashFlowUtil.processResult(cf) + "}");
				return;
			}
			OrderDetail order = service.getOrderDetail(cf.getOrderID());
			if (order == null) {
				// 不存在流水详情
				logger.info("用户查看 " + cashflowId + " 流水详情,order不存在");
				response.getWriter().print("{\"retcode\":\"0\",\"cfJsonObj\":" + CashFlowUtil.processResult(cf) + "}");
				return;
			}
			order = OrderUtil.orderStep(cf, order);
			service.addOrUpdate(order);
			int step = order.getStep();
			int type = order.getType();
			String cashflowDetailMsg = OrderUtil.getDetail(service, cf);

			String retStr = "{\"retcode\":\"0\",\"step\":\"" + step + "\",\"type\":\"" + type + "\",\"message\":"
					+ cashflowDetailMsg + ",\"cfJsonObj\":" + CashFlowUtil.processResult(cf) + "}";

			response.getWriter().print(retStr);
			return;
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e.getCause() == null ? e.getClass() + ": " + e.getMessage()
					: e.getCause().getClass() + ": " + e.getCause().getMessage());
			// 不存在流水详情
			response.getWriter().print("{\"retcode\":\"106\"}");
			return;
		}
	}

	/**
	 * 悠米定期产品详情
	 */
	public String regularDeposit() throws Exception {
		System.out.println("com.nr.umi.action.AccountAction.regularDeposit()...");
		HttpServletRequest request = ServletActionContext.getRequest();
		UMIUser user = (UMIUser) request.getSession().getAttribute("user");
		if (user == null) {
			return "userIsNull";
		}

		String date = service.getMaxDateOfAccount(user.getId());
		accounts = service.findAllAcc(user.getId(), date, accountID);
		logger.info("用户 " + user.getId() + " 的" + accountID + "账户如下:" + accounts);

		DecimalFormat df = new DecimalFormat("#0.00");
		if (accounts != null && accounts.size() > 0) {
			for (UserAccountInfo acc : accounts) {
				profitSum += acc.getProfitAmt();
				amountSum += acc.getBalance() - acc.getFreezedAmount();

				// 设置账户余额,账户表中c_amount字段减去体验金c_freezed_amount
				acc.setBalance(Double.parseDouble(df.format(acc.getBalance() - acc.getFreezedAmount())));

				// 这里设置用户真实本金,只作为显示
				acc.setPrincipal(acc.getPrincipal() - acc.getFreezedAmount());

				/*
				 * acc.setProfitExcepted(Double.parseDouble(df.format(acc.
				 * getProfitExcepted())));
				 * System.out.println(df.format(acc.getProfitExcepted()));
				 * acc.setFreezedAmount(Double.parseDouble(df.format(acc.
				 * getFreezedAmount())));
				 * System.out.println(df.format(acc.getFreezedAmount()));
				 * acc.setProfitAmtSum(Double.parseDouble(df.format(acc.
				 * getProfitAmtSum())));
				 * System.out.println(df.format(acc.getProfitAmtSum()));
				 */

				Calendar expireDate = Calendar.getInstance();
				expireDate.add(Calendar.DATE, acc.getRemainDays());
				acc.setExpirationDate(new SimpleDateFormat("yyyy-MM-dd").format(expireDate.getTime()));
			}
		}
		// profitSum = Double.parseDouble(df.format(profitSum));
		// amountSum = Double.parseDouble(df.format(amountSum));

		return "success" + accountID;
	}

	public String getAccountID() {
		return accountID;
	}

	public void setAccountID(String accountID) {
		this.accountID = accountID;
	}

	public double getProfitSum() {
		return profitSum;
	}

	public void setProfitSum(double profitSum) {
		this.profitSum = profitSum;
	}

	public double getAmountSum() {
		return amountSum;
	}

	public void setAmountSum(double amountSum) {
		this.amountSum = amountSum;
	}

	public List<UserAccountInfo> getAccounts() {
		return accounts;
	}

	public void setAccounts(List<UserAccountInfo> accounts) {
		this.accounts = accounts;
	}
}

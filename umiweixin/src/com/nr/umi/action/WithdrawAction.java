package com.nr.umi.action;

import java.io.IOException;
import java.sql.Timestamp;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;

import com.nr.umi.bean.BankInfo;
import com.nr.umi.bean.CashFlow;
import com.nr.umi.bean.OrderDetail;
import com.nr.umi.bean.TransferRemark;
import com.nr.umi.bean.UMIUser;
import com.nr.umi.bean.UserAccountInfo;
import com.nr.umi.service.UmiService;
import com.nr.umi.util.CacheClearUtil;
import com.nr.umi.util.IPUtil;
import com.nr.umi.util.MD5;
import com.nr.umi.util.TokenUtil;
import com.opensymphony.xwork2.ActionContext;

import net.sf.json.JSONObject;

public class WithdrawAction {
	@Resource
	private UmiService umiService;
	/**
	 * 记录理财产品
	 */
	private String accountID;
	private UMIUser user;
	private BankInfo bankInfo;

	/**
	 * 用户银行账户
	 */
	private UserAccountInfo bankAccount = null;
	/**
	 * 用户提现的理财产品账户 <br />
	 * Financial product account
	 */
	private UserAccountInfo finaAcc = null;

	/**
	 * 加载提现页面
	 */
	public String loadDate() {
		System.out.println("com.nr.umi.action.WithdrawAction.loadDate()");
		Map<String, Object> session = ActionContext.getContext().getSession();
		CacheClearUtil.clearOtherSession(session);
		HttpServletRequest request = ServletActionContext.getRequest();
		// 提现的账户
		String finaAccId = request.getParameter("finaAccId");
		session.put("srcID", accountID);
		user = (UMIUser) session.get("user");
		if (user == null) {
			return "userIsNull";
		}
		bankInfo = umiService.findDBC(user.getId());
		if (bankInfo == null) {
			request.setAttribute("loadDate_message", "还没有绑定过银行卡");
			System.out.println("还没有绑定过银行卡");
		}
		if (finaAccId == null || finaAccId.trim().equals("")) {
			return "error";
		}
		finaAcc = umiService.getUserAccountInfo(Integer.parseInt(finaAccId.trim()), null);
		if (finaAcc == null) {
			System.out.println("不存在该理财账户");
			session.put("withdrawAction_message", "Hi,系统正在维护中,该账户暂时不能提现,如有问题请拨打客服电话");
			return "error";
		}
		bankAccount = umiService.queryWithdrawAmount(user, "200", null);
		if (bankAccount == null) {
			System.out.println("没有银行卡账户");
			return "error";
		}
		session.put("bankInfo", bankInfo);
		session.put("finaAcc", finaAcc);
		session.put("bankAccount", bankAccount);

		DecimalFormat df = new DecimalFormat("#0.00");
		double withdrawalAmount = finaAcc.getBalance() - finaAcc.getFreezedAmount();
		/*if (accountID.startsWith("4")) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
			UserAccountInfo account_401 = umiService.queryWithdrawAmount(user, "401", sdf.format(new Date()));
			if (account_401 != null) {
				withdrawalAmount = account_401.getBalance() + withdrawalAmount;
			}
		}*/
		request.setAttribute("withdrawalAmount", df.format(withdrawalAmount));
		session.put("transfer_step1_token", TokenUtil.getToken(user.getId()));
		return "loadDate" + accountID;
	}

	// 处理输入提现金额请求——>转到——>支付页面
	public String asseAmount() {
		System.out.println("com.nr.umi.action.WithdrawAction.asseAmount()...");
		Map<String, Object> session = ActionContext.getContext().getSession();
		user = (UMIUser) session.get("user");
		if (user == null) {
			return "userIsNull";
		}
		String withdrawOperationToken = TokenUtil.getToken(user.getId());
		HttpServletRequest request = ServletActionContext.getRequest();
		if (request.getParameter("amount") == null || request.getParameter("amount").trim().equals("")) {
			return "error";
		}
		double amount = Double.parseDouble(request.getParameter("amount"));
		session.put("withdrawOperationToken", withdrawOperationToken);
		session.put("amount", amount);
		return "asseAmount";

	}

	// 处理支付密码
	public void confirmPwd() throws IOException {
		System.out.println("com.nr.umi.action.WithdrawAction.confirmPwd()...");
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("UTF-8");
		Map<String, Object> session = ActionContext.getContext().getSession();
		HttpServletRequest request = ServletActionContext.getRequest();

		try {
			if (!session.containsKey("withdrawOperationToken")) {
				System.out.println("本次操作已经结束请返回首页");
				response.getWriter().print("{\"retcode\":\"502\"}");
				return;
			}
			if (session.containsKey("confirmPwdToken")) {
				response.getWriter().print("{\"retcode\":\"501\"}");
				System.out.println("重复提交!");
				return;
			}
		} catch (IOException e) {
			e.printStackTrace();
		}

		user = (UMIUser) session.get("user");
		if (user == null) {
			CacheClearUtil.clearSession(session);
			response.getWriter().print("{\"retcode\":\"201\"}");
			return;
		}
		session.put("confirmPwdToken", TokenUtil.getToken(user.getId()));

		bankInfo = (BankInfo) session.get("bankInfo");
		finaAcc = (UserAccountInfo) session.get("finaAcc");
		bankAccount = (UserAccountInfo) session.get("bankAccount");

		// 悠米账户
		UserAccountInfo userAcc = umiService.queryAccountByUseridAccountID(user.getId(), "800",
				new SimpleDateFormat("yyyyMMdd").format(new Date()));

		String cashPwd = request.getParameter("cashPwd").trim();
		String srcID = (String) session.get("srcID");
		double amount = (double) session.get("amount");

		if (amount == 0 || bankInfo == null || cashPwd == null || finaAcc == null || bankAccount == null) {
			System.out.println("本次提现操作已失效");
			CacheClearUtil.clearOtherSession(session);
			response.getWriter().print("{\"retcode\":\"503\",\"retmessage\":\"本次提现操作已失效,请重新提现!\"}");
			return;
		}

		CashFlow cashflow = null;
		// 验证支付密码的正确性
		if (user.getCashPwd().equals(MD5.getMD5Code(cashPwd))) {
			// 用户action
			UserAction userAction = new UserAction();
			userAction.setUser_id(user.getId());
			userAction.setAction_type("提现");
			userAction.setAction_detail(finaAcc.getAccountName() + "转入到" + bankAccount.getAccountName() + "...微信端");
			userAction.setAction_amount(amount + "");
			userAction.setAction_src_name(finaAcc.getAccountName());
			userAction.setAction_src_id(finaAcc.getAccountID());
			userAction.setAction_dst_name(bankAccount.getAccountName());
			userAction.setAction_dst_id(bankAccount.getAccountID());
			userAction.setAction_ip(IPUtil.getLocalIp(request));
			userAction.setAction_res("转账中");
			userAction = (UserAction) umiService.addOrUpdate(userAction);

			// 订单信息
			OrderDetail orderDetail = new OrderDetail();
			orderDetail.setStep(1);
			orderDetail.setType(4);
			orderDetail.setIsSuccess(1);
			orderDetail.setCreateTime(new Date());
			orderDetail = (OrderDetail) umiService.addOrUpdate(orderDetail);

			// 悠米账户转出流水
			cashflow = new CashFlow();
			cashflow.setUserId(user.getId());
			cashflow.setAccountID(finaAcc.getAccountID());
			cashflow.setAccountName(finaAcc.getAccountName());
			cashflow.setAmount(0 - amount);
			cashflow.setDstAccountID(bankAccount.getAccountID());
			cashflow.setDstAccountName(bankInfo.getBankCode() + "_" + bankInfo.getBankName());
			cashflow.setCategoryID(2);
			cashflow.setCategoryName("提现");
			cashflow.setCreateTimestamp(new Date());
			cashflow.setStatus(1);
			cashflow.setSystemGenerated(1);
			cashflow.setOrderID(orderDetail.getId());
			cashflow = (CashFlow) umiService.addOrUpdate(cashflow);

			// 银行卡转入流水
			CashFlow dstCashflow = new CashFlow();
			dstCashflow.setUserId(user.getId());
			dstCashflow.setAccountID(bankAccount.getAccountID());
			dstCashflow.setAccountName(bankInfo.getBankCode() + "_" + bankInfo.getBankName());
			dstCashflow.setAmount(amount);
			dstCashflow.setDstAccountID(finaAcc.getAccountID());
			dstCashflow.setDstAccountName(finaAcc.getAccountName());
			dstCashflow.setCategoryID(2);
			dstCashflow.setCategoryName("提现");
			dstCashflow.setCreateTimestamp(new Date());
			dstCashflow.setStatus(1);
			dstCashflow.setSystemGenerated(1);
			dstCashflow.setOrderID(orderDetail.getId());
			dstCashflow = (CashFlow) umiService.addOrUpdate(dstCashflow);

			TransferRemark tr = new TransferRemark();
			tr.setCreateTime(new Timestamp(new Date().getTime()));
			tr.setAmount(amount);
			tr.setIsCompleted(0);
			tr.setIdentityId(user.getIdentityId());
			tr.setTransferType(1);
			tr.setActionID(userAction.getId());
			tr.setCashID(cashflow.getId());
			tr.setDstCashID(dstCashflow.getId());
			tr.setOrderID(orderDetail.getId());
			tr.setUserID(user.getId());
			tr.setComment("提现," + srcID + "转入" + bankInfo.getBankName() + bankInfo.getCardId() + "  ...微信端");
			umiService.addOrUpdate(tr);

			// balance是提现后账户的剩余金额,amount是要提现的金额
			double balance = 0.0;
			if (srcID.startsWith("4")) {
				UserAccountInfo account_401 = umiService.queryWithdrawAmount(user, "401",
						new SimpleDateFormat("yyyyMMdd").format(new Date()));
				if (account_401 != null) {
					// 等待计息金额大于或等于提现金额
					if (account_401.getBalance() >= amount) {
						balance = account_401.getBalance() - amount;
						account_401.setBalance(Math.round(balance * 100) / 100.0);
						account_401.setPrincipal(account_401.getBalance());
						// 等待计息金额小于提现金额
					} else {
						account_401.setBalance(0.0);
						account_401.setPrincipal(0.0);
						account_401.setIsValid(0);
					}
					umiService.addOrUpdate(account_401);
				}
				balance = finaAcc.getBalance() - amount;
				finaAcc.setBalance(Math.round(balance * 100) / 100.0);
				finaAcc.setPrincipal(finaAcc.getBalance());
			} else if (srcID.startsWith("888")) {
				balance = finaAcc.getBalance() - amount;
				finaAcc.setBalance(Math.round(balance * 100) / 100.0);
				if (finaAcc.getBalance() < 0.01) {
					finaAcc.setIsValid(0);
					// 账户余额小于0.01
					umiService.updateAccountOfWithdraw(user.getId(), finaAcc.getAccountID(), finaAcc.getDate());
				}
			}
			finaAcc = (UserAccountInfo) umiService.addOrUpdate(finaAcc);

			balance = userAcc.getBalance() - amount;
			userAcc.setBalance(Math.round(balance * 100) / 100.0);
			umiService.addOrUpdate(userAcc);
		} else {
			try {
				session.remove("confirmPwdToken");
				response.getWriter().print("{\"retcode\":\"1\",\"retmessage\":\"支付密码错误\"}");
			} catch (IOException e) {
				e.printStackTrace();
			}
			return;
		}

		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		JSONObject dataJson = new JSONObject();
		dataJson.put("webpageTitle", "提现结果");
		dataJson.put("srcAccPic", this.getAccountPic(srcID));
		dataJson.put("srcAccName", finaAcc.getAccountName());
		dataJson.put("dstAccPic", bankInfo.getBankPic());
		dataJson.put("dstAccName", bankInfo.getBank());
		dataJson.put("tailNum", "("+bankInfo.getTailNum()+")");
		dataJson.put("createDate", sdf.format(new Date()));
		dataJson.put("amount", session.get("amount"));
		dataJson.put("acountID", session.get("srcID"));
		dataJson.put("cashflowId", cashflow.getId());
		dataJson.put("tradeType", cashflow.getCategoryName());
		dataJson.put("statusMsg", "处理中");
		CacheClearUtil.clearOtherSession(session);
		session.put("dataJson", dataJson);

		try {
			response.getWriter().print("{\"retcode\":\"0\"}");
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public String getAccountPic(String accountId) {
		if (accountId.startsWith("400")) {
			return "index_09.png";
		} else if (accountId.startsWith("100")) {
			return "index_12.png";
		} else if (accountId.startsWith("300")) {
			return "index_15.png";
		} else if (accountId.startsWith("700")) {
			return "index_19.png";
		} else if (accountId.startsWith("900")) {
			return "index_90.png";
		} else if (accountId.startsWith("888")) {
			return "logo-custom.png";
		}
		return null;
	}

	public String getAccountID() {
		return accountID;
	}

	public void setAccountID(String accountID) {
		this.accountID = accountID;
	}

}

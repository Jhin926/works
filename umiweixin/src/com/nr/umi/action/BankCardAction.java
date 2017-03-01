package com.nr.umi.action;

import java.io.IOException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.apache.struts2.ServletActionContext;

import com.nr.umi.bean.BankInfo;
import com.nr.umi.bean.BankLimit;
import com.nr.umi.bean.FRUserInfo;
import com.nr.umi.bean.UMIUser;
import com.nr.umi.bean.UserAccountInfo;
import com.nr.umi.bean.UserBank;
import com.nr.umi.service.BankCardService;
import com.nr.umi.service.UmiService;
import com.nr.umi.util.BankUtil;
import com.nr.umi.util.CacheClearUtil;
import com.nr.umi.util.CutStringUtil;
import com.nr.umi.util.ExAmountUtil;
import com.nr.umi.util.SinaUtil;
import com.nr.umi.util.TokenUtil;
import com.opensymphony.xwork2.ActionContext;

import net.sf.json.JSONObject;

/**
 * 
 * @author yi.yuan
 *
 *         Established in 2015年9月16日
 */
public class BankCardAction {
	@Resource
	private BankCardService bankCardService;
	@Resource
	private UmiService umiService;

	private String company_400_id = "1000014";// 悠米活期账户
	private UMIUser user;
	// 用于存储绑卡结果
	private String bandingBankCard_message = null;

	private static Logger logger = Logger.getLogger(BankCardAction.class);

	/**
	 * 加载用户银行卡信息
	 */
	public String loadUserBankInfo() {
		Map<String, Object> session = ActionContext.getContext().getSession();
		CacheClearUtil.clearOtherSession(session);
		HttpServletRequest request = ServletActionContext.getRequest();
		user = (UMIUser) session.get("user");
		if (user == null) {
			return "userIsNull";
		}

		List<BankInfo> bis = umiService.findAllBanks(user.getId());
		request.setAttribute("bis", bis);
		return "loadUserBankInfo";

	}

	/**
	 * 验证银行卡号是否已经存在
	 */
	public void validateBankCard() {
		Map<String, Object> session = ActionContext.getContext().getSession();
		HttpServletResponse response = ServletActionContext.getResponse();
		HttpServletRequest request = ServletActionContext.getRequest();
		response.setCharacterEncoding("UTF-8");
		user = (UMIUser) session.get("user");
		String cardNo = request.getParameter("cardNo");
		if (cardNo == null || cardNo.equals("")) {
			try {
				response.getWriter().print("3");
			} catch (IOException e) {
				e.printStackTrace();
			}
			return;
		}
		cardNo = BankUtil.getBankCard(request.getParameter("cardNo").trim());
		UserBank userBank = umiService.findBankByNo(user.getId(), cardNo);

		// 数据库中若已存在该银行卡,则返回 1 , 否则返回0
		try {
			if (userBank == null) {
				response.getWriter().print("0");
			} else {
				response.getWriter().print("1");
			}
			return;
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 切换默认银行卡
	 */
	public void switchCards() throws Exception {
		System.out.println("com.nr.umi.action.BankCardAction.switchCards()");
		HttpServletResponse response = ServletActionContext.getResponse();
		HttpServletRequest request = ServletActionContext.getRequest();
		response.setCharacterEncoding("UTF-8");

		// 标志行为,0 表示切换银行卡
		int actionTag = 0;
		Map<String, Object> session = ActionContext.getContext().getSession();
		user = (UMIUser) session.get("user");
		if (user == null) {
			// 用户不存在
			CacheClearUtil.clearSession(session);
			response.getWriter().print("{\"retcode\":\"2\"}");
			return;
		}

		// 获取CradId
		int cardId = Integer.parseInt(request.getParameter("bankCard").trim());
		UserBank bank = umiService.findBankByCardId(cardId);
		if (bank.getIsVerified() == 1) {
			response.getWriter().print("{\"retcode\":\"1\",\"retmessage\":\"该银行卡当前是默认银行卡\"}");
			return;
		}

		session.put("switchCardId", cardId);
		session.put("actionTag", actionTag);

		String cardCode = bank.getBankCode();
		String phoneNo = bank.getReversedPhone();
		String bankAccountNo = bank.getCard_no();
		/* String bankName = BankUtil.getBankName(cardCode.toUpperCase()) + "(尾号"
		 * + bankAccountNo.substring(bankAccountNo.length() - 4) + ")"; */

		// rsp:切换银行卡所需数据
		Map<String, String> rsp = new HashMap<String, String>();
		rsp.put("bank_code", cardCode);
		rsp.put("bank_account_no", bankAccountNo);
		rsp.put("phone_no", phoneNo);
		// 将切换银行卡所需数据放到json中
		session.put("rsp", rsp);
		String bindCardStr = null; // 接收银行卡绑定返回的信息
		bindCardStr = SinaUtil.bindingBankCard(umiService, user, rsp);
		System.out.println(bindCardStr);
		JSONObject retObj = JSONObject.fromObject(bindCardStr);
		if (retObj.getString("retcode").equals("1")) {
			response.getWriter().print("{\"retcode\":\"1\",\"retmessage\":\"" + retObj.getString("retmessage") + "\"}");
			return;
		} else if (retObj.getString("retcode").equals("2")) {
			response.getWriter().print("{\"retcode\":\"2\"}");
			return;
		}
		response.getWriter().print("{\"retcode\":\"0\"}");
		return;
	}

	/**
	 * 绑卡选择银行卡后,ajax请求
	 */
	public void loadBankLimit() {
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("UTF-8");
		String bankCode = request.getParameter("bankCode");
		BankLimit bl = umiService.queryBanklimitByCode(bankCode.trim().toUpperCase());
		JSONObject blJson = JSONObject.fromObject(bl);
		try {
			response.getWriter().print(blJson);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	/**
	 * 添加新银行卡
	 */
	public void bindingBankCard() throws Exception {
		System.out.println("com.nr.umi.action.BankCardAction.bindingBankCard()");
		// 标志行为,0 表示切换银行卡
		int actionTag = 1;
		Map<String, Object> session = ActionContext.getContext().getSession();
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("UTF-8");

		if (request.getParameter("cardNo") == null || request.getParameter("cardNo").equals("")) {
			response.getWriter().print("{\"retcode\":\"1\",\"retmessage\":\"银行卡号不能为空\"}");
			return;
		}
		String cardNo = BankUtil.getBankCard(request.getParameter("cardNo").trim());
		String bankCode = request.getParameter("bankCode");
		String phoneNo = request.getParameter("phoneNo");
		/* String bankName = BankUtil.getBankName(bankCode.toUpperCase()) + "(尾号" +
		 * cardNo.substring(cardNo.length() - 4)
		 * + ")"; */

		user = (UMIUser) session.get("user");
		session.put("actionTag", actionTag);

		UserBank oBank = umiService.findBankByNo(user.getId(), cardNo);
		if (oBank != null) {
			if (oBank.getIsVerified() == 1) {
				response.getWriter().print("{\"retcode\":\"1\",\"retmessage\":\"该银行卡号已经绑定!\"}");
				bandingBankCard_message = "绑卡失败,错误原因: 该卡号已经绑定！";
			} else {
				response.getWriter().print("{\"retcode\":\"1\",\"retmessage\":\"该银行卡号已存在,请选择切换银行卡!\"}");
				bandingBankCard_message = "绑卡失败,错误原因: 该卡号已存在,请选择切换银行卡！";
			}
			System.out.println(bandingBankCard_message);
			session.put("bandingBankCard_message", bandingBankCard_message);
			return;
		}

		// rsp:包含绑定银行卡所需数据
		Map<String, String> rsp = new HashMap<String, String>();
		rsp.put("bank_code", bankCode);
		rsp.put("bank_account_no", cardNo);
		rsp.put("phone_no", phoneNo);
		// 将绑定银行卡所需数据放到json中
		session.put("rsp", rsp);
		String bindCardStr = null; // 接收银行卡绑定返回的信息

		bindCardStr = SinaUtil.bindingBankCard(umiService, user, rsp);
		System.out.println(bindCardStr);

		JSONObject bcJson = JSONObject.fromObject(bindCardStr);
		if (bcJson.getString("retcode").equals("1")) {
			response.getWriter().print("{\"retcode\":\"1\",\"retmessage\":\"" + bcJson.getString("retmessage") + "\"}");
			return;
		} else if (bcJson.getString("retcode").equals("2")) {
			response.getWriter().print("{\"retcode\":\"2\"}");
			return;
		}
		System.out.println("绑卡初步验证成功");
		response.getWriter().print("{\"retcode\":\"0\"}");
		return;
	}

	/**
	 * 绑定银行卡推进
	 */
	public void bindingBankCardAdvance() {
		System.out.println("com.nr.umi.action.BankCardAction.bindingBankCardAdvance()");
		Map<String, Object> session = ActionContext.getContext().getSession();
		user = (UMIUser) session.get("user");
		HttpServletRequest request = ServletActionContext.getRequest();
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("UTF-8");
		// 服务端防止重复请求
		try {
			if (!session.containsKey("actionTag")) {
				bandingBankCard_message = "本次操作已经结束请返回首页";
				System.out.println(bandingBankCard_message);
				session.put("bandingBankCard_message", bandingBankCard_message);
				response.getWriter().print("{\"retcode\":\"502\"}");
				return;
			}
			if (session.containsKey("bindingBankCardAdvanceToken")) {
				response.getWriter().print("501");
				response.getWriter().print("{\"retcode\":\"501\"}");
				System.out.println("重复提交!");
				return;
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
		session.put("bindingBankCardAdvanceToken", TokenUtil.getToken(user.getId()));

		// 获取行为标志
		int actionTag = (int) session.get("actionTag");
		String validCode = request.getParameter("validCode");

		String api_response = umiService.queryApiResponse(user.getId(), "binding_bank_card");
		JSONObject api_obj = JSONObject.fromObject(api_response);
		String ticket = api_obj.getString("ticket");

		Map<String, String> params = new HashMap<String, String>();
		params.put("ticket", ticket);
		params.put("valid_code", validCode);

		String resp1 = SinaUtil.bindingBankCardAdvance(umiService, params, user);

		JSONObject resobj1 = JSONObject.fromObject(resp1);

		// 绑定出错
		try {
			if (resobj1.get("retcode").equals("1")) {
				System.out.println("绑卡失败,错误原因: " + resobj1.get("retmessage"));
				/* bandingBankCard_message = "绑卡失败,错误原因: " + resobj1.get("retmessage");
				 * session.put("bandingBankCard_message", bandingBankCard_message); */

				session.remove("bindingBankCardAdvanceToken");
				response.getWriter().print("{\"retcode\":\"1\",\"retmessage\":\"" + resobj1.get("retmessage") + "\"}");
				return;
			} else if (resobj1.get("retcode").equals("2")) {
				System.out.println(resobj1.get("retmessage"));
				/* CacheClearUtil.clearSession(session);
				 * bandingBankCard_message = "绑卡失败,个人信息有误,请重新登录!"; */

				session.put("bandingBankCard_message", bandingBankCard_message);
				response.getWriter().print("{\"retcode\":\"2\"}");
				return;
			}
		} catch (IOException e) {
			e.printStackTrace();
		}

		// 绑定成功,新浪那边返回要绑卡的的cardId
		String cardIdOfBindingBank = resobj1.getString("card_id");
		String resp2 = SinaUtil.queryBankCards(umiService, user);
		JSONObject resobj2 = JSONObject.fromObject(resp2);
		List<String> cardIds = null;
		if (resobj2.getString("retcode").equals("0")) {
			// 有多张银行卡,则解绑其他银行卡
			if (resobj2.getString("card_list").contains("|")) {
				cardIds = CutStringUtil.getCardIds(resobj2.getString("card_list"));
				cardIds.remove(cardIdOfBindingBank);

				JSONObject user_json = new JSONObject();
				user_json.put("token", user.getToken());
				user_json.put("card_list", cardIds);

				String resp3 = SinaUtil.unBindingCard(umiService, user_json, company_400_id);
				System.out.println(resp3);
				JSONObject resobj3 = JSONObject.fromObject(resp3);
				if (resobj3.getString("retcode").equals("2")) {
					logger.info("用户" + user.getId() + "解绑银行卡失败了 ");
				}

				logger.info("用户" + user.getId() + "解绑了如下银行卡: " + cardIds);
			}
		}
		UserAccountInfo userAccount = umiService.queryAccountByUseridAccountID(user.getId(), "200");
		if (userAccount == null) {
			userAccount = new UserAccountInfo();
			userAccount.setAccountID("200");
			userAccount.setUser_id(user.getId());
			userAccount.setDate(new Date());
			userAccount.setIsValid(1);
			userAccount.setTimestamp(new Timestamp(new Date().getTime()));
		}

		UserAction userAction = umiService.findAction(user.getId(), null, "绑定银行卡");
		String content = userAction.getAction_detail();
		JSONObject json = JSONObject.fromObject(content);

		List<Object> list = new ArrayList<Object>();
		UserBank bank = umiService.queryVerifiedBankByUserId(user.getId());
		if (bank != null) {
			// 银行卡状态置为未绑定
			bank.setIsVerified(0);
			umiService.addOrUpdate(bank);
		}
		UserBank newBank = null;

		// 切换卡
		if (actionTag == 0) {
			int cardId = (int) session.get("switchCardId");
			newBank = umiService.findBankByCardId(cardId);
			if (newBank == null) {
				user.setCardCount(user.getCardCount() + 1);
			}
			// 添加绑卡
		} else {
			newBank = new UserBank();
			newBank.setUser_id(user.getId());
			newBank.setCard_no(json.getString("bankAccountNo"));
			newBank.setBank_name(json.getString("bankName"));
			newBank.setBankCode(json.getString("bankCode"));
			newBank.setReversedPhone(json.getString("phoneNo"));
			user.setCardCount(user.getCardCount() + 1);
		}
		newBank.setIsVerified(1);
		newBank.setAccount_name(user.getRealName());
		newBank.setCard_id(cardIdOfBindingBank);
		userAccount.setAccountName(json.getString("bankName"));
		userAccount.setValidated(1);

		list.add(newBank);
		list.add(userAccount);
		umiService.updateList(list);
		user = (UMIUser) umiService.addOrUpdate(user);

		CacheClearUtil.clearSession(session);
		session.put("user", user);
		
		try {
			// 产生体验金
			FRUserInfo frUser = umiService.findFRUserInfo(user.getId());
			if (frUser != null && frUser.getBankFlag() != null && frUser.getBankFlag() == 0) {
				ExAmountUtil.exTransfer(umiService, 30, user.getId(), 0);
			}
		} catch (Exception e) {
			logger.error(e.getCause() == null ? e.getClass() + ": " + e.getMessage()
					: e.getCause().getClass() + ": " + e.getCause().getMessage());
			logger.error("第一次绑卡操作,赠送用户 " + user.getId() + " 体验金时,抛异常");
			e.printStackTrace();
		}
		
		try {
			response.getWriter().print("{\"retcode\":\"0\"}");
		} catch (IOException e) {
			e.printStackTrace();
		}
		System.out.println("绑卡成功!");
		return;
	}

	/**
	 * 获取验证码 返回 0表示成功,1表示失败,2表示重新绑卡
	 */
	public void getVerCode() {
		System.out.println("com.nr.umi.action.BankCardAction.getVerCode()");
		Map<String, Object> session = ActionContext.getContext().getSession();
		HttpServletResponse response = ServletActionContext.getResponse();
		response.setCharacterEncoding("UTF-8");
		user = (UMIUser) session.get("user");

		try {
			if (!session.containsKey("actionTag")) {
				System.out.println("本次操作已经结束请返回首页");
				response.getWriter().print("502");
				return;
			}
		} catch (IOException e) {
			e.printStackTrace();
		}

		Map<String, String> rsp = (Map<String, String>) session.get("rsp");
		String bindCardStr = SinaUtil.bindingBankCard(umiService, user, rsp);
		try {
			JSONObject obj = JSONObject.fromObject(bindCardStr);
			if (obj.getString("retcode").equals("1")) {
				response.getWriter().print("1");
			} else if (obj.getString("retcode").equals("2")) {
				response.getWriter().print("2");
			} else {
				response.getWriter().print("0");
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public String getBandingBankCard_message() {
		return bandingBankCard_message;
	}

	public void setBandingBankCard_message(String bandingBankCard_message) {
		this.bandingBankCard_message = bandingBankCard_message;
	}

}

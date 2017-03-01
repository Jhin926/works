package com.nr.umi.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import com.nr.umi.action.UserAction;
import com.nr.umi.bean.BankInfo;
import com.nr.umi.bean.BankLimit;
import com.nr.umi.bean.CashFlow;
import com.nr.umi.bean.CenterProcess;
import com.nr.umi.bean.Experience;
import com.nr.umi.bean.FRUserInfo;
import com.nr.umi.bean.OrderDetail;
import com.nr.umi.bean.Text;
import com.nr.umi.bean.UMIUser;
import com.nr.umi.bean.UserAccountInfo;
import com.nr.umi.bean.UserBank;
import com.nr.umi.bean.UserRelation;
import com.nr.umi.bean.UserSession;
import com.nr.umi.bean.UserSummary;
import com.nr.umi.bean.WechatToken;
import com.nr.umi.bean.Yield;
import com.nr.umi.dao.UmiDao;
import com.nr.umi.util.BankUtil;
import com.nr.umi.util.CashFlowUtil;
import com.nr.umi.util.CutStringUtil;

import net.sf.json.JSONObject;

public class UmiService {

	@Resource(name = "umiDao")
	private UmiDao dao;

	public UMIUser userCheck(String userName) {
		UMIUser user = dao.getUMIUserByUserName(userName);
		return user;
	}

	public Object addOrUpdate(Object obj) {
		return dao.saveOrUpdate(obj);
	}

	public UserRelation queryRelationByUserId(int id) {
		return dao.queryRelationByUserId(id);
	}

	public List<UserSummary> querySummaryRefererId(int id) {
		List<UserSummary> summarys = dao.querySummaryRefererId(id);
		return summarys;
	}

	public List<UserAccountInfo> findAllAcc(int userID, String date, String accountID) {
		return dao.findAllAcc(userID, date, accountID);
	}

	/**
	 * 
	 * 根据剩余天数查询账户信息
	 * @param accountID 账户code数组
	 * @param userID 	用户id
	 * @param remainDays 剩余天数
	 * @param date		 时间,若为null,则默认为当前时间
	 * @return 返回剩余天数为  remainDays 的子账户
	 */
	public List<UserAccountInfo> findAccByRemainDays(String accountID[], int userID, int remainDays, String date) {
		List<UserAccountInfo> results = new ArrayList<>();
		for (int i = 0; i < accountID.length; i++) {
			List<UserAccountInfo> list = this.findAccByRemainDays(accountID[i], userID, remainDays, date);
			if (list == null) {
				continue;
			}
			results.addAll(list);
		}
		return results;
	}
	
	/**
	 * 根据剩余天数查询账户信息
	 * @param accountID 账户code
	 * @param userID 	用户id
	 * @param remainDays 剩余天数
	 * @param date		 时间, 若为null,则默认为当前时间
	 * @return 返回剩余天数为  remainDays 的子账户
	 */
	public List<UserAccountInfo> findAccByRemainDays(String accountID, int userID, int remainDays, String date) {
		if (date == null) {
			date = new SimpleDateFormat("yyyyMMdd").format(new Date());
		}
		List<UserAccountInfo> results = dao.findAccByRemainDays(accountID, userID, remainDays, date);
		if (results != null) {
			for (UserAccountInfo acc : results) {
				acc.setAccountPic(CashFlowUtil.getAccountPicById(acc.getAccountID()));
			}
		}
		return results;
	}
	
	/**
	 * 判断用户当天账户是否已经生成
	 * 
	 * @param userID
	 *            用户Id
	 * @return 如果800账户生成,则返回true,反之返回false
	 */
	public boolean todayAccIsGenerated(int userID) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		UserAccountInfo account_800 = dao.queryAccountByUseridAccountID(userID, "800", sdf.format(new Date()));
		if (account_800 == null) {
			return false;
		} else {
			return true;
		}
	}
	
	/**
	 * 设置从dao获取到的银行卡信息
	 * 
	 * @param banks
	 */
	public void setCardInfo(List<BankInfo> banks) {
		/*
		 * 该遍历是为了将银行信息表中的一个字段信息拆分到两个属性中,并通过这种方式来为目前现有的银行写死其图标.
		 * 目前该bi只有一个元素，防止以后扩展功能,暂时就这样放着,不影响
		 */
		for (BankInfo bi : banks) {
			switch (bi.getBankCode()) {
			// 农业银行
			case "ABC": {
				bi.setBankPic("bk-ny.png");
				bi.setBank(CutStringUtil.getPreStringByCh(bi.getBankName(), '('));
				bi.setTailNum(CutStringUtil.getSufStringByCh(bi.getBankName(), '('));
				break;
			}
				// 中国银行
			case "BOC": {
				bi.setBankPic("bk-zg.png");
				bi.setBank(CutStringUtil.getPreStringByCh(bi.getBankName(), '('));
				bi.setTailNum(CutStringUtil.getSufStringByCh(bi.getBankName(), '('));
				break;
			}
				// 建设银行
			case "CCB": {
				bi.setBankPic("bk-js.png");
				bi.setBank(CutStringUtil.getPreStringByCh(bi.getBankName(), '('));
				bi.setTailNum(CutStringUtil.getSufStringByCh(bi.getBankName(), '('));
				break;
			}
				// 光大银行
			case "CEB": {
				bi.setBankPic("bk-gd.png");
				bi.setBank(CutStringUtil.getPreStringByCh(bi.getBankName(), '('));
				bi.setTailNum(CutStringUtil.getSufStringByCh(bi.getBankName(), '('));
				break;
			}
				// 兴业银行
			case "CIB": {
				bi.setBankPic("bk-xy.png");
				bi.setBank(CutStringUtil.getPreStringByCh(bi.getBankName(), '('));
				bi.setTailNum(CutStringUtil.getSufStringByCh(bi.getBankName(), '('));
				break;
			}
				// 中信银行
			case "CITIC": {
				bi.setBankPic("bk-zx.png");
				bi.setBank(CutStringUtil.getPreStringByCh(bi.getBankName(), '('));
				bi.setTailNum(CutStringUtil.getSufStringByCh(bi.getBankName(), '('));
				break;
			}
				// 招商银行
			case "CMB": {
				bi.setBankPic("bk-zs.png");
				bi.setBank(CutStringUtil.getPreStringByCh(bi.getBankName(), '('));
				bi.setTailNum(CutStringUtil.getSufStringByCh(bi.getBankName(), '('));
				break;
			}
				// 民生银行
			case "CMBC": {
				bi.setBankPic("bk-ms.png");
				bi.setBank(CutStringUtil.getPreStringByCh(bi.getBankName(), '('));
				bi.setTailNum(CutStringUtil.getSufStringByCh(bi.getBankName(), '('));
				break;
			}
				// 广东发展银行
			case "GDB": {
				bi.setBankPic("bk-gf.png");
				bi.setBank(CutStringUtil.getPreStringByCh(bi.getBankName(), '('));
				bi.setTailNum(CutStringUtil.getSufStringByCh(bi.getBankName(), '('));
				break;
			}
				// 工商银行
			case "ICBC": {
				bi.setBankPic("bk-gs.png");
				bi.setBank(CutStringUtil.getPreStringByCh(bi.getBankName(), '('));
				bi.setTailNum(CutStringUtil.getSufStringByCh(bi.getBankName(), '('));
				break;
			}
				// 中国邮政储蓄银行
			case "PSBC": {
				bi.setBankPic("bk-yc.png");
				bi.setBank(CutStringUtil.getPreStringByCh(bi.getBankName(), '('));
				bi.setTailNum(CutStringUtil.getSufStringByCh(bi.getBankName(), '('));
				break;
			}
				// 浦东发展银行
			case "SPDB": {
				bi.setBankPic("bk-pf.png");
				bi.setBank(CutStringUtil.getPreStringByCh(bi.getBankName(), '('));
				bi.setTailNum(CutStringUtil.getSufStringByCh(bi.getBankName(), '('));
				break;
			}
				// 平安银行
			case "SZPAB": {
				bi.setBankPic("bk-pa.png");
				bi.setBank(CutStringUtil.getPreStringByCh(bi.getBankName(), '('));
				bi.setTailNum(CutStringUtil.getSufStringByCh(bi.getBankName(), '('));
				break;
			}
			default:
				break;
			}
		}
	}

	/**
	 * @param userID
	 *            用户ID
	 * @return 根据userID返回该账户的默认银行卡 DBC:是 default bank card的缩写
	 */
	public BankInfo findDBC(int userID) {
		List<BankInfo> banks = dao.findDBC(userID);
		if (banks == null || banks.size() == 0) {
			return null;
		}
		this.setCardInfo(banks);
		return banks.get(0);
	}

	/**
	 * @param userID
	 *            用户ID
	 * @return 根据userID返回该账户的所有银行账号信息
	 */
	public List<BankInfo> findAllBanks(int userID) {
		List<BankInfo> banks = dao.findAllBanks(userID);
		if (banks == null || banks.size() == 0) {
			return null;
		}
		this.setCardInfo(banks);
		BankLimit bl = null;
		for (BankInfo bi : banks) {
			bl = this.queryBanklimitByCode(bi.getBankCode());
			bi.setBankLimit(bl);
		}
		return banks;
	}

	/**
	 * 查询文档信息
	 * @param text 文档名
	 * @param version 版本号
	 * @return
	 */
	public Text findText(String text, String version) {
		return dao.findText(text, version);
	}

	/**
	 * 获取理财产品收益率
	 * @param text
	 * @param version
	 * @return
	 */
	public double getRate(String text, String version) {
		Text textObj = this.findText(text, version);
		JSONObject json = JSONObject.fromObject(textObj.getContent().trim());
		return json.getDouble("rate");
	}
	
	public UserSession findSession() {
		return dao.findSession();
	}

	public WechatToken findWechatTokenByUserID(int userID) {
		return dao.findWechatTokenByUserID(userID);
	}

	public WechatToken findWechatTokenByOpenID(String openID) {
		return dao.findWechatTokenByOpenID(openID);
	}

	public double queryFreezedAmount(int userID) {
		return dao.queryFreezedAmount(userID);
	}

	public int updateList(List<Object> list) {
		return dao.updateList(list);
	}

	public UMIUser getUserByToken(String token) {
		return dao.getUserByToken(token);
	}

	public UMIUser findUserByID(String id) {
		return dao.findUserById(id);
	}

	/**
	 * 根据用户id和api类型查询api请求
	 * 
	 * @param userId
	 *            用户id
	 * @param apiName
	 *            api类型
	 * @return
	 */
	public String queryApiResponse(Integer userId, String apiName) {
		return dao.queryApiRequest(userId, apiName);

	}

	/**
	 * 查询用户绑定银行卡
	 * 
	 * @param userID
	 *            用户id
	 * @return
	 */
	public UserBank queryVerifiedBankByUserId(int userID) {
		return dao.queryVerifiedBankByUserId(userID);
	}

	public FRUserInfo findFRUserInfo(int userID) {
		return dao.findFRUserInfo(userID);
	}

	public Experience findExperience(int userID, String accountID) {
		return dao.findExperience(userID, accountID);
	}

	public Experience findExperience(int userID, int days) {
		return dao.findExperience(userID, days);
	}
	
	/**
	 * 模糊查询 like
	 * @param user
	 * @param accountID
	 * @return 获取一个账户下accountID产品的可提现账户
	 */
	public UserAccountInfo queryWithdrawAmount(UMIUser user, String accountID, String date) {
		return dao.queryWithdrawAmount(user, accountID, date);
	}

	/**
	 * 精确查询
	 * @param userId  用户id
	 * @param accountId  用户的账户id
	 * @param date  当天时间
	 * @return  如果date不为空,则返回当天用户某个账户的一个最近子账户
	 */
	public UserAccountInfo queryAccountByUseridAccountID(Integer userId, String accountId, String date) {
		return dao.queryAccountByUseridAccountID(userId, accountId, date);
	}
	
	/**
	 * 精确查询
	 * @param userId  用户id
	 * @param accountId  用户的账户id
	 * @return  返回用户某个账户下的最近一个子账户
	 */
	public UserAccountInfo queryAccountByUseridAccountID(Integer userId, String accountId) {
		return this.queryAccountByUseridAccountID(userId, accountId, null);
	}
	
	/**
	 * 
	 * @param userID
	 *            用户id
	 * @param cardNo
	 *            银行卡号
	 * @return 返回t_user_bank_info表中对应的银行账号
	 */
	public UserBank findBankByNo(int userID, String cardNo) {
		return dao.findBankByNo(userID, cardNo);
	}

	
	/**
	 * 根据用户id和交易号查询交易信息表
	 * 
	 * @param userID
	 *            用户id
	 * @param out_trade_no
	 *            交易号
	 * @param actionType
	 *            动作类型,一般绑卡的时候需要给定,并且该值如果存在,一般指定为"绑定银行卡"
	 * @return
	 */
	public UserAction findAction(int userID, String out_trade_no, String actionType) {
		return dao.findAction(userID, out_trade_no, actionType);
	}

	/**
	 * 根据cardid查询银行卡信息
	 * 
	 * @param cardID
	 * @return
	 */
	public UserBank findBankByCardId(int cardID) {
		return dao.findBankByCardId(cardID);
	}

	/**
	 * 绑定银行卡
	 * 
	 * @param userBank
	 * @param user
	 * @param userAccount
	 * @return
	 */
	public UserBank bindingCard(UserBank userBank, UMIUser user, UserAccountInfo userAccount) {
		return dao.bindingCard(userBank, user, userAccount);
	}

	/**
	 * 查询流水信息
	 * 
	 * @param params
	 * @return
	 */
	public List<CashFlow> queryCashFlow(Map<String, Object> params) {
		return dao.queryCashFlow(params);
	}

	/**
	 * 根据用户id和记录id查询流水信息
	 * 
	 * @param userID
	 *            用户id
	 * @param recordID
	 *            记录account的ID <br />
	 *            eg:银行账户200
	 * @return 返回用户最新的流水记录
	 */
	public CashFlow queryCashFlows(int userID, String recordID) {
		return dao.queryCashFlows(userID, recordID);
	}

	/**
	 * 根据id获取cashflow
	 * @param cashflowId: 流水的id
	 * @return
	 */
	public CashFlow queryCashflowById(int cashflowId) {
		return dao.queryCashflowById(cashflowId);
	}
	
	/**
	 * 返回用户最近的actionID
	 * 
	 * @param userID
	 * @return
	 */
	public Integer getActionID(int userID) {
		return dao.getActionID(userID);
	}

	/**
	 * 
	 * @param id
	 * @return 返回账户最近一天的时间
	 */
	public String getMaxDateOfAccount(int id) {
		return dao.getMaxDateOfAccount(id);
	}

	/**
	 * 根据账户accountID返回 账户,返回指定日期的账户
	 * @param accountID 账户id
	 * @param date 指定日期之内,date若为null,则默认是今天
	 * @return
	 */
	public UserAccountInfo getUserAccountInfo(Integer accountID, String date) {
		if (date == null) {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
			date = sdf.format(new Date());
			return dao.getUserAccountInfo(accountID, date);
		} else {
			return dao.getUserAccountInfo(accountID, date);
		}
	}

	/**
	 * 获取昨日收益率
	 * 
	 * @param date
	 * @return
	 */
	@SuppressWarnings("static-access")
	public Yield getYields() {
		Calendar calendar = Calendar.getInstance();
		calendar.add(calendar.DAY_OF_YEAR, -1); // 把日期往后增加一天.整数往后推,负数往前移动
		Date date = calendar.getTime(); // 这个时间就是日期往后推一天的结果
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMdd");
		String dateString = formatter.format(date);

		return dao.getYields(dateString);

	}

	/**
	 * 获取所有银行卡的限额信息
	 */
	public List<BankLimit> queryAllBanklimit() {
		List<BankLimit> banklimits = dao.queryAllBanklimit();
		try {
			for (BankLimit bl : banklimits) {
				bl.setBankName(BankUtil.getBankName(bl.getBankCode()));
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return banklimits;
	}

	/**
	 * 根据银行卡code获取银行限额
	 * @param code
	 */
	public BankLimit queryBanklimitByCode(String code) {
		BankLimit bl = dao.queryBanklimitByCode(code);
		try {
			bl.setBankName(BankUtil.getBankName(bl.getBankCode()));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return bl;
	}

	/**
	 * 用于提现操作
	 * 把该用户的账户accountId在c_date之前的c_is_valid设置为0
	 * @param userId 
	 * @param accountId 提现的理财账户
	 * @param date 该账户的c_date时间
	 */
	public void updateAccountOfWithdraw(Integer userId, String accountID, Date date) {
		SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMdd");
		dao.updateAccountOfWithdraw(userId, accountID, formatter.format(date));
	}
	
	/**
	 * 根据用户id查询中间表
	 * @param userID 用户id
	 * @return
	 */
	public CenterProcess findProcessByUserID(int userID) {
		return dao.findProcessByUserID(userID);
	}
	
	/**
	 * 根据订单号查询中间表
	 * @param orderNo 订单号
	 * @return
	 */
	public CenterProcess findProcessByOrderNo(String orderNo) {
		return dao.findProcessByOrderNo(orderNo);
	}
	
	/**
	 * 根据id查询流水详情
	 * @param id
	 * @return
	 */
	public OrderDetail getOrderDetail(int id) {
		return dao.getOrderDetail(id);
	}
	
	/**
	 * 删除用户的流水
	 * @param ids 流水id数组
	 * @param userId 用户id
	 */
	public void delCashFlowByIds(Integer[] ids, Integer userId) {
		dao.delCashFlowByIds(ids, userId);
	}

	/**
	 * 检查账户,设置账户的体验金值为前一天的该账户下的体验金值
	 * @param userId 用户id
	 * @param acc    账户的accountId
	 * @return 若该账户的昨天账户体验金不为0,则将其设置为今天账户下的体验金
	 */
	public UserAccountInfo checkAccount(int userId, UserAccountInfo acc) {
		UserAccountInfo temp = dao.getNodueAccByaccId(userId, acc.getAccountID(), 1);
		if (temp != null && temp.getFreezedAmount() != null && temp.getFreezedAmount() != 0) {
			acc.setFreezedAmount(temp.getFreezedAmount());
		}
		return acc;
	}
	
	/**
	 * 根据 期限 days 计算悠米定制的收益率
	 * @param days 悠米定制客户自定义的天数
	 * @return 返回 %前面的 数字 <br >
	 * eg:30天,收益率为 9%, 返回9
	 */
	public double getRate(int days) {
		double rate6 = JSONObject.fromObject(this.findText("rate_7", "").getContent()).getDouble("rate");
		double rate30 = JSONObject.fromObject(this.findText("rate_30", "").getContent()).getDouble("rate");
		double rate60 = JSONObject.fromObject(this.findText("rate_60", "").getContent()).getDouble("rate");
		double rate90 = JSONObject.fromObject(this.findText("rate_90", "").getContent()).getDouble("rate");
		double rate365 = JSONObject.fromObject(this.findText("rate_888", "").getContent()).getDouble("rate");
		;
		int day6 = 6;
		int day30 = 30;
		int day60 = 60;
		int day90 = 90;
		int day365 = 365;
		double rate = 0.0;

		if (days >= day6 && days < day30) {
			rate = rate6 + (rate30 - rate6) * (days - day6) / (day30 - day6);
		} else if (days >= day30 && days < day60) {
			rate = rate30 + (rate60 - rate30) * (days - day30) / (day60 - day30);
		} else if (days >= day60 && days < day90) {
			rate = rate60 + (rate90 - rate60) * (days - day60) / (day90 - day60);
		} else if (days >= day90 && days <= 365) {
			rate = rate90 + (rate365 - rate90) * (days - day90) / (day365 - day90);
		}
		return rate;
	}
	
}

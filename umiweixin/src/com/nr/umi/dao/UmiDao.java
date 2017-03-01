package com.nr.umi.dao;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.hibernate.Hibernate;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

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

@SuppressWarnings("unchecked")
public class UmiDao {

	@Resource(name = "sessionFactory")
	private SessionFactory sessionFactory;

	private static Logger logger = Logger.getLogger(UmiDao.class);

	public Object saveOrUpdate(Object obj) {
		try {
			Session se = sessionFactory.getCurrentSession();
			se.saveOrUpdate(obj);
			return obj;
		} catch (HibernateException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
		}
		return null;

	}

	public UMIUser getUMIUserByUserName(String userName) {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from UMIUser where userName='" + userName + "'";
		Query q = se.createQuery(hql);
		List result = q.list();
		if (result.size() != 0) {
			return (UMIUser) result.get(0);
		}
		return null;
	}

	public UserRelation queryRelationByUserId(int id) {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from UserRelation where userId=" + id;
		Query q = se.createQuery(hql);
		List result = q.list();
		if (result.size() != 0) {
			return (UserRelation) result.get(0);
		}
		return null;
	}

	public List<UserSummary> querySummaryRefererId(int id) {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from UserSummary where refererId=?";
		Query q = se.createQuery(hql).setParameter(0, id);
		return q.list();
	}

	public List<UserAccountInfo> findAllAcc(int userID, String date, String accountID) {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from UserAccountInfo where isValid=1 and user_id=" + userID;
		if (date != null) {
			hql += " and date>='" + date + "'";
		}
		if (accountID != null) {
			hql += " and accountID like '" + accountID + "%'";
		}
		hql += " order by date desc , remainDays , id desc";
		Query q = se.createQuery(hql);
		List<UserAccountInfo> result = q.list();
		if (result.size() > 0) {
			return result;
		}
		return null;
	}

	/**
	 * 根据剩余天数查询账户信息
	 */
	public List<UserAccountInfo> findAccByRemainDays(String accountID, int userID, int remainDays, String date) {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from UserAccountInfo where accountID like :accountID and user_id = :userID and remainDays = :remainDays and isValid=1 ";
		if (date != null) {
			hql += " and date >= :date";
		}
		hql += " order by id desc";
		Query q = null;
		try {
			q = se.createQuery(hql);
			q.setString("accountID", accountID + "%");
			q.setInteger("userID", userID);
			q.setInteger("remainDays", remainDays);
			if (date != null) {
				q.setString("date", date);
			}
			List<UserAccountInfo> list = q.list();
			if (list.size() != 0) {
				return list;
			} else {
				return null;
			}
		} catch (HibernateException e) {
			logger.error(e.getCause() == null ? e.getClass() + ": " + e.getMessage()
					: e.getCause().getClass() + ": " + e.getCause().getMessage());
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 根据账户ID返回 账户,返回指定日期的账户
	 * 
	 * @param accountID
	 *            账户id
	 * @param date
	 *            指定日期之内
	 * @return
	 */
	public UserAccountInfo getUserAccountInfo(Integer accountID, String date) {
		Session session = sessionFactory.getCurrentSession();
		StringBuffer sb = new StringBuffer();
		sb.append("from UserAccountInfo where");
		sb.append(" id=" + accountID);
		if (date != null) {
			sb.append(" and date>=" + date);
		}
		sb.append(" order by id desc");
		Query q = session.createQuery(sb.toString());
		List<UserAccountInfo> result = q.list();
		if (result.size() > 0) {
			return result.get(0);
		}
		return null;

	}

	/**
	 * @param userID
	 *            用户ID
	 * @return 根据userID返回该账户的所有银行账号信息
	 */
	public List<BankInfo> findAllBanks(int userID) {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from BankInfo where userId=" + userID + "and reservedPhone != ''";
		hql += " order by id";
		Query q = se.createQuery(hql);
		List<BankInfo> result = q.list();
		if (result.size() > 0) {
			return result;
		}
		return null;
	}

	/**
	 * @param userID
	 *            用户ID
	 * @return 根据userID返回该账户的默认银行卡 DBC:是 default bank card的缩写
	 */
	public List<BankInfo> findDBC(int userID) {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from BankInfo where userId=" + userID + " and isVerified = 1 ";
		hql += " order by id";
		Query q = se.createQuery(hql);
		List<BankInfo> result = q.list();
		if (result.size() > 0) {
			return result;
		}
		return null;
	}

	public Text findText(String text, String version) {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from Text where name = '" + text + "'";
		if (version != null && !version.equalsIgnoreCase("")) {
			hql += "and version = '" + version + "'";
		}
		hql += " order by id desc";
		Query q = null;
		try {
			q = se.createQuery(hql);
		} catch (HibernateException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
		}
		List<Text> texts = q.list();
		if (texts.size() > 0) {
			return texts.get(0);
		} else {
			return null;
		}
	}

	public UserSession findSession() {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from UserSession where 1=1";
		Query q = null;
		try {
			q = se.createQuery(hql);
		} catch (HibernateException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
		}
		List<UserSession> UserSession = q.list();
		if (UserSession.size() > 0) {
			return UserSession.get(0);
		} else {
			return null;
		}
	}

	public WechatToken findWechatTokenByUserID(int userID) {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from WechatToken where userID=" + userID;
		Query q = null;
		try {
			q = se.createQuery(hql);
		} catch (HibernateException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
		}
		List<WechatToken> wechatToken = q.list();
		if (wechatToken.size() > 0) {
			return wechatToken.get(0);
		} else {
			return null;
		}
	}

	public WechatToken findWechatTokenByOpenID(String openID) {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from WechatToken where openid='" + openID + "' order by id desc";
		Query q = null;
		try {
			q = se.createQuery(hql);
		} catch (HibernateException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
		}
		List<WechatToken> wechatToken = q.list();
		if (wechatToken.size() > 0) {
			return wechatToken.get(0);
		} else {
			return null;
		}
	}

	public double queryFreezedAmount(int userID) {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from UserAccountInfo where freezedAmount > 0 and user_id=" + userID;
		Query q = null;
		try {
			q = se.createQuery(hql);
		} catch (HibernateException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
		}
		List<UserAccountInfo> wechatToken = q.list();
		if (wechatToken.size() > 0) {
			return wechatToken.get(0).getFreezedAmount();
		} else {
			return 0;
		}
	}

	public int updateList(List<Object> list) {
		Session se = sessionFactory.getCurrentSession();
		try {
			for (Object ob : list) {
				se.saveOrUpdate(ob);
			}
			return 0;
		} catch (Exception e) {
			logger.error(e.getMessage());
			e.printStackTrace();
			return 1;
		}
	}

	public UMIUser getUserByToken(String token) {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from UMIUser where token='" + token + "' order by id desc";
		Query q = se.createQuery(hql);
		List result = q.list();
		if (result.size() != 0) {
			return (UMIUser) result.get(0);
		}
		return null;

	}

	public UMIUser findUserById(String id) {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from UMIUser where id='" + id + "'";
		Query q = se.createQuery(hql);
		List result = q.list();
		if (result.size() != 0) {
			return (UMIUser) result.get(0);
		}
		return null;
	}

	public String queryApiRequest(Integer userId, String apiName) {
		Session se = sessionFactory.getCurrentSession();
		String sql = "select c_response from t_sys_api_request where c_id=(select MAX(c_id) from t_sys_api_request where c_user_id=:userId and c_api_name=:apiName)";
		SQLQuery q = null;
		try {
			q = se.createSQLQuery(sql);
			q.setInteger("userId", userId);
			q.setString("apiName", apiName);
			q.addScalar("c_response", Hibernate.STRING);
		} catch (HibernateException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
		}
		if (q.list().size() > 0) {
			return (String) q.list().get(0);
		} else {
			return null;
		}
	}

	/**
	 * 查询用户绑定的银行卡
	 * 
	 * @param userID
	 *            用户id
	 * @return
	 */
	public UserBank queryVerifiedBankByUserId(int userID) {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from UserBank where user_id=:userID and isVerified=1";
		try {
			Query q = se.createQuery(hql);
			q.setInteger("userID", userID);
			int size = q.list().size();
			if (size != 0) {
				return (UserBank) q.list().get(0);
			}
		} catch (HibernateException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
		}
		return null;
	}

	public FRUserInfo findFRUserInfo(int userID) {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from FRUserInfo where uUmiId = :userID";
		Query q = null;
		try {
			q = se.createQuery(hql);
			q.setInteger("userID", userID);
			if (q.list().size() != 0) {
				return (FRUserInfo) q.list().get(0);
			} else {
				return null;
			}

		} catch (HibernateException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
			return null;
		}
	}

	public Experience findExperience(int userID, String accountID) {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from Experience where eUNo = :userID and eType=:accountID";
		Query q = null;
		try {
			q = se.createQuery(hql);
			q.setInteger("userID", userID);
			q.setString("accountID", accountID);
			if (q.list().size() != 0) {
				return (Experience) q.list().get(0);
			} else {
				return null;
			}
		} catch (HibernateException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
			return null;
		}
	}

	public Experience findExperience(int userID, int days) {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from Experience where eUNo = :userID and eDays=:days";
		Query q = null;
		try {
			q = se.createQuery(hql);
			q.setInteger("userID", userID);
			q.setInteger("days", days);
			List<Experience> results = q.list();
			if (results != null && results.size() != 0) {
				return results.get(0);
			} else {
				return null;
			}
		} catch (HibernateException e) {
			logger.error(e.getCause() == null ? e.getClass() + ": " + e.getMessage()
					: e.getCause().getClass() + ": " + e.getCause().getMessage());
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 模糊查询
	 * 
	 * @param user
	 * @param accountID
	 * @return 返回user下可以体现到的账户
	 */
	public UserAccountInfo queryWithdrawAmount(UMIUser user, String accountID, String date) {
		Session session = sessionFactory.getCurrentSession();
		StringBuffer hql = new StringBuffer(
				"from UserAccountInfo where user_id=:user_id and accountID like:accountID and isValid=1");
		if (date != null && !date.equalsIgnoreCase("")) {
			hql.append(" and date>=" + date);
		}
		hql.append(" order by id desc");
		List<UserAccountInfo> result = null;
		try {
			Query q = session.createQuery(hql.toString());
			q.setInteger("user_id", user.getId());
			q.setString("accountID", accountID + "%");
			result = q.list();
			if (result == null || result.size() == 0) {
				return null;
			} else {
				return result.get(0);
			}
		} catch (HibernateException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 精确查询
	 * 
	 * @param userId
	 *            用户id
	 * @param accountId
	 *            用户的账户id
	 * @return 获取用户最近一天指定的账户
	 * 
	 */
	public UserAccountInfo queryAccountByUseridAccountID(Integer userId, String accountId, String date) {
		Session se = sessionFactory.getCurrentSession();
		StringBuffer hql = new StringBuffer("from UserAccountInfo where");
		hql.append(" user_id=:userId");
		hql.append(" and isValid=1");
		hql.append(" and accountID=:accountID");
		if (date != null) {
			hql.append(" and date>=" + date);
		}
		hql.append(" order by id desc");
		try {
			Query q = se.createQuery(hql.toString());
			q.setInteger("userId", userId);
			q.setString("accountID", accountId);
			List<UserAccountInfo> result = q.list();
			if (result != null && result.size() != 0) {
				return result.get(0);
			}
		} catch (HibernateException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
		}
		return null;
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
		Session se = sessionFactory.getCurrentSession();
		String hql = "from UserBank where user_id = :userID and card_no = :cardNo and reversedPhone != ''";

		Query q = null;
		try {
			q = se.createQuery(hql);
			q.setString("cardNo", cardNo);
			q.setInteger("userID", userID);
			if (q.list().size() != 0) {
				return (UserBank) q.list().get(0);
			} else {
				return null;
			}

		} catch (HibernateException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
			return null;
		}
	}

	public UserAction findAction(int userID, String out_trade_no, String actionType) {
		Session se = sessionFactory.getCurrentSession();
		StringBuffer hql = new StringBuffer("from UserAction where user_id=:userId");

		if (out_trade_no != null && !out_trade_no.equals("")) {
			hql.append(" and tradeNo=:out_trade_no");
		} else if (actionType != null && !actionType.equals("")) {
			hql.append(" and action_type like:actionType");
		}
		hql.append(" order by id desc");
		Query q = null;
		try {
			q = se.createQuery(hql.toString());
			q.setInteger("userId", userID);
			if (out_trade_no != null && !out_trade_no.equals("")) {
				q.setString("out_trade_no", out_trade_no);
			} else if (actionType != null && !actionType.equals("")) {
				q.setString("actionType", actionType + "%");
			}
			List result = q.list();
			if (result != null && result.size() != 0) {
				return (UserAction) result.get(0);
			}
		} catch (HibernateException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
		}
		return null;
	}

	public UserBank findBankByCardId(int cardID) {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from UserBank where card_id=:cardID order by id desc";
		Query q = null;
		try {
			q = se.createQuery(hql);
			q.setInteger("cardID", cardID);
		} catch (HibernateException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
		}
		List<UserBank> list = q.list();
		if (list.size() > 0) {
			return list.get(0);
		} else {
			return null;
		}
	}

	public UserBank bindingCard(UserBank userBank, UMIUser user, UserAccountInfo userAccount) {
		Session se = sessionFactory.getCurrentSession();

		try {
			se.beginTransaction();
			se.saveOrUpdate(userBank);
			se.saveOrUpdate(user);
			se.saveOrUpdate(userAccount);
			se.getTransaction().commit();
		} catch (Exception e) {
			e.printStackTrace();
			se.getTransaction().rollback();
			logger.error(e.getMessage());
		}
		return userBank;
	}

	public List<CashFlow> queryCashFlow(Map<String, Object> params) {
		int index = (int) params.get("index"); // 查询 起始记录的位置索引
		int pageCount = (int) params.get("pageCount");
		Session se = sessionFactory.getCurrentSession();
		String hql = "from CashFlow c where userId=:userId and (amount<0 or amount>0 and categoryID=6 and categoryName not like '体验金结转') order by id desc";

		/*
		 * 是之前仅仅是投资提现的情况 String accountID = null; if
		 * (!params.containsKey("accountID")) { accountID = "200"; } else {
		 * accountID = (String) params.get("accountID"); }
		 * q.setString("accountID", accountID + "%");
		 */

		List<CashFlow> list = null;
		try {
			Query q = se.createQuery(hql);
			q.setInteger("userId", (int) params.get("userId"));
			q.setFirstResult(index).setMaxResults(pageCount);
			list = q.list();
		} catch (HibernateException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
		}
		return list;
	}

	public CashFlow queryCashFlows(int userid, String recordID) {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from CashFlow where accountID = :recordID and userId=:userid order by id desc";
		Query q = null;
		try {
			q = se.createQuery(hql);
			q.setInteger("userid", userid);
			q.setString("recordID", recordID);
			if (q.list().size() != 0) {
				return (CashFlow) q.list().get(0);
			} else {
				return null;
			}
		} catch (HibernateException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 根据id获取cashflow
	 * 
	 * @param cashflowId:
	 *            流水的id
	 * @return
	 */
	public CashFlow queryCashflowById(int cashflowId) {
		Session session = sessionFactory.getCurrentSession();
		return (CashFlow) session.get(CashFlow.class, cashflowId);
	}

	/**
	 * 返回最近该用户的action的ID
	 * 
	 * @param userID
	 * @return
	 */
	public Integer getActionID(int userID) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from UserAction where user_id=:userId order by id desc";
		try {
			Query q = session.createQuery(hql);
			q.setInteger("userId", userID);

			if (q.list().size() != 0) {
				UserAction ua = (UserAction) q.list().get(0);
				return ua.getId();
			} else {
				return null;
			}
		} catch (HibernateException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 获取用户账户的最近时间
	 * 
	 * @param userID
	 * @return
	 */
	public String getMaxDateOfAccount(Integer userID) {
		Session session = sessionFactory.getCurrentSession();
		String sql = "select MAX(c_date) from t_user_account_info where c_user_id=" + userID;
		Query query = session.createSQLQuery(sql);
		Date max_date = (Date) query.uniqueResult();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		return sdf.format(max_date);

	}

	/**
	 * 用于提现操作 把该用户的账户accountId在c_date之前的c_is_valid设置为0
	 * 
	 * @param userId
	 * @param accountId
	 *            提现的理财账户
	 * @param date
	 *            该账户的c_date时间
	 */
	public void updateAccountOfWithdraw(Integer userId, String accountId, String date) {
		Session session = sessionFactory.getCurrentSession();
		StringBuffer sbSql = new StringBuffer("update t_user_account_info set c_is_valid=0 where");
		sbSql.append(" c_user_id = " + userId);
		sbSql.append(" and c_accountID = " + accountId);
		sbSql.append(" and c_date < " + date);
		try {
			Query query = session.createSQLQuery(sbSql.toString());
			int num = query.executeUpdate();
			logger.info("账户" + userId + "提现了" + accountId + "账户,将其c_is_valid设置为0,影响了" + num + "行");
		} catch (Exception e) {
			logger.error(e.getCause() == null ? e.getClass() + ": " + e.getMessage()
					: e.getCause().getClass() + ": " + e.getCause().getMessage());
			e.printStackTrace();
		}
	}

	/**
	 * 获取指定一天的收益率
	 * 
	 * @param date
	 * @return
	 */
	public Yield getYields(String date) {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from Yield where date>=:date order by id desc";
		Query q = null;
		try {
			q = se.createQuery(hql);
			q.setString("date", date);
		} catch (HibernateException e) {
			logger.error(e.getCause() == null ? e.getClass() + ": " + e.getMessage()
					: e.getCause().getClass() + ": " + e.getCause().getMessage());
			e.printStackTrace();
		}
		if (q.list().size() > 0) {
			return (Yield) q.list().get(0);
		} else {
			return null;
		}
	}

	/**
	 * 获取所有银行卡的限额信息
	 */
	public List<BankLimit> queryAllBanklimit() {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from BankLimit";
		List<BankLimit> results = null;
		try {
			Query query = null;
			query = se.createQuery(hql);
			results = query.list();
		} catch (HibernateException e) {
			logger.error(e.getCause() == null ? e.getClass() + ": " + e.getMessage()
					: e.getCause().getClass() + ": " + e.getCause().getMessage());
			e.printStackTrace();
		}
		if (results == null || results.size() == 0) {
			return null;
		}
		return results;
	}

	/**
	 * 根据银行卡code获取银行限额
	 * 
	 * @param code
	 */
	public BankLimit queryBanklimitByCode(String code) {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from BankLimit where bankCode =:bankCode";
		List<BankLimit> results = null;
		try {
			Query query = se.createQuery(hql);
			query.setString("bankCode", code);
			results = query.list();
		} catch (HibernateException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
		}
		if (results == null || results.size() == 0) {
			return null;
		}
		return results.get(0);
	}

	public CenterProcess findProcessByUserID(int userID) {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from CenterProcess where userID=:userID order by id desc";
		Query q = null;
		try {
			q = se.createQuery(hql);
			q.setInteger("userID", userID);
		} catch (HibernateException e) {
			logger.error(e.getCause() == null ? e.getClass() + ": " + e.getMessage()
					: e.getCause().getClass() + ": " + e.getCause().getMessage());
			e.printStackTrace();
		}
		List<CenterProcess> list = q.list();
		if (list.size() > 0) {
			return list.get(0);
		} else {
			return null;
		}
	}

	public CenterProcess findProcessByOrderNo(String orderNo) {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from CenterProcess where orderNo=:orderNo order by id desc";
		Query q = null;
		try {
			q = se.createQuery(hql);
			q.setString("orderNo", orderNo);
		} catch (HibernateException e) {
			logger.error(e.getCause() == null ? e.getClass() + ": " + e.getMessage()
					: e.getCause().getClass() + ": " + e.getCause().getMessage());
			e.printStackTrace();
		}
		List<CenterProcess> list = q.list();
		if (list.size() > 0) {
			return list.get(0);
		} else {
			return null;
		}
	}

	public OrderDetail getOrderDetail(int id) {
		Session session = sessionFactory.getCurrentSession();
		OrderDetail orderDetail = (OrderDetail) session.get(OrderDetail.class, id);
		return orderDetail;
	}

	/**
	 * 删除用户的流水
	 * 
	 * @param ids
	 *            流水id数组
	 * @param userId
	 *            用户id
	 */
	public void delCashFlowByIds(Integer[] ids, Integer userId) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "delete from CashFlow where id IN (:params) and userId=:userId";
		Query query = session.createQuery(hql);
		query.setParameterList("params", ids);
		query.setInteger("userId", userId);
		query.executeUpdate();
	}

	/**
	 * 获取账户accountID的前一天数据
	 * 
	 * @param userId
	 *            用户Id
	 * @param accountID
	 *            账户类型
	 * @param remainDays
	 *            剩余时间
	 * @return UserAccountInfo
	 */
	public UserAccountInfo getNodueAccByaccId(int userId, String accountID, int remainDays) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from UserAccountInfo where user_id=:userId and accountID=:accountID and remainDays=:remainDays";
		try {
			Query q = session.createQuery(hql);
			q.setInteger("userId", userId);
			q.setString("accountID", accountID);
			q.setInteger("remainDays", remainDays);
			List<UserAccountInfo> result = (List<UserAccountInfo>) q.list();
			if (result != null && result.size() != 0) {
				return result.get(0);
			}
		} catch (HibernateException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
		}
		return null;
	}
}

package com.nr.umi.dao;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import com.nr.umi.bean.UserAccountInfo;

/**
 * 用户的账户的相关操作
 * 部分操作之前在UmiDao中已写,没有移到这里
 * 操作表: t_user_account_info
 * @author yi.yuan
 * 
 */
public class UserAccountInfoDao {
	@Resource(name = "sessionFactory")
	private SessionFactory sessionFactory;

	private static Logger logger = Logger.getLogger(UserAccountInfoDao.class);
	
	private Session getSession(){
		return sessionFactory.getCurrentSession();
	}
	
	public UserAccountInfo getObj(Integer id){
		return (UserAccountInfo) this.getSession().get(UserAccountInfo.class, id);
	}
	
	public void save(UserAccountInfo obj){
		this.getSession().save(obj);
	}
	
	/**
	 * 
	 * @param userId 用户id
	 * @param accountId 用户的账户id,包含相关代码+年月日
	 * @return true: 获取当天新建的账户
	 * 
	 */
	public UserAccountInfo queryAccountByUseridAccountID(Integer userId, String accountId) {
		Session session = this.getSession();
		String hql = "from UserAccountInfo where user_id=:userId and isValid=1 and accountID=:accountID order by id desc";
		try {
			Query q = session.createQuery(hql);
			q.setInteger("userId", userId);
			q.setString("accountID", accountId);
			int size = q.list().size();
			if (size != 0) {
				return (UserAccountInfo) q.list().get(0);
			} else {
				return null;
			}
		} catch (HibernateException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
		}
		return null;
	}
}

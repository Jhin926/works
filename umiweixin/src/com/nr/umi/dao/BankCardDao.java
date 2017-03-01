package com.nr.umi.dao;

import java.util.List;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import com.nr.umi.bean.BankInfo;

public class BankCardDao {
	@Resource(name = "sessionFactory")
	private SessionFactory sessionFactory;

	private static Logger logger = Logger.getLogger(UserAccountInfoDao.class);

	private Session getSession() {
		return sessionFactory.getCurrentSession();
	}

	public List<BankInfo> getAllBankCards() {
		String hql = "from BankInfo ";
		hql += " order by id";
		Query q = this.getSession().createQuery(hql);
		List<BankInfo> result = q.list();
		if (result == null || result.size() == 0) {
			return null;
		}
		return result;
	}
	
	public BankInfo getBankCard( BankInfo bank) {

		Session session = sessionFactory.getCurrentSession();
		String hql = "from BankInfo where cardNo=:cardNo and bankCode=:bankCode order by id";
		List<BankInfo> result = null;
		try {
			Query query = session.createQuery(hql);
			query.setString("cardNo", bank.getCardNo());
			query.setString("bankCode", bank.getBankCode());
			result = query.list();
		} catch (HibernateException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
		}
		if (result != null && result.size() > 0) {
			return result.get(0);
		}
		return null;
	}
}

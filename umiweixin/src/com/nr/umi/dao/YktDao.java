package com.nr.umi.dao;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import com.nr.umi.bean.CardInfo;

public class YktDao {
	
	@Resource(name = "sessionFactory")
	private SessionFactory sessionFactory;

	private static Logger logger = Logger.getLogger(YktDao.class);

	public CardInfo checkCardInfoByIdCard(String name, String idCard) {
		
		Session session = sessionFactory.getCurrentSession();
		String hql = "from CardInfo where real_name='" + name + "' and id_card='" + idCard +"'";
		CardInfo cardInfo;
		try {
			cardInfo = (CardInfo)session.createQuery(hql).uniqueResult();
			return cardInfo;
		} catch (Exception e) {
			logger.error(e.getMessage());
			e.printStackTrace();
			return null;
		}
	}

	public CardInfo checkCardInfoByCardNo(String phone, String cardNo) {
		Session session = sessionFactory.getCurrentSession();
		String hql = "from CardInfo where card_no='" + cardNo + "' and user_mobile='" + phone + "'";
		CardInfo cardInfo;
		try {
			cardInfo = (CardInfo)session.createQuery(hql).uniqueResult();
			return cardInfo;
		} catch (Exception e) {
			logger.error(e.getMessage());
			e.printStackTrace();
			return null;
		}
	}
}
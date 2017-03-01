package com.nr.umi.dao;

import java.util.List;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.hibernate.SessionFactory;

import com.nr.umi.bean.User;

public class WeChatDao {
	@Resource(name = "sessionFactory")
	private SessionFactory sessionFactory;
	private static Logger logger = Logger.getLogger(WeChatDao.class);

	public Object saveOrUpdate(Object obj) {
		try {
			Session se = sessionFactory.getCurrentSession();
			se.saveOrUpdate(obj);
			System.out.println(obj);
			return obj;
		} catch (HibernateException e) {
			logger.error(e.getMessage());
			e.printStackTrace();
		}
		return null;

	}
	
	/**
	 * 根据openId查找该微信用户是否已经与umi用户绑定
	 * @param openId
	 * @return
	 */
	public User queryUserByOpenId(String openId) {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from User where wenXinNo='" + openId + "' order by no desc";
		Query q = se.createQuery(hql);
		List<User> result = q.list();
		if (result.size() == 0) {
			return null;
		}
		return result.get(0);
	}

	/**
	 * 获取所有的User用户
	 * @param uimId umi用户的Id
	 */
	public List<User> queryUserByuimId(Integer uimId) {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from User where umiId=" + uimId + " order by no desc";
		Query q = se.createQuery(hql);
		List<User> result = q.list();
		if (result.size() == 0) {
			return null;
		}
		return result;
	}
	
	/**
	 * 获取最近  指定的User用户
	 * @param uimId umi用户的Id
	 */
	public User getUserByuimId(Integer uimId) {
		Session se = sessionFactory.getCurrentSession();
		String hql = "from User where umiId=" + uimId + " order by no desc";
		Query q = se.createQuery(hql);
		List<User> result = null;
		try {
			result = q.list();
			if (result.size() > 0) {
				return result.get(0);
			}
		} catch (Exception e) {
			logger.error(e.getMessage());
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * step 1
	 * 解除User中,绑定关系,即将openId设置为null或为空
	 * @param userID :umi账户的ID
	 * @return
	 */
	public void unbindContact(Integer userID, String openId) {
		Session session = sessionFactory.getCurrentSession();
		StringBuffer sb = new StringBuffer();
		sb.append("update t_UserInfo set c_U_WenXinNo=NULL where");
		sb.append(" c_U_UmiUId=" + userID);
		if(openId!=null){
			sb.append(" or c_U_WenXinNo='" + openId + "'");
		}
		Query query = session.createSQLQuery(sb.toString());
		int num = query.executeUpdate();
		System.out.println("unbindContact()...  影响了" + num + "行...");
	}
}

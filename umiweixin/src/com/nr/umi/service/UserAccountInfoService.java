package com.nr.umi.service;

import javax.annotation.Resource;

import com.nr.umi.bean.UserAccountInfo;
import com.nr.umi.dao.UserAccountInfoDao;

public class UserAccountInfoService {
	@Resource
	private UserAccountInfoDao userAccountInfoDao;
	
	/**
	 * 
	 * @param userId 用户id
	 * @param accountId 用户的账户id
	 * @return 返回在表t_user_account_info中存在该用户的对应账户
	 * 		   
	 */
	public UserAccountInfo queryAccountByUseridAccountID(Integer userId, String accountId) {
		return userAccountInfoDao.queryAccountByUseridAccountID(userId, accountId);
	}
}

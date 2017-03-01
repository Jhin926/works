package com.nr.umi.util;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.nr.umi.bean.ExCashFlow;
import com.nr.umi.bean.Experience;
import com.nr.umi.bean.FRUserInfo;
import com.nr.umi.service.UmiService;

/**
 * 被推荐人活动产生体验金工具类
 * @author Administrator
 *
 */
public class ExAmountUtil {

	private static double exDirect = 200;// 绑定银行卡直接推荐人体验金
	private static double exIndirect = 20;// 绑定银行卡间接推荐人体验金

	public static void exTransfer(UmiService service, int days, int userID, double amount) {
		List<Object> list = new ArrayList<Object>();
		// 查询推荐关系表
		FRUserInfo frUser = service.findFRUserInfo(userID);
		int bankFlag = frUser.getBankFlag();
		// 如果推荐用户不为空
		if (frUser != null) {
			Integer directUserID = frUser.getuDirectPeople();// 直接推荐人
			Integer indirectUserID = frUser.getuIndirectPeople();// 间接推荐人
			// 如果有直接推荐人
			if (directUserID != null && directUserID != 0) {
				// 流水生成
				ExCashFlow cashFlowDirect = new ExCashFlow();
				cashFlowDirect.setUserID(directUserID);
				cashFlowDirect.setAccountID("888");
				cashFlowDirect.setDate(new Timestamp(new Date().getTime()));
				cashFlowDirect.setProvideId(userID);
				// 体验金账户
				Experience eDirect = service.findExperience(directUserID, days);
				if (eDirect == null) {
					eDirect = new Experience();
					eDirect.seteExperienceing(0);
					eDirect.seteUNo(directUserID);
					eDirect.seteFriendNum(eDirect.geteFriendNum() + 1);
					eDirect.seteType(888);
				}
				// 直接推荐人关系表
				FRUserInfo userDirect = service.findFRUserInfo(directUserID);
				if (userDirect == null) {
					return;
				}
				cashFlowDirect.setExBalance(eDirect.geteExperienceing());
				// 如果amount为0则是实名认证产生的体验金
				if (amount != 0) {
					cashFlowDirect.setAmount(amount * 0.2);
					cashFlowDirect.setType(0);
					userDirect.setuExprience(userDirect.getuExprience() + amount * 0.2);
					eDirect.seteExperienceing(eDirect.geteExperienceing() + amount * 0.2);
				} else {
					if (frUser.getBankFlag() == 0) {
						userDirect.setuFriendsNum(userDirect.getuFriendsNum() + 1);
						cashFlowDirect.setAmount(exDirect);
						cashFlowDirect.setType(1);
						userDirect.setuExprience(userDirect.getuExprience() + exDirect);
						eDirect.seteExperienceing(eDirect.geteExperienceing() + exDirect);
						bankFlag = 1;
					}
				}
				list.add(eDirect);
				list.add(userDirect);
				list.add(cashFlowDirect);
			}
			// 如果有间接推荐人
			if (indirectUserID != null && indirectUserID != 0) {
				// 流水生成
				ExCashFlow cashFlow = new ExCashFlow();
				cashFlow.setUserID(indirectUserID);
				cashFlow.setAccountID("888");
				cashFlow.setDate(new Timestamp(new Date().getTime()));
				cashFlow.setProvideId(userID);
				Experience eIndirect = service.findExperience(indirectUserID, days);
				if (eIndirect == null) {
					eIndirect = new Experience();
					eIndirect.seteExperienceing(0);
					eIndirect.seteUNo(indirectUserID);
					eIndirect.seteFriendNum(eIndirect.geteFriendNum() + 1);
					eIndirect.seteType(888);
				}
				FRUserInfo userIndirect = service.findFRUserInfo(indirectUserID);
				// 如果amount为0则是实名认证产生的体验金
				if (amount != 0) {
					cashFlow.setAmount(amount * 0.02);
					cashFlow.setType(0);
					userIndirect.setuExprience(userIndirect.getuExprience() + amount * 0.02);
					eIndirect.seteExperienceing(eIndirect.geteExperienceing() + amount * 0.02);
				} else {
					if (frUser.getBankFlag() == 0) {
						userIndirect.setuFriendsNum(userIndirect.getuFriendsNum() + 1);
						cashFlow.setAmount(exIndirect);
						cashFlow.setType(1);
						userIndirect.setuExprience(userIndirect.getuExprience() + exIndirect);
						eIndirect.seteExperienceing(eIndirect.geteExperienceing() + exIndirect);
						bankFlag = 1;
					}
				}
				list.add(eIndirect);
				list.add(userIndirect);
				list.add(cashFlow);
			}
			frUser.setBankFlag(bankFlag);
			list.add(frUser);
			service.updateList(list);
		}
	}
}
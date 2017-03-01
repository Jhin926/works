package com.nr.umi.service;

import javax.annotation.Resource;

import com.nr.umi.bean.CardInfo;
import com.nr.umi.dao.YktDao;

public class YktService {
	@Resource(name = "yktDao")
	private YktDao yktDao;

	public CardInfo checkCardInfoByIdCard(String name ,String idCard) {
		CardInfo cardInfo = yktDao.checkCardInfoByIdCard(name, idCard);
		return cardInfo;
	}

	public CardInfo checkCardInfoByCardNo(String phone, String cardNo) {
		CardInfo cardInfo = yktDao.checkCardInfoByCardNo(phone,cardNo);
		return cardInfo;
	}

}

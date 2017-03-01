package com.nr.umi.service;

import java.util.List;

import javax.annotation.Resource;

import com.nr.umi.bean.BankInfo;
import com.nr.umi.dao.BankCardDao;
import com.nr.umi.util.BankInfoUtil;
public class BankCardService {
	@Resource
	private BankCardDao bankCardDao;
	
	public List<BankInfo> getAllBankCards() {
		List<BankInfo> banks= bankCardDao.getAllBankCards();
		BankInfoUtil.setBankCardInfo(banks);
		return banks;
	}
	
	/**
	 * 
	 * @param bank :包含银行卡的卡号及其银行
	 * @return 返回该银行卡的信息
	 */
	public BankInfo getBankCard( BankInfo bank) {
		return bankCardDao.getBankCard(bank);
	}
}

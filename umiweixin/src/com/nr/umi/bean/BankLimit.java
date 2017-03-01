package com.nr.umi.bean;

/**
 * 银行卡限额表 t_sys_bank_limit
 * 
 * @author yi.yuan Established in 2015年11月11日
 */
public class BankLimit {

	private Integer id;
	// 银行code
	private String bankCode;
	// 银行名,该属性不持久化到数据库
	private String bankName;
	// 首次绑卡支付限额
	private String firstLimit;
	// 单笔支付限额
	private String dayLimit;
	// 一天最多支付限额
	private String dayMaxLimit;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getBankCode() {
		return bankCode;
	}

	public void setBankCode(String bankCode) {
		this.bankCode = bankCode;
	}

	public String getFirstLimit() {
		return firstLimit;
	}

	public void setFirstLimit(String firstLimit) {
		this.firstLimit = firstLimit;
	}

	public String getDayLimit() {
		return dayLimit;
	}

	public void setDayLimit(String dayLimit) {
		this.dayLimit = dayLimit;
	}

	public String getDayMaxLimit() {
		return dayMaxLimit;
	}

	public void setDayMaxLimit(String dayMaxLimit) {
		this.dayMaxLimit = dayMaxLimit;
	}

	public String getBankName() {
		return bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	@Override
	public String toString() {
		return "BankLimit [id=" + id + ", bankCode=" + bankCode + ", bankName=" + bankName + ", firstLimit="
				+ firstLimit + ", dayLimit=" + dayLimit + ", dayMaxLimit=" + dayMaxLimit + "]";
	}

}

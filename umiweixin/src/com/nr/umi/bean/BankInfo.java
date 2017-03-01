package com.nr.umi.bean;

import java.sql.Timestamp;

/**
 * 记录用户的银行卡信息
 * 
 * @author yi.yuan
 *
 *         Established in 2015年10月28日
 */
public class BankInfo {

	private Integer id;

	private Integer userId;
	// 银行名称(包括尾号)
	private String bankName;
	// 省
	private String province;
	// 市
	private String city;
	private String branch;
	// 卡号
	private String cardNo;
	// 开户人
	private String accountName;
	// 新浪认证id
	private String cardId;
	private Timestamp timestamp;
	// 1表示已经证实的,使用为 1 的
	private int isVerified;
	// 银行代码
	private String bankCode;
	// 预留号码
	private String reservedPhone;

	/*
	 * 以下字段仅作为前端显示使用,不持久化到数据库
	 */
	// 只是银行名称,不包括尾号
	private String bank;
	// 用来记录尾号. 例如：尾号7515,没有括号
	private String tailNum;
	// 银行图标
	private String bankPic;
	// 该银行卡的相关限额信息
	private BankLimit bankLimit = new BankLimit();

	public BankInfo() {
	}

	public BankInfo(String cardNo, String bankCode) {
		this.cardNo = cardNo;
		this.bankCode = bankCode;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public String getBankName() {
		return bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	public String getTailNum() {
		return tailNum;
	}

	public void setTailNum(String tailNum) {
		this.tailNum = tailNum;
	}

	public String getProvince() {
		return province;
	}

	public void setProvince(String province) {
		this.province = province;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getBranch() {
		return branch;
	}

	public void setBranch(String branch) {
		this.branch = branch;
	}

	public String getCardNo() {
		return cardNo;
	}

	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}

	public String getAccountName() {
		return accountName;
	}

	public void setAccountName(String accountName) {
		this.accountName = accountName;
	}

	public String getCardId() {
		return cardId;
	}

	public void setCardId(String cardId) {
		this.cardId = cardId;
	}

	public Timestamp getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Timestamp timestamp) {
		this.timestamp = timestamp;
	}

	public int getIsVerified() {
		return isVerified;
	}

	public void setIsVerified(int isVerified) {
		this.isVerified = isVerified;
	}

	public String getBankCode() {
		return bankCode;
	}

	public void setBankCode(String bankCode) {
		this.bankCode = bankCode;
	}

	public String getReservedPhone() {
		return reservedPhone;
	}

	public void setReservedPhone(String reservedPhone) {
		this.reservedPhone = reservedPhone;
	}

	public String getBankPic() {
		return bankPic;
	}

	public void setBankPic(String bankPic) {
		this.bankPic = bankPic;
	}

	public String getBank() {
		return bank;
	}

	public void setBank(String bank) {
		this.bank = bank;
	}

	public BankLimit getBankLimit() {
		return bankLimit;
	}

	public void setBankLimit(BankLimit bankLimit) {
		this.bankLimit = bankLimit;
	}

	@Override
	public String toString() {
		return "BankInfo [id=" + id + ", userId=" + userId + ", bankName=" + bankName + ", cardNo=" + cardNo
				+ ", accountName=" + accountName + ", cardId=" + cardId + ", isVerified=" + isVerified + ", bankCode="
				+ bankCode + ", reservedPhone=" + reservedPhone + "]";
	}

}

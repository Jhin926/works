package com.nr.umi.bean;

/**
 * 用户银行卡号
 */
public class UserBank {

	private int id;
	// 用户id
	private int user_id;
	// 银行名称
	private String bank_name;
	// 开户省份
	private String province;
	// 开户市区
	private String city;
	// 开户支行
	private String branch;
	// 卡号
	private String card_no;
	// 开户者姓名
	private String account_name;
	// 安全卡标示
	private String card_id;
	// 是否已绑定安全卡 ：1是0否
	private Integer isVerified;
	// 银行编码
	private String bankCode;
	// 预留手机号
	private String reversedPhone;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getUser_id() {
		return user_id;
	}

	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}

	public String getBank_name() {
		return bank_name;
	}

	public void setBank_name(String bank_name) {
		this.bank_name = bank_name;
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

	public String getCard_no() {
		return card_no;
	}

	public void setCard_no(String card_no) {
		this.card_no = card_no;
	}

	public String getAccount_name() {
		return account_name;
	}

	public void setAccount_name(String account_name) {
		this.account_name = account_name;
	}

	public String getCard_id() {
		return card_id;
	}

	public void setCard_id(String card_id) {
		this.card_id = card_id;
	}

	public Integer getIsVerified() {
		return isVerified;
	}

	public void setIsVerified(Integer isVerified) {
		this.isVerified = isVerified;
	}

	public String getBankCode() {
		return bankCode;
	}

	public void setBankCode(String bankCode) {
		this.bankCode = bankCode;
	}

	public String getReversedPhone() {
		return reversedPhone;
	}

	public void setReversedPhone(String reversedPhone) {
		this.reversedPhone = reversedPhone;
	}

	@Override
	public String toString() {
		return "UserBank [id=" + id + ", user_id=" + user_id + ", bank_name=" + bank_name + ", card_no=" + card_no
				+ ", account_name=" + account_name + ", card_id=" + card_id + ", isVerified=" + isVerified
				+ ", bankCode=" + bankCode + ", reversedPhone=" + reversedPhone + "]";
	}

}

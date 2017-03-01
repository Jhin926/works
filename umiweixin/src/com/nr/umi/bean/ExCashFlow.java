package com.nr.umi.bean;

import java.sql.Timestamp;

public class ExCashFlow {

	private int id;
	// 用户id
	private int userID;
	// 账户id
	private String accountID;
	// 体验金类型,1:实名认证;0:转账;2:注册
	private int type;
	// 体验金金额
	private double amount;
	// 提取之前的余额
	private double exBalance;
	// 时间戳
	private Timestamp date;
	// 来源人id
	private int provideId;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getUserID() {
		return userID;
	}

	public void setUserID(int userID) {
		this.userID = userID;
	}

	public String getAccountID() {
		return accountID;
	}

	public void setAccountID(String accountID) {
		this.accountID = accountID;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public double getAmount() {
		return amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}

	public double getExBalance() {
		return exBalance;
	}

	public void setExBalance(double exBalance) {
		this.exBalance = exBalance;
	}

	public Timestamp getDate() {
		return date;
	}

	public void setDate(Timestamp date) {
		this.date = date;
	}

	public int getProvideId() {
		return provideId;
	}

	public void setProvideId(int provideId) {
		this.provideId = provideId;
	}

}
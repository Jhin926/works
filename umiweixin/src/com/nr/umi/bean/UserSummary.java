package com.nr.umi.bean;

import java.util.Date;

public class UserSummary {
	
	private int userId;
	private String userName;
	private int isVerified;
	private double totalAmount;
	private int refererId;
	private Date date;
	public int getUserId() {
		return userId;
	}
	public void setUserId(int userId) {
		this.userId = userId;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public int getIsVerified() {
		return isVerified;
	}
	public void setIsVerified(int isVerified) {
		this.isVerified = isVerified;
	}
	public double getTotalAmount() {
		return totalAmount;
	}
	public void setTotalAmount(double totalAmount) {
		this.totalAmount = totalAmount;
	}
	public int getRefererId() {
		return refererId;
	}
	public void setRefererId(int refererId) {
		this.refererId = refererId;
	}
	public Date getDate() {
		return date;
	}
	public void setDate(Date date) {
		this.date = date;
	}
	
}

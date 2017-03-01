package com.nr.umi.bean;

public class CenterProcess {
	//
	private int id;
	//原账户id
	private String srcID;
	//目的账户id
	private String dstID;
	//用户id
	private Integer userID;
	//流水id
	private Integer cashID;
	//订单号
	private String orderNo;
	//订单金额
	private Double amount;
	// 目的账户流水
	private Integer dstCashID;
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getSrcID() {
		return srcID;
	}

	public void setSrcID(String srcID) {
		this.srcID = srcID;
	}

	public String getDstID() {
		return dstID;
	}

	public void setDstID(String dstID) {
		this.dstID = dstID;
	}

	public Integer getUserID() {
		return userID;
	}

	public void setUserID(Integer userID) {
		this.userID = userID;
	}

	public Integer getCashID() {
		return cashID;
	}

	public void setCashID(Integer cashID) {
		this.cashID = cashID;
	}

	public String getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(String orderNo) {
		this.orderNo = orderNo;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public Integer getDstCashID() {
		return dstCashID;
	}

	public void setDstCashID(Integer dstCashID) {
		this.dstCashID = dstCashID;
	}

	@Override
	public String toString() {
		return "CenterProcess [id=" + id + ", srcID=" + srcID + ", dstID=" + dstID + ", userID=" + userID + ", cashID="
				+ cashID + ", orderNo=" + orderNo + ", amount=" + amount + ", dstCashID=" + dstCashID + "]";
	}

}

package com.nr.umi.bean;

import java.sql.Timestamp;

/**
 * 转账备注，用于人工转账
 * 
 * @author tzhang update by yi.yuan
 */
public class TransferRemark {
	// 主键
	private int id;
	// 用户的新浪账户
	private long identityId;
	// 转账金额
	private double amount;
	// 创建时间
	private Timestamp createTime;
	// 备注
	private String comment;
	// 是否完成,0:未完成,1:已完成
	private int isCompleted;
	// 类型,0:充值；1:提现;2:转账;3:其他;
	private int transferType;
	// 流水id
	private Integer cashID;
	//目的账户流水
	private Integer dstCashID;
	// action表id
	private Integer actionID;
	// 用户id
	private Integer userID;
	// 订单id
	private Integer orderID;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public long getIdentityId() {
		return identityId;
	}

	public void setIdentityId(long identityId) {
		this.identityId = identityId;
	}

	public double getAmount() {
		return amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}

	public Timestamp getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Timestamp createTime) {
		this.createTime = createTime;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public int getIsCompleted() {
		return isCompleted;
	}

	public void setIsCompleted(int isCompleted) {
		this.isCompleted = isCompleted;
	}

	public int getTransferType() {
		return transferType;
	}

	public void setTransferType(int transferType) {
		this.transferType = transferType;
	}

	public Integer getCashID() {
		return cashID;
	}

	public void setCashID(Integer cashID) {
		this.cashID = cashID;
	}

	public Integer getDstCashID() {
		return dstCashID;
	}

	public void setDstCashID(Integer dstCashID) {
		this.dstCashID = dstCashID;
	}

	public Integer getActionID() {
		return actionID;
	}

	public void setActionID(Integer actionID) {
		this.actionID = actionID;
	}

	public Integer getUserID() {
		return userID;
	}

	public void setUserID(Integer userID) {
		this.userID = userID;
	}

	public Integer getOrderID() {
		return orderID;
	}

	public void setOrderID(Integer orderID) {
		this.orderID = orderID;
	}

	@Override
	public String toString() {
		return "TransferRemark [id=" + id + ", identityId=" + identityId + ", amount=" + amount + ", createTime="
				+ createTime + ", comment=" + comment + ", isCompleted=" + isCompleted + ", transferType="
				+ transferType + ", cashID=" + cashID + ", dstCashID=" + dstCashID + ", actionID=" + actionID
				+ ", userID=" + userID + ", orderID=" + orderID + "]";
	}

}
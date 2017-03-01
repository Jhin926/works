package com.nr.umi.bean;

import java.sql.Timestamp;
import java.util.Date;

/**
 * 现金流水
 * @author update by yi.yuan
 */
public class CashFlow {

	private int id;
	// 用户id
	private Integer userId;
	// 账户唯一标示
	private String accountID;
	// 账户名称
	private String accountName;
	// 余额
	private Double amount;
	// 目的账户标示
	private String dstAccountID;
	// 目的账户名称
	private String dstAccountName;
	// 是否系统生成流水 1是0不是
	private Integer systemGenerated;
	// 消费类型id
	private Integer categoryID;
	// 消费类型名称
	private String categoryName;
	// 备注
	private String comment;
	// 创建时间
	private Date createTimestamp;
	// 更新时间戳
	private Timestamp updateTimeStamp;
	// 流水状态 0:处理完成,1:待处理,2:失败
	private Integer status;
	// 是否覆盖之前流水,0:不覆盖,1:覆盖
	private Integer isCover;
	// 订单状态id
	private Integer orderID;
	// 流水版本号,0为旧版本没有流水详情
	private Integer version;

	/*
	 * //记录流水行为 private String actionStr; //记录流水的详细行为 private String
	 * actionDetails; //以字符串形式记录日期 private String dateStr; //流水交易额 private
	 * String dealAmount;
	 */
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public String getAccountID() {
		return accountID;
	}

	public void setAccountID(String accountID) {
		this.accountID = accountID;
	}

	public String getAccountName() {
		return accountName;
	}

	public void setAccountName(String accountName) {
		this.accountName = accountName;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public String getDstAccountID() {
		return dstAccountID;
	}

	public void setDstAccountID(String dstAccountID) {
		this.dstAccountID = dstAccountID;
	}

	public String getDstAccountName() {
		return dstAccountName;
	}

	public void setDstAccountName(String dstAccountName) {
		this.dstAccountName = dstAccountName;
	}

	public Integer getSystemGenerated() {
		return systemGenerated;
	}

	public void setSystemGenerated(Integer systemGenerated) {
		this.systemGenerated = systemGenerated;
	}

	public Integer getCategoryID() {
		return categoryID;
	}

	public void setCategoryID(Integer categoryID) {
		this.categoryID = categoryID;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public Date getCreateTimestamp() {
		return createTimestamp;
	}

	public void setCreateTimestamp(Date createTimestamp) {
		this.createTimestamp = createTimestamp;
	}

	public Timestamp getUpdateTimeStamp() {
		return updateTimeStamp;
	}

	public void setUpdateTimeStamp(Timestamp updateTimeStamp) {
		this.updateTimeStamp = updateTimeStamp;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public Integer getIsCover() {
		return isCover;
	}

	public void setIsCover(Integer isCover) {
		this.isCover = isCover;
	}

	public Integer getOrderID() {
		return orderID;
	}

	public void setOrderID(Integer orderID) {
		this.orderID = orderID;
	}

	public Integer getVersion() {
		return version;
	}

	public void setVersion(Integer version) {
		this.version = version;
	}

	@Override
	public String toString() {
		return "CashFlow [id=" + id + ", userId=" + userId + ", accountID=" + accountID + ", accountName=" + accountName
				+ ", amount=" + amount + ", dstAccountID=" + dstAccountID + ", dstAccountName=" + dstAccountName
				+ ", systemGenerated=" + systemGenerated + ", categoryID=" + categoryID + ", categoryName="
				+ categoryName + ", comment=" + comment + ", createTimestamp=" + createTimestamp + ", updateTimeStamp="
				+ updateTimeStamp + ", status=" + status + ", isCover=" + isCover + ", orderID=" + orderID
				+ ", version=" + version + "]";
	}

}

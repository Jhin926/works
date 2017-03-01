package com.nr.umi.bean;

import java.util.Date;
import java.sql.Timestamp;

/**
 * 用户账户信息
 */
public class UserAccountInfo {

	private int id;
	// 用户id
	private Integer user_id;
	// 账户唯一标示
	private String accountID;
	// 账户名称
	private String accountName;
	// 账户类型
	private Integer accountType;
	// 余额
	private Double balance;
	// 昨日收益
	private Double profitAmt;
	// 近一月收益
	private Double profitAmt1m;
	// 总收益
	private Double profitAmtSum;
	// 万份汇报
	private Double profit10k;
	// 七日年化收益率
	private Double profit7d;
	// 创建日期
	private Date date;
	// 购买时间
	private Date boughtDate;
	// 是否已经删除该账户：1未删除0删除,当账户余额小于0.01时,将其设置为0
	private Integer isValid;
	// 账户是否验证:0未验证1已验证
	private Integer validated;
	// 最后一次交易账户标示
	private Integer lastDstAcctId;
	// 最后一次交易账户名称
	private String lastDstAcctName;
	// 最后一次交易账户消费类型标示
	private Integer lastCategoryId;
	// 最后一次交易账户消费类型名称
	private String lastCategoryName;
	// 本金
	private Double principal;
	// 期望收益
	private Double profitExcepted;
	// 剩余天数
	private Integer remainDays;
	private Timestamp timestamp;
	// 是否不生成流水
	private Integer noCashFlow;
	// 冻结资金
	private Double freezedAmount;
	//期限
	private Integer duration;
	
	/*
	 * 以下属性只是作为显示,不持久化到数据库中
	 */
	// 悠米定制期限,只有悠米定制有,只用于悠米定制账户的显示页面
	private int timeLimit;
	
	// 账号图标名称
	private String accountPic;
	//账户到期时间
	private String expirationDate;

	public UserAccountInfo() {

	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public Integer getUser_id() {
		return user_id;
	}

	public void setUser_id(Integer user_id) {
		this.user_id = user_id;
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

	public Integer getAccountType() {
		return accountType;
	}

	public void setAccountType(Integer accountType) {
		this.accountType = accountType;
	}

	public Double getBalance() {
		return balance;
	}

	public void setBalance(Double balance) {
		this.balance = balance;
	}

	public Double getProfitAmt() {
		return profitAmt;
	}

	public void setProfitAmt(Double profitAmt) {
		this.profitAmt = profitAmt;
	}

	public Double getProfit7d() {
		return profit7d;
	}

	public void setProfit7d(Double profit7d) {
		this.profit7d = profit7d;
	}

	public Integer getIsValid() {
		return isValid;
	}

	public void setIsValid(Integer isValid) {
		this.isValid = isValid;
	}

	public Timestamp getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Timestamp timestamp) {
		this.timestamp = timestamp;
	}

	public Integer getLastDstAcctId() {
		return lastDstAcctId;
	}

	public void setLastDstAcctId(Integer lastDstAcctId) {
		this.lastDstAcctId = lastDstAcctId;
	}

	public String getLastDstAcctName() {
		return lastDstAcctName;
	}

	public void setLastDstAcctName(String lastDstAcctName) {
		this.lastDstAcctName = lastDstAcctName;
	}

	public Integer getLastCategoryId() {
		return lastCategoryId;
	}

	public void setLastCategoryId(Integer lastCategoryId) {
		this.lastCategoryId = lastCategoryId;
	}

	public String getLastCategoryName() {
		return lastCategoryName;
	}

	public void setLastCategoryName(String lastCategoryName) {
		this.lastCategoryName = lastCategoryName;
	}

	public Double getProfitAmt1m() {
		return profitAmt1m;
	}

	public void setProfitAmt1m(Double profitAmt1m) {
		this.profitAmt1m = profitAmt1m;
	}

	public Double getProfitAmtSum() {
		return profitAmtSum;
	}

	public void setProfitAmtSum(Double profitAmtSum) {
		this.profitAmtSum = profitAmtSum;
	}

	public Double getProfit10k() {
		return profit10k;
	}

	public void setProfit10k(Double profit10k) {
		this.profit10k = profit10k;
	}

	public Integer getValidated() {
		return validated;
	}

	public void setValidated(Integer validated) {
		this.validated = validated;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public Date getBoughtDate() {
		return boughtDate;
	}

	public void setBoughtDate(Date boughtDate) {
		this.boughtDate = boughtDate;
	}

	public Double getPrincipal() {
		return principal;
	}

	public void setPrincipal(Double principal) {
		this.principal = principal;
	}

	public Double getProfitExcepted() {
		return profitExcepted;
	}

	public void setProfitExcepted(Double profitExcepted) {
		this.profitExcepted = profitExcepted;
	}

	public Integer getRemainDays() {
		return remainDays;
	}

	public void setRemainDays(Integer remainDays) {
		this.remainDays = remainDays;
	}

	public Integer getNoCashFlow() {
		return noCashFlow;
	}

	public void setNoCashFlow(Integer noCashFlow) {
		this.noCashFlow = noCashFlow;
	}

	public Double getFreezedAmount() {
		return freezedAmount;
	}

	public void setFreezedAmount(Double freezedAmount) {
		this.freezedAmount = freezedAmount;
	}

	public Integer getDuration() {
		return duration;
	}

	public void setDuration(Integer duration) {
		this.duration = duration;
	}

	public String getAccountPic() {
		return accountPic;
	}

	public void setAccountPic(String accountPic) {
		this.accountPic = accountPic;
	}

	public int getTimeLimit() {
		return timeLimit;
	}

	public void setTimeLimit(int timeLimit) {
		this.timeLimit = timeLimit;
	}

	public String getExpirationDate() {
		return expirationDate;
	}

	/**
	 * 设置到期日期
	 */
	public void setExpirationDate(String expirationDate) {
		this.expirationDate = expirationDate;
	}

	@Override
	public String toString() {
		return "UserAccountInfo [id=" + id + ", user_id=" + user_id + ", accountID=" + accountID + ", accountName="
				+ accountName + ", balance=" + balance + ", date=" + date + ", boughtDate=" + boughtDate + ", isValid="
				+ isValid + ", principal=" + principal + ", remainDays=" + remainDays + ", timestamp=" + timestamp
				+ ", freezedAmount=" + freezedAmount + "]";
	}

}

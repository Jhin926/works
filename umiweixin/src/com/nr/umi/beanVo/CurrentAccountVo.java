package com.nr.umi.beanVo;

import java.util.Date;

/**
 * 页面显示活期账户信息
 */
public class CurrentAccountVo {

	private int id;
	// 用户id
	private Integer user_id;
	// 账户唯一标示
	private String accountID;
	// 账户名称
	private String accountName;
	// 余额
	private Double balance;
	// 昨日收益
	private Double profitAmt;
	// 近一月收益
	private Double profitAmt1m;
	// 总收益
	private Double profitAmtSum;
	// 昨日万份收益率
	private Double profit10k;
	// 昨日七天年化收益率
	private Double profit7d;
	// 创建日期
	private Date date;
	// 正在计息金额
	private Double increasing_money;
	// 等待计息金额
	private Double waiting_money;

	// 期望收益
	private Double profitExcepted;
	// 账号图标名称
	private String accountPic;

	public CurrentAccountVo() {

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

	public Double getBalance() {
		return balance;
	}

	public void setBalance(Double balance) {
		this.balance = balance;
	}

	/**
	 * 昨日收益
	 */
	public Double getProfitAmt() {
		return profitAmt;
	}
	/**
	 * 昨日收益
	 */
	public void setProfitAmt(Double profitAmt) {
		this.profitAmt = profitAmt;
	}

	/**
	 * 昨日七天年化收益率
	 */
	public Double getProfit7d() {
		return profit7d;
	}

	/**
	 * 昨日七天年化收益率
	 */
	public void setProfit7d(Double profit7d) {
		this.profit7d = profit7d;
	}

	/**
	 * 近一月收益
	 */
	public Double getProfitAmt1m() {
		return profitAmt1m;
	}
	/**
	 * 近一月收益
	 */
	public void setProfitAmt1m(Double profitAmt1m) {
		this.profitAmt1m = profitAmt1m;
	}

	/**
	 * 总收益
	 */
	public Double getProfitAmtSum() {
		return profitAmtSum;
	}
	/**
	 * 总收益
	 */
	public void setProfitAmtSum(Double profitAmtSum) {
		this.profitAmtSum = profitAmtSum;
	}
	/**
	 * 昨日万份收益率
	 */
	public Double getProfit10k() {
		return profit10k;
	}
	/**
	 * 昨日万份收益率
	 */
	public void setProfit10k(Double profit10k) {
		this.profit10k = profit10k;
	}

	public Double getProfitExcepted() {
		return profitExcepted;
	}

	public void setProfitExcepted(Double profitExcepted) {
		this.profitExcepted = profitExcepted;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	/**
	 * 正在计息金额
	 */
	public Double getIncreasing_money() {
		return increasing_money;
	}

	/**
	 * 正在计息金额
	 */
	public void setIncreasing_money(Double increasing_money) {
		this.increasing_money = increasing_money;
	}

	/**
	 * 等待计息金额
	 */
	public Double getWaiting_money() {
		return waiting_money;
	}

	/**
	 * 等待计息金额
	 */
	public void setWaiting_money(Double waiting_money) {
		this.waiting_money = waiting_money;
	}

	public String getAccountPic() {
		return accountPic;
	}

	public void setAccountPic(String accountPic) {
		this.accountPic = accountPic;
	}

	@Override
	public String toString() {
		return "CurrentAccountVo [id=" + id + ", user_id=" + user_id + ", accountID=" + accountID + ", accountName="
				+ accountName + ", balance=" + balance + ", date=" + date + ", increasing_money=" + increasing_money
				+ ", waiting_money=" + waiting_money + "]";
	}

}

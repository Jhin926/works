package com.nr.umi.bean;

import java.sql.Date;

/**
 * 收益率 Established in 2015年10月20日
 */
public class Yield {

	private int id;
	private String fundCode;
	private Date date;
	private Double dRate;
	private Double kReturn;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getFundCode() {
		return fundCode;
	}

	public void setFundCode(String fundCode) {
		this.fundCode = fundCode;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public Double getdRate() {
		return dRate;
	}

	public void setdRate(Double dRate) {
		this.dRate = dRate;
	}

	public Double getkReturn() {
		return kReturn;
	}

	public void setkReturn(Double kReturn) {
		this.kReturn = kReturn;
	}

	@Override
	public String toString() {
		return "Yield [id=" + id + ", fundCode=" + fundCode + ", date=" + date + ", dRate=" + dRate + ", kReturn="
				+ kReturn + "]";
	}
}

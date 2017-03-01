package com.nr.umi.bean;

import java.io.Serializable;
import java.sql.Timestamp;

public class Experience implements Serializable {
	private static final long serialVersionUID = -3708423700152508092L;
	// 编号
	private int eNo;
	// 上次领取到当前时间的体验金金额
	private double eExperienceing;
	// 领取之前的体验金金额
	private double eExperienced;
	// 体验金类型(可固定为888)
	private int eType;
	// 悠米账户编号
	private int eUNo;
	// 上次领取到当前时间累积体验金的好友数量
	private int eFriendNum;
	// 天数
	private int eDays;
	// 领取时间
	private Timestamp receiveDate;

	public Experience(int eNo, double eExperienceing, double eExperienced, int eType, int eUNo) {
		this.eNo = eNo;
		this.eExperienceing = eExperienceing;
		this.eExperienced = eExperienced;
		this.eType = eType;
		this.eUNo = eUNo;
	}

	public Experience() {
	}

	public int geteNo() {
		return eNo;
	}

	public void seteNo(int eNo) {
		this.eNo = eNo;
	}

	public double geteExperienceing() {
		return eExperienceing;
	}

	public void seteExperienceing(double eExperienceing) {
		this.eExperienceing = eExperienceing;
	}

	public double geteExperienced() {
		return eExperienced;
	}

	public void seteExperienced(double eExperienced) {
		this.eExperienced = eExperienced;
	}

	public int geteType() {
		return eType;
	}

	public void seteType(int eType) {
		this.eType = eType;
	}

	public int geteUNo() {
		return eUNo;
	}

	public void seteUNo(int eUNo) {
		this.eUNo = eUNo;
	}

	public int geteFriendNum() {
		return eFriendNum;
	}

	public void seteFriendNum(int eFriendNum) {
		this.eFriendNum = eFriendNum;
	}

	public int geteDays() {
		return eDays;
	}

	public void seteDays(int eDays) {
		this.eDays = eDays;
	}

	public Timestamp getReceiveDate() {
		return receiveDate;
	}

	public void setReceiveDate(Timestamp receiveDate) {
		this.receiveDate = receiveDate;
	}

}
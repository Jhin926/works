package com.nr.umi.bean;

import java.io.Serializable;

public class FRUserInfo implements Serializable {
	private static final long serialVersionUID = 1L;
	private Integer uNo;
	private Integer uUmiId;
	private String wenXinNo;
	private Double uExprience;
	private Integer uFriendsNum;
	private Integer uDirectPeople;
	private Integer uIndirectPeople;
	private byte[] ret;
	private long timmer;
	private Integer bankFlag;
	private Integer isPayed;

	public Integer getIsPayed() {
		return isPayed;
	}

	public void setIsPayed(Integer isPayed) {
		this.isPayed = isPayed;
	}

	public Integer getBankFlag() {
		return bankFlag;
	}

	public void setBankFlag(Integer bankFlag) {
		this.bankFlag = bankFlag;
	}

	public byte[] getRet() {
		return ret;
	}

	public void setRet(byte[] ret) {
		this.ret = ret;
	}

	public long getTimmer() {
		return timmer;
	}

	public void setTimmer(long timmer) {
		this.timmer = timmer;
	}

	public Integer getuDirectPeople() {
		return uDirectPeople;
	}

	public void setuDirectPeople(Integer uDirectPeople) {
		this.uDirectPeople = uDirectPeople;
	}

	public Integer getuIndirectPeople() {
		return uIndirectPeople;
	}

	public void setuIndirectPeople(Integer uIndirectPeople) {
		this.uIndirectPeople = uIndirectPeople;
	}

	public Integer getuFriendsNum() {
		return uFriendsNum;
	}

	public void setuFriendsNum(Integer uFriendsNum) {
		this.uFriendsNum = uFriendsNum;
	}

	public Double getuExprience() {
		return uExprience;
	}

	public void setuExprience(Double uExprience) {
		this.uExprience = uExprience;
	}

	public Integer getuNo() {
		return uNo;
	}

	public void setuNo(Integer uNo) {
		this.uNo = uNo;
	}

	public Integer getuUmiId() {
		return uUmiId;
	}

	public void setuUmiId(Integer uUmiId) {
		this.uUmiId = uUmiId;
	}

	public String getWenXinNo() {
		return wenXinNo;
	}

	public void setWenXinNo(String wenXinNo) {
		this.wenXinNo = wenXinNo;
	}

	public FRUserInfo() {

	}

	public FRUserInfo(Integer uNo, Integer uUmiId, String wenXinNo) {
		this.uNo = uNo;
		this.uUmiId = uUmiId;
		this.wenXinNo = wenXinNo;
	}

	@Override
	public String toString() {
		return "FRUserInfo [uNo=" + uNo + ", uUmiId=" + uUmiId + ", wenXinNo=" + wenXinNo + ", uDirectPeople="
				+ uDirectPeople + ", uIndirectPeople=" + uIndirectPeople + ", bankFlag=" + bankFlag + "]";
	}

}
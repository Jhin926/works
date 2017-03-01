package com.nr.umi.bean;

public class UserSession {
	private int id;
	private String ticket;
	private long freshTime;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getTicket() {
		return ticket;
	}
	public void setTicket(String ticket) {
		this.ticket = ticket;
	}
	public long getFreshTime() {
		return freshTime;
	}
	public void setFreshTime(long freshTime) {
		this.freshTime = freshTime;
	}
}

package com.nr.umi.bean;

import java.sql.Timestamp;

/*
 * 
 */
public class UserRelation {

	private int id;
	private int userId;
	private String userStatus;
	private double reward;
	// 资格奖励
	private double qualificationReward;
	// 注册奖励
	private double registerReward;
	// 投资资金
	private double investReward;
	private Timestamp timestamp;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getUserId() {
		return userId;
	}

	public void setUserId(int userId) {
		this.userId = userId;
	}

	public String getUserStatus() {
		return userStatus;
	}

	public void setUserStatus(String userStatus) {
		this.userStatus = userStatus;
	}

	public double getReward() {
		return reward;
	}

	public void setReward(double reward) {
		this.reward = reward;
	}

	public Timestamp getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Timestamp timestamp) {
		this.timestamp = timestamp;
	}

	public double getQualificationReward() {
		return qualificationReward;
	}

	public void setQualificationReward(double qualificationReward) {
		this.qualificationReward = qualificationReward;
	}

	public double getRegisterReward() {
		return registerReward;
	}

	public void setRegisterReward(double registerReward) {
		this.registerReward = registerReward;
	}

	public double getInvestReward() {
		return investReward;
	}

	public void setInvestReward(double investReward) {
		this.investReward = investReward;
	}

	@Override
	public String toString() {
		return "UserRelation [id=" + id + ", userId=" + userId + ", userStatus=" + userStatus + ", reward=" + reward
				+ ", qualificationReward=" + qualificationReward + ", registerReward=" + registerReward
				+ ", investReward=" + investReward + ", timestamp=" + timestamp + "]";
	}

}

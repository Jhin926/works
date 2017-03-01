package com.nr.umi.bean;

import java.util.Date;

/**
 * UMI用户
 */

public class UMIUser {

	private int id;
	private String userName;
	// 用户名 暗文,eg:187****5768
	private String userNameCT;

	private String password;
	private String userMobile;
	private Date lastLogonTime;

	private String lastLogonIP;

	// 移动电话验证,1表示已经验证
	private int mobileVerified;

	// 支付密码
	private String cashPwd;

	private Date registerTime;
	private String registerIP;

	private String token;

	// 该用户在新浪中的id,uid
	private long identityId;

	// 是否已实名认证
	private int isVerified;

	private Date timestamp;
	// 当前手机客服端版本号
	private String version;
	// 拥有卡数量
	private int cardCount;
	// 真实姓名
	private String realName;
	// 身份证号码
	private String certNo;

	/*
	 * 以下字段还未在配置文件中添加映射关系
	 */
	private int isMerchant;
	private Integer merchantID;
	private Integer isDrawed;

	public Integer getIsDrawed() {
		return isDrawed;
	}

	public void setIsDrawed(Integer isDrawed) {
		this.isDrawed = isDrawed;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getUserNameCT() {
		return userNameCT;
	}

	public void setUserNameCT(String userNameCT) {
		this.userNameCT = userNameCT;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public int getIsMerchant() {
		return isMerchant;
	}

	public void setIsMerchant(int isMerchant) {
		this.isMerchant = isMerchant;
	}

	public Integer getMerchantID() {
		return merchantID;
	}

	public void setMerchantID(Integer merchantID) {
		this.merchantID = merchantID;
	}

	public String getUserMobile() {
		return userMobile;
	}

	public void setUserMobile(String userMobile) {
		this.userMobile = userMobile;
	}

	public Date getRegisterTime() {
		return registerTime;
	}

	public void setRegisterTime(Date registerTime) {
		this.registerTime = registerTime;
	}

	public String getRegisterIP() {
		return registerIP;
	}

	public void setRegisterIP(String registerIP) {
		this.registerIP = registerIP;
	}

	public Date getLastLogonTime() {
		return lastLogonTime;
	}

	public void setLastLogonTime(Date lastLogonTime) {
		this.lastLogonTime = lastLogonTime;
	}

	public String getLastLogonIP() {
		return lastLogonIP;
	}

	public void setLastLogonIP(String lastLogonIP) {
		this.lastLogonIP = lastLogonIP;
	}

	public int getIsVerified() {
		return isVerified;
	}

	public void setIsVerified(int isVerified) {
		this.isVerified = isVerified;
	}

	public int getMobileVerified() {
		return mobileVerified;
	}

	public void setMobileVerified(int mobileVerified) {
		this.mobileVerified = mobileVerified;
	}

	public String getCashPwd() {
		return cashPwd;
	}

	public void setCashPwd(String cashPwd) {
		this.cashPwd = cashPwd;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public long getIdentityId() {
		return identityId;
	}

	public void setIdentityId(long identityId) {
		this.identityId = identityId;
	}

	public Date getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public int getCardCount() {
		return cardCount;
	}

	public void setCardCount(int cardCount) {
		this.cardCount = cardCount;
	}

	public String getRealName() {
		return realName;
	}

	public void setRealName(String realName) {
		this.realName = realName;
	}

	public String getCertNo() {
		return certNo;
	}

	public void setCertNo(String certNo) {
		this.certNo = certNo;
	}

	@Override
	public String toString() {
		return "UMIUser [id=" + id + ", userName=" + userName + ", identityId=" + identityId + ", isVerified="
				+ isVerified + ", timestamp=" + timestamp + ", cardCount=" + cardCount + ", realName=" + realName
				+ ", certNo=" + certNo + "]";
	}

}

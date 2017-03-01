package com.nr.umi.bean;

public class ExtensionWorker {

	private int id;
	private String phoneNo;
	private String password;
	//真实姓名
	private String realName;
	//身份证号
	private String cardID;
	//备用联系人(姓名)
	private String spareContact;
	//联系人关系
	private String relation;
	//联系方式(手机)
	private String contactNo;
	//代理编号
	private String agentNu;
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getPhoneNo() {
		return phoneNo;
	}
	public void setPhoneNo(String phoneNo) {
		this.phoneNo = phoneNo;
	}
	public String getRealName() {
		return realName;
	}
	public void setRealName(String realName) {
		this.realName = realName;
	}
	public String getCardID() {
		return cardID;
	}
	public void setCardID(String cardID) {
		this.cardID = cardID;
	}
	public String getSpareContact() {
		return spareContact;
	}
	public void setSpareContact(String spareContact) {
		this.spareContact = spareContact;
	}
	public String getRelation() {
		return relation;
	}
	public void setRelation(String relation) {
		this.relation = relation;
	}
	public String getContactNo() {
		return contactNo;
	}
	public void setContactNo(String contactNo) {
		this.contactNo = contactNo;
	}
	public String getAgentNu() {
		return agentNu;
	}
	public void setAgentNu(String agentNu) {
		this.agentNu = agentNu;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	@Override
	public String toString() {
		return "ExtensionWorker [id=" + id + ", phoneNo=" + phoneNo + ", password=" + password + ", realName="
				+ realName + ", cardID=" + cardID + ", spareContact=" + spareContact + ", relation=" + relation
				+ ", contactNo=" + contactNo + ", agentNu=" + agentNu + "]";
	}
	
}

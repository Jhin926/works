package com.nr.umi.action;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import org.apache.struts2.ServletActionContext;

import com.nr.umi.bean.UMIUser;
import com.nr.umi.bean.UserAccountInfo;
import com.nr.umi.service.UmiService;
import com.opensymphony.xwork2.ActionSupport;

public class Account400Action  extends ActionSupport {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2212745334134441853L;
	
	@Resource(name = "umiService")
	private UmiService service;
	private String accountID;
	UserAccountInfo acc;
	
	public String getAccountID() {
		return accountID;
	}

	public void setAccountID(String accountID) {
		this.accountID = accountID;
	}

	public UserAccountInfo getAcc() {
		return acc;
	}

	public void setAcc(UserAccountInfo acc) {
		this.acc = acc;
	}

	@Override
	public String execute() throws Exception {
		HttpServletRequest request=ServletActionContext.getRequest();
		UMIUser user = (UMIUser)request.getAttribute("user");
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		String date = sdf.format(new Date());
		
		acc = service.findAllAcc(user.getId(), date, accountID).get(0);
		
		return super.execute();
	}
	
}

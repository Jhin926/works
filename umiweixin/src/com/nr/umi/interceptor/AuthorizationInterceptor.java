package com.nr.umi.interceptor;

import java.util.Map;

import com.nr.umi.bean.UMIUser;
import com.nr.umi.util.TokenUtil;
import com.opensymphony.xwork2.ActionInvocation;
import com.opensymphony.xwork2.interceptor.AbstractInterceptor;

public class AuthorizationInterceptor extends AbstractInterceptor {

	private static final long serialVersionUID = -2300073398746785663L;

	@Override
	public String intercept(ActionInvocation invocation) throws Exception {
		Map<String, Object> session= invocation.getInvocationContext().getSession();
		UMIUser user=(UMIUser) session.get("user");
		if(user==null){
			return "userIsNull";
		}
		if(user.getIsVerified()==0){
			session.put("realNameVerifyToken", TokenUtil.getToken(user.getId()));
			return "realNameVerify";
		}
		return invocation.invoke();
	}

}

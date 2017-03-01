package com.nr.umi.servlet;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 从悠米跳转到活动中转站,根据相应的参数重定向到对应请求
 * 
 * @author yi.yuan Established in 2015年12月21日
 */
public class JumpActivityDispatchServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public JumpActivityDispatchServlet() {
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		String basePath = "/" + request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort();
		System.out.println(basePath);
		String pathCode = request.getParameter("pathCode");
		if (pathCode == null || pathCode.trim().equals("")) {
			return;
		}
		pathCode = pathCode.trim();
		//体验金管理
		if (pathCode.equals("1")) {
			response.sendRedirect("https://open.weixin.qq.com/connect/oauth2/authorize?" //防止格式化
					+ "appid=wxff47394144bab785"
					+ "&redirect_uri=http%3a%2f%2fwww.momibank.com%2factivitycenter%2fuserAction!toMygold"
					+ "&response_type=code" //
					+ "&scope=snsapi_base" //
					+ "&state=123#wechat_redirect");
		//活动中心
		} else if (pathCode.equals("2")) {
			response.sendRedirect("https://open.weixin.qq.com/connect/oauth2/authorize?" //
					+ "appid=wxff47394144bab785"
					+ "&redirect_uri=http%3A%2F%2Fwww.momibank.com%2Factivitycenter%2FuserAction!loginW"
					+ "&response_type=code" //
					+ "&scope=snsapi_base" //
					+ "&state=123#wechat_redirect");
		//活动中心
		} else if (pathCode.equals("3")) {
			response.sendRedirect("https://open.weixin.qq.com/connect/oauth2/authorize?"//
					+ "appid=wxff47394144bab785"
					+ "&redirect_uri=http%3A%2F%2Fwww.momibank.com%2Fumiweixin%2Fpages%2Factives.jsp"
					+ "&response_type=code" //
					+ "&scope=snsapi_base" //
					+ "&state=123#wechat_redirect");
		}
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doGet(request, response);
	}

}

package com.nr.umi.bean;
public class ApiRequest {

	private int id;
	// 用户id
	private int user_id;
	// 请求类型，新浪的为1 ，水电煤为2
	private int api_type;
	// 请求名称
	private String api_name;
	private int api_id;
	// 请求字符串
	private String request;
	// 响应字符串
	private String response;
	// 订单号
	private String orderNo;
	//是否错误返回 0:正常。1:错误
	private Integer isError;
	
	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public int getUser_id() {
		return user_id;
	}

	public void setUser_id(int user_id) {
		this.user_id = user_id;
	}

	public int getApi_type() {
		return api_type;
	}

	public void setApi_type(int api_type) {
		this.api_type = api_type;
	}

	public String getApi_name() {
		return api_name;
	}

	public void setApi_name(String api_name) {
		this.api_name = api_name;
	}

	public int getApi_id() {
		return api_id;
	}

	public void setApi_id(int api_id) {
		this.api_id = api_id;
	}

	public String getRequest() {
		return request;
	}

	public void setRequest(String request) {
		this.request = request;
	}

	public String getResponse() {
		return response;
	}

	public void setResponse(String response) {
		this.response = response;
	}

	public String getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(String orderNo) {
		this.orderNo = orderNo;
	}

	public Integer getIsError() {
		return isError;
	}

	public void setIsError(Integer isError) {
		this.isError = isError;
	}

}
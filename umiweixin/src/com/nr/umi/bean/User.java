package com.nr.umi.bean;

import java.io.Serializable;
import java.util.Arrays;

/**
 * 微信用户与umi账户的关联
 * 
 * @author yi.yuan
 *
 *         Established in 2015年11月20日
 */
public class User implements Serializable {

	private static final long serialVersionUID = 2235985646865065761L;
	// 编号
	private int no;
	// 悠米账户编号
	private int umiId;
	// 微信账号记录openId
	private String wenXinNo;
	// 存储微信用户的信息
	private byte[] ret;

	public User() {
	}
	
	/**
	 * @param wenXinNo  openId
	 * @param ret	    微信用户信息
	 */
	public User(String wenXinNo, byte[] ret) {
		this.wenXinNo = wenXinNo;
		this.ret = ret;
	}

	public int getNo() {
		return no;
	}

	public void setNo(int no) {
		this.no = no;
	}
	/**
	 * @return 悠米用户id
	 */
	public int getUmiId() {
		return umiId;
	}

	/**
	 * 设置悠米用户的userId
	 */
	public void setUmiId(int umiId) {
		this.umiId = umiId;
	}

	/**
	 * @return openId
	 */
	public String getWenXinNo() {
		return wenXinNo;
	}

	/**
	 * 设置openId
	 */
	public void setWenXinNo(String wenXinNo) {
		this.wenXinNo = wenXinNo;
	}

	public byte[] getRet() {
		return ret;
	}

	public void setRet(byte[] ret) {
		this.ret = ret;
	}

	@Override
	public String toString() {
		return "User [no=" + no + ", umiId=" + umiId + ", wenXinNo=" + wenXinNo + ", ret=" + Arrays.toString(ret) + "]";
	}

	/*
	 * private Integer id; // umi用户唯一标识符 private String userId; // 用户唯一标示
	 * private String openId; // 访问微信接口结果 1:失败 0：成功 private int isError; //
	 * 微信返回的结果 private String weChatResponse; // 创建时间 private Date timestamp;
	 */

}

package com.nr.umi.util;

import java.util.ArrayList;
import java.util.List;

/**
 * 按照字符来截取给定字符串  <br />
 * 返回银行卡的cardId
 */
public class CutStringUtil {
	// 给定字符串的长度
	private static int len;

	// 给定字符在字符串中的位置
	private static int location;
	
	/**
	 * 
	 * @param str 要截取的字符串
	 * @param c   字符
	 * @return 返回字符 c 的前面
	 */
	public static String getPreStringByCh(String str, char c) {
		len = str.length();
		location = str.indexOf(c);
		if (location == -1) {
			return "银行卡";
		}
		return str.substring(0, location);
	}

	/**
	 * 
	 * @param str 要截取的字符串
	 * @param c   字符
	 * @return 返回字符串中字符c与字符串最后一个字符之间的字符串
	 */
	public static String getSufStringByCh(String str, char c) {
		len = str.length();
		location = str.indexOf(c);
		if (location == -1) {
			return "";
		}
		return str.substring(location + 1, len - 1);
	}
	
	/**
	 * 
	 * @param str 多个银行卡信息,各卡信息以"|"分隔,所以必须要有"|"
	 * @return 返回银行卡的id
	 * 
	 */
	public static List<String> getCardIds(String str) {
		String[] cardInfos = str.split("\\|");
		List<String> cardIdList = new ArrayList<>();
		for (String ci : cardInfos) {
			String[] card = ci.split("\\^");
			cardIdList.add(card[0]);
		}
		return cardIdList;
	}
	
	/**
	 * @param phone : umi账号
	 * @return		: 返回存在隐藏部分形式的账号
	 */
	public static String getHidePhone(String phone){
		StringBuffer buf=new StringBuffer();
		buf.append(phone.substring(0, 3));
		buf.append("****");
		buf.append(phone.substring(7, 11));
		return buf.toString();
	}
	
	/**
	 * @param phone : umi账号
	 * @return		: 返回存在隐藏部分形式的身份证号码
	 */
	public static String getHideCertNo(String certNo) {
		StringBuffer buf = new StringBuffer();
		System.out.println(certNo.length());
		if (certNo.length() < 15) {
			return null;
		}
		buf.append(certNo.substring(0, 3));
		if (certNo.length() == 18) {
			buf.append("***********");
		} else {
			buf.append("********");
		}
		buf.append(certNo.substring(certNo.length() - 4, certNo.length()));
		return buf.toString();
	}
	
	/**
	 * 获取三位时间期限
	 * @param timeLimit 悠米定期的期限
	 * @return 以字符串的方式返回三位的时间期限 <br />
	 * eg: timeLimit:8,则返回008	<br />
	 * 	PS: 可以通过  Integer.parseInt(String)方法,直接获取int天数
	 */
	public static String getTimeLimit(int timeLimit) {
		String temp = (1000 + timeLimit) + "";
		return temp.substring(1, temp.length());
	}
	
}

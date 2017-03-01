package com.nr.umi.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
/*
 * MD5 算法
*/
public class MD5{
	public static String getMD5Code(String str){
		MessageDigest md = null;
		try {
			md = MessageDigest.getInstance("MD5");
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
		byte[] byteInput=str.getBytes();
		md.update(byteInput);
		byte[] byteOutput=md.digest();
		String result=byteArrayToString(byteOutput);
		return result;
	}

	public static String byteArrayToString(byte[] byteOutput) {
		char[] hexDigits = {'0','1','2','3','4','5','6','7','8','9', 'a','b','c','d','e','f' };
		StringBuffer sb=new StringBuffer();
		for(int i=0;i<byteOutput.length;i++){
			int iRet=byteOutput[i];
			if(iRet<0){
				iRet+=256;
			}
			char digit1=hexDigits[iRet/16];
			char digit2=hexDigits[iRet%16];
			sb.append(digit1);
			sb.append(digit2);
		}
		return sb.toString();
	}
	/*public static void main(String[] args) throws NoSuchAlgorithmException, UnsupportedEncodingException {
		MD5 md5=new MD5();
		String res=md5.getMD5Code("0000");
		System.out.println(res);
	}*/
	
}
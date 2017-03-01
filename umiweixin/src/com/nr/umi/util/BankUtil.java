package com.nr.umi.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.Properties;

public class BankUtil {
	/**
	 * 
	 * @param code 银行卡code,必须大写
	 * @return 银行卡所属银行名称
	 * @throws Exception
	 */
	public static String getBankName(String code) throws Exception {
		String path = Thread.currentThread().getContextClassLoader().getResource("").getPath();
		File f = new File(path + "banks.properties");  
        BufferedReader read = null;
        String name = "";
		read = new BufferedReader(new FileReader(f));
		Properties p = new Properties();
		p.load(read);
		read.close();
		name = p.getProperty(code);
			
		return name;
	}
	
	/**
	 * 
	 * @param cardNo 带有空格的银行卡号
	 * @return 返回没有空格的银行卡号
	 */
	public static String getBankCard(String cardNo){
		String[] result=cardNo.split(" ");
		StringBuffer bankCardNo=new StringBuffer();
		for(String str:result){
			bankCardNo.append(str);
		}
		return bankCardNo.toString();
		
	}
}

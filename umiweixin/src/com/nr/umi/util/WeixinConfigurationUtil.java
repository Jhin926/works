package com.nr.umi.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.util.Properties;

public class WeixinConfigurationUtil {
	public static String getValue(String key) {
		File f = new File("c:\\weixinInfo.properties");  
        BufferedReader read = null;
        String value = "";
		try {
			read = new BufferedReader(new FileReader(f));
			Properties p = new Properties();
			p.load(read);
			value = p.getProperty(key);
			read.close();
		} catch (Exception e) {
			return null;
		}
		return value;
	}
}

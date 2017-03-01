package com.nr.umi.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Properties;

public class ConfigurationUtil {
	public static String getValue(String key) {
		File f = new File("c:\\main.properties");  
        BufferedReader read = null;
        String value = "";
		try {
			read = new BufferedReader(new FileReader(f));
			Properties p = new Properties();
			p.load(read);
			read.close();
			value = p.getProperty(key);
			read.close();
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		return value;
	}
	
	public static String setValue(String key, String value) {
		File f = new File("c:\\main.properties");  
		OutputStream fos;
		try {
			Properties p = new Properties();
			p.load(new FileInputStream(f));
			fos = new FileOutputStream(f);
			p.setProperty(key, value);
			p.store(fos, null);
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return value;
	}
}

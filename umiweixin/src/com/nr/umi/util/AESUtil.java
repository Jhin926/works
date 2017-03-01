package com.nr.umi.util;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import org.apache.log4j.Logger;

import com.cloopen.rest.sdk.utils.encoder.BASE64Decoder;
import com.cloopen.rest.sdk.utils.encoder.BASE64Encoder;

public class AESUtil {
	private static Logger logger = Logger.getLogger(AESUtil.class);

	private static final String key = "1234567890abcdef";
	
	// 加密
	public static String Encrypt(String sSrc) {
		byte[] raw = key.getBytes();
		SecretKeySpec skeySpec = new SecretKeySpec(raw, "AES");
		Cipher cipher;
		byte[] encrypted = null;
		try {
			cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
			cipher.init(Cipher.ENCRYPT_MODE, skeySpec);
			encrypted = cipher.doFinal(sSrc.getBytes());
		} catch (Exception e) {
			e.printStackTrace();
			logger.error(e.getMessage());
		}
		return new BASE64Encoder().encode(encrypted);
	}

	// 解密
	public static String Decrypt(String sSrc) {
		try {
			byte[] raw = key.getBytes("UTF-8");
			SecretKeySpec skeySpec = new SecretKeySpec(raw, "AES");
			Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
			cipher.init(Cipher.DECRYPT_MODE, skeySpec);
			byte[] encrypted1 = new BASE64Decoder().decodeBuffer(sSrc);// 先用base64解密
			byte[] original = cipher.doFinal(encrypted1);
			String originalString = new String(original);
			return originalString;
		} catch (Exception ex) {
			logger.error(ex.getMessage());
			return null;
		}
	}
}

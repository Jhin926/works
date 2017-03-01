package com.nr.umi.util;

import java.sql.Timestamp;
import java.util.Date;

public class TokenUtil {
	public static String getToken(Integer id) {
		Timestamp ts = new Timestamp(new Date().getTime());
		String strBeforeEncrypt = id + ts.toString();
		String token = MD5.getMD5Code(strBeforeEncrypt);
		return token;

	}
}

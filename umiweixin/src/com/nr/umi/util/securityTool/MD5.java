package com.nr.umi.util.securityTool;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.PrivateKey;
import java.security.SignatureException;

import org.apache.commons.codec.digest.DigestUtils;
/*
 * MD5 算法
*/
public class MD5{
	public static String getMD5Code(String str) throws Exception{
		MessageDigest md = null;
		md = MessageDigest.getInstance("MD5");
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
	public static void main(String[] args) throws Exception {
		String res=MD5.getMD5Code("217020");
		System.out.println(res);
	}
	
	/**
     * 签名字符串
     *
     * @param text
     *            需要签名的字符串
     * @param key
     *            密钥
     * @param input_charset
     *            编码格式
     * @return 签名结果
     */
    public static String sign(String text, String key, String charset) throws Exception {
        text = text + key;
        return DigestUtils.md5Hex(getContentBytes(text, charset));
    }
    /**
     * 签名字符串
     *
     * @param text
     *            需要签名的字符串
     * @param key
     *            密钥
     * @param input_charset
     *            编码格式
     * @return 签名结果
     * @deprecated 无替代方法
     */
    public static String sign(String text, PrivateKey key, String charset) throws Exception {
        throw new UnsupportedOperationException();
    }

    /**
     * 签名字符串
     *
     * @param text
     *            需要签名的字符串
     * @param sign
     *            签名结果
     * @param key
     *            密钥
     * @param input_charset
     *            编码格式
     * @return 签名结果
     */
    public static boolean verify(String text, String sign, String key, String charset)
                                                                                      throws Exception {
        text = text + key;
        String mysign = DigestUtils.md5Hex(getContentBytes(text, charset));
        if (mysign.equals(sign)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @param content
     * @param charset
     * @return
     * @throws SignatureException
     * @throws UnsupportedEncodingException
     */
    private static byte[] getContentBytes(String content, String charset) {
        if (charset == null || "".equals(charset)) {
            return content.getBytes();
        }
        try {
            return content.getBytes(charset);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("签名过程中出现错误,指定的编码集不对,您目前指定的编码集是:" + charset);
        }
    }
}
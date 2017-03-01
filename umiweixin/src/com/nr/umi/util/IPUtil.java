package com.nr.umi.util;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;

public class IPUtil {
	/**
	 * 获取ip地址
	 * @param request
	 * @return ip
	 */
	public static String getLocalIp(HttpServletRequest request) {
       String ip = request.getHeader("X-Forwarded-For");
       if(StringUtils.isNotEmpty(ip) && !"unKnown".equalsIgnoreCase(ip)){
           int index = ip.indexOf(",");
           if(index != -1){
               return ip.substring(0,index);
           }else{
               return ip;
           }
       }
       ip = request.getHeader("X-Real-IP");
       if(StringUtils.isNotEmpty(ip) && !"unKnown".equalsIgnoreCase(ip)){
           return ip;
       }
       return request.getRemoteAddr();
    }
}

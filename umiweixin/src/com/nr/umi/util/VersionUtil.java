package com.nr.umi.util;
/**
 * 版本对比工具
 * @author tzhang
 *
 */
public class VersionUtil {
	/**
	 * 
	 * @param version 用户版本
	 * @param versionTemp 系统版本
	 * @return 1:用户版本大于系统版本;-1:用户版本小于系统版本;0:用户版本等于系统版本
	 */
	public static int compare(String version, String versionTemp) {
		String[] version1 = version.split("\\.");
		String[] version2 = versionTemp.split("\\.");
		
		int[] numbers1 = new int[3];
		int[] numbers2 = new int[3];
		for(int i = 0;i < 3;i ++) {
			numbers1[i] = Integer.parseInt(version1[i]);
			numbers2[i] = Integer.parseInt(version2[i]);
		}
		
		int flag = numbers1[0] > numbers2[0] ? 1 : numbers1[0] < numbers2[0] ? -1 : numbers1[1] > numbers2[1] ? 1
				: numbers1[1] < numbers2[1] ? -1 : numbers1[2] > numbers2[2] ? 1 : numbers1[2] < numbers2[2] ? -1 : 0;
		return flag;
	}
}

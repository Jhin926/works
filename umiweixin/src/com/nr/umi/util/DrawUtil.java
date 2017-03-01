package com.nr.umi.util;

import java.util.Random;

public class DrawUtil {
	public static String draw() {
		//根据配置文件中的中奖概率，算出各中奖等级的区间
		double level0 = Double.parseDouble(ConfigurationUtil
				.getValue("level0"));
		double level1 = Double.parseDouble(ConfigurationUtil
				.getValue("level1")) + level0;
		double level2 = Double.parseDouble(ConfigurationUtil
				.getValue("level2")) + level1;
		double level3 = Double.parseDouble(ConfigurationUtil
				.getValue("level3")) + level2;
		double level4 = Double.parseDouble(ConfigurationUtil
				.getValue("level4")) + level3;
		double level5 = Double.parseDouble(ConfigurationUtil
				.getValue("level5")) + level4;
		double level6 = Double.parseDouble(ConfigurationUtil
				.getValue("level6")) + level5;
		double level7 = Double.parseDouble(ConfigurationUtil
				.getValue("level7")) + level6;
		double level8 = Double.parseDouble(ConfigurationUtil
				.getValue("level8")) + level7;
		//生成一个0-1之间的随机数，根据中奖区间得出等级
		String result = "";
		Random r = new Random();
		// System.out.println(random);
		double random = r.nextDouble();
		if (random <= level0) {
			result = "0";
		} else if (random > level0 && random <= level1) {
			result = "1";
		} else if (random > level1 && random <= level2) {
			result = "2";
		} else if (random > level2 && random <= level3) {
			result = "3";
		} else if (random > level3 && random <= level4) {
			result = "4";
		} else if (random > level4 && random <= level5) {
			result = "5";
		} else if (random > level5 && random <= level6) {
			result = "6";
		} else if (random > level6 && random <= level7) {
			result = "7";
		} else if (random > level7 && random <= level8) {
			result = "8";
		}
		//根据等级查出对应等级还剩几个名额
		String level = "level" + result + "_count";
		int count = Integer.parseInt(ConfigurationUtil.getValue(level));
		//如果名额大于0，名额减一，直接返回中奖等级
		if(count > 0) {
			count = count - 1;
			ConfigurationUtil.setValue(level,count + "");
			return result;
		}else {
			//如果名额为0，先查其他各个等级的名额剩余数
			int count0 = Integer.parseInt(ConfigurationUtil.getValue("level0_count"));
			int count1 = Integer.parseInt(ConfigurationUtil.getValue("level1_count"));
			int count2 = Integer.parseInt(ConfigurationUtil.getValue("level2_count"));
			int count3 = Integer.parseInt(ConfigurationUtil.getValue("level3_count"));
			int count4 = Integer.parseInt(ConfigurationUtil.getValue("level4_count"));
			int count5 = Integer.parseInt(ConfigurationUtil.getValue("level5_count"));
			int count6 = Integer.parseInt(ConfigurationUtil.getValue("level6_count"));
			int count7 = Integer.parseInt(ConfigurationUtil.getValue("level7_count"));
			int count8 = Integer.parseInt(ConfigurationUtil.getValue("level8_count"));
			//如果所有的等级剩余数都为0，那么将所有等级的剩余数置为默认数量
			if(count0 == 0 && count1 == 0 && count2 == 0 && count3 == 0 && count4 == 0 && count5 == 0 && count6 == 0 && count7 == 0 && count8 == 0) {
				ConfigurationUtil.setValue("level0_count",ConfigurationUtil.getValue("defult_level0"));
				ConfigurationUtil.setValue("level1_count",ConfigurationUtil.getValue("defult_level1"));
				ConfigurationUtil.setValue("level2_count",ConfigurationUtil.getValue("defult_level2"));
				ConfigurationUtil.setValue("level3_count",ConfigurationUtil.getValue("defult_level3"));
				ConfigurationUtil.setValue("level4_count",ConfigurationUtil.getValue("defult_level4"));
				ConfigurationUtil.setValue("level5_count",ConfigurationUtil.getValue("defult_level5"));
				ConfigurationUtil.setValue("level6_count",ConfigurationUtil.getValue("defult_level6"));
				ConfigurationUtil.setValue("level7_count",ConfigurationUtil.getValue("defult_level7"));
				ConfigurationUtil.setValue("level8_count",ConfigurationUtil.getValue("defult_level8"));
			}
			//重新抽奖
			return draw();
		}
	}
}

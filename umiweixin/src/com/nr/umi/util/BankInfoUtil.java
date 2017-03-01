package com.nr.umi.util;

import java.util.List;

import com.nr.umi.bean.BankInfo;

public class BankInfoUtil {

	public static void setBankCardInfo(List<BankInfo> banks) {
		/*
		 * 该遍历是为了将银行信息表中的一个字段信息拆分到两个属性中,并通过这种方式来为目前现有的银行写死其图标.
		 * 目前该bi只有一个元素，防止以后扩展功能,暂时就这样放着,不影响
		 */
		for (BankInfo bi : banks) {
			switch (bi.getBankCode()) {
			// 农业银行
			case "ABC": {
				bi.setBankPic("bk-ny.png");
				bi.setBank(CutStringUtil.getPreStringByCh(bi.getBankName(), '('));
				bi.setTailNum(CutStringUtil.getSufStringByCh(bi.getBankName(), '('));
				break;
			}
				// 中国银行
			case "BOC": {
				bi.setBankPic("bk-zg.png");
				bi.setBank(CutStringUtil.getPreStringByCh(bi.getBankName(), '('));
				bi.setTailNum(CutStringUtil.getSufStringByCh(bi.getBankName(), '('));
				break;
			}
				// 建设银行
			case "CCB": {
				bi.setBankPic("bk-js.png");
				bi.setBank(CutStringUtil.getPreStringByCh(bi.getBankName(), '('));
				bi.setTailNum(CutStringUtil.getSufStringByCh(bi.getBankName(), '('));
				break;
			}
				// 光大银行
			case "CEB": {
				bi.setBankPic("bk-gd.png");
				bi.setBank(CutStringUtil.getPreStringByCh(bi.getBankName(), '('));
				bi.setTailNum(CutStringUtil.getSufStringByCh(bi.getBankName(), '('));
				break;
			}
				// 兴业银行
			case "CIB": {
				bi.setBankPic("bk-xy.png");
				bi.setBank(CutStringUtil.getPreStringByCh(bi.getBankName(), '('));
				bi.setTailNum(CutStringUtil.getSufStringByCh(bi.getBankName(), '('));
				break;
			}
				// 中信银行
			case "CITIC": {
				bi.setBankPic("bk-zx.png");
				bi.setBank(CutStringUtil.getPreStringByCh(bi.getBankName(), '('));
				bi.setTailNum(CutStringUtil.getSufStringByCh(bi.getBankName(), '('));
				break;
			}
				// 招商银行
			case "CMB": {
				bi.setBankPic("bk-zs.png");
				bi.setBank(CutStringUtil.getPreStringByCh(bi.getBankName(), '('));
				bi.setTailNum(CutStringUtil.getSufStringByCh(bi.getBankName(), '('));
				break;
			}
				// 民生银行
			case "CMBC": {
				bi.setBankPic("bk-ms.png");
				bi.setBank(CutStringUtil.getPreStringByCh(bi.getBankName(), '('));
				bi.setTailNum(CutStringUtil.getSufStringByCh(bi.getBankName(), '('));
				break;
			}
				// 广东发展银行
			case "GDB": {
				bi.setBankPic("bk-gf.png");
				bi.setBank(CutStringUtil.getPreStringByCh(bi.getBankName(), '('));
				bi.setTailNum(CutStringUtil.getSufStringByCh(bi.getBankName(), '('));
				break;
			}
				// 工商银行
			case "ICBC": {
				bi.setBankPic("bk-gs.png");
				bi.setBank(CutStringUtil.getPreStringByCh(bi.getBankName(), '('));
				bi.setTailNum(CutStringUtil.getSufStringByCh(bi.getBankName(), '('));
				break;
			}
				// 中国邮政储蓄银行
			case "PSBC": {
				bi.setBankPic("bk-yc.png");
				bi.setBank(CutStringUtil.getPreStringByCh(bi.getBankName(), '('));
				bi.setTailNum(CutStringUtil.getSufStringByCh(bi.getBankName(), '('));
				break;
			}
				// 浦东发展银行
			case "SPDB": {
				bi.setBankPic("bk-pf.png");
				bi.setBank(CutStringUtil.getPreStringByCh(bi.getBankName(), '('));
				bi.setTailNum(CutStringUtil.getSufStringByCh(bi.getBankName(), '('));
				break;
			}
				// 平安银行
			case "SZPAB": {
				bi.setBankPic("bk-pa.png");
				bi.setBank(CutStringUtil.getPreStringByCh(bi.getBankName(), '('));
				bi.setTailNum(CutStringUtil.getSufStringByCh(bi.getBankName(), '('));
				break;
			}
			default:
				break;
			}
		}
	}
}

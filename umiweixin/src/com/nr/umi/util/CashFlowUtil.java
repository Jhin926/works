package com.nr.umi.util;

import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.nr.umi.bean.CashFlow;

import net.sf.json.JSONObject;

/**
 * 对数据库中的流水业务进行处理
 * 
 * @author yi.yuan
 *
 *         Established in 2015年9月29日
 */
public class CashFlowUtil {

	public static Map<String, List<JSONObject>> processResult(List<CashFlow> cashFlows) {
		Map<String, List<JSONObject>> map = new HashMap<>();
		List<JSONObject> list = null;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		JSONObject json = null;
		if (cashFlows == null || cashFlows.size() == 0) {
			return null;
		}
		Iterator<CashFlow> it = cashFlows.iterator();
		CashFlow cf = null;
		while (it.hasNext()) {
			cf = it.next();
			json = new JSONObject();

			if (cf.getCategoryID() == null || cf.getCategoryID() == 0) {
				if (cf.getAccountID() != null && !cf.getAccountID().isEmpty()) {
					if (cf.getAccountID().equals("200")) {
						if (cf.getDstAccountID() == null || cf.equals("")) {
							cf.setDstAccountID("400");
							cf.setDstAccountName("悠米活期");
						}
						cf.setCategoryID(1);
						cf.setCategoryName("投资");
					} else if (cf.getDstAccountID() != null && !cf.getDstAccountID().isEmpty()
							&& !cf.getDstAccountID().equals("0")) {
						if (cf.getDstAccountID().equals("200")) {
							cf.setCategoryID(2);
							cf.setCategoryName("提现");
						} else {
							cf.setCategoryID(3);
							cf.setCategoryName("转账");
						}
					}
				}
			}
			try {
				switch (cf.getCategoryID()) {
				case 1:
					json.put("actionDetails", "银行卡 → " + cf.getDstAccountName());
					break;
				case 2:
					json.put("actionDetails", cf.getAccountName() + " → 银行卡");
					break;
				case 3:
					json.put("actionDetails", cf.getAccountName() + " → " + cf.getDstAccountName());
					break;
				case 4:
					json.put("actionDetails", cf.getAccountName() + " → " + cf.getDstAccountName());
					break;
				case 6:
					json.put("actionDetails", "赠送体验金 " + cf.getAccountName());
					break;
				case 7:
					if (cf.getCategoryName() != null && "体验金结转".equals(cf.getCategoryName())) {
						json.put("actionDetails", cf.getAccountName() + " → " + cf.getDstAccountName());
						break;
					}
					json.put("actionDetails", cf.getAccountName() + " 体验金返还");
					break;
				default:
					break;
				}
				json.put("actionStr", cf.getCategoryName());
			} catch (Exception e) {
				it.remove();
				continue;
			}
			json.put("dealAmount", Math.abs(cf.getAmount()));
			json.put("cashflowId", cf.getId());

			String month = new SimpleDateFormat("yyyyMM").format(cf.getCreateTimestamp());
			if (!map.containsKey(month)) {
				list = new ArrayList<>();
			} else {
				list = map.get(month);
			}
			json.put("dateStr", sdf.format(cf.getCreateTimestamp()));
			json.put("status", cf.getStatus());

			list.add(json);
			map.put(month, list);
		}
		return map;
	}

	/**
	 * 获取流水详情时用到
	 */
	public static JSONObject processResult(CashFlow cashFlow) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		JSONObject json = new JSONObject();
		DecimalFormat df = new DecimalFormat("#0.00");
		json.put("dealAmount", df.format(Math.abs(cashFlow.getAmount())));
		json.put("cashflowId", cashFlow.getId());

		if (cashFlow.getCategoryID() == null) {
			if (cashFlow.getAccountID().equals("200")) {
				cashFlow.setCategoryID(1);
				cashFlow.setCategoryName("投资");
			} else if (cashFlow.getDstAccountID().equals("200")) {
				cashFlow.setCategoryID(2);
				cashFlow.setCategoryName("提现");
			}
		}

		switch (cashFlow.getCategoryID()) {
		case 1:
			if (cashFlow.getAccountName() != null && cashFlow.getAccountName().contains("_")) {
				String cashflowDsts[] = cashFlow.getAccountName().split("_");
				json.put("srcAccountPic", getBankPicByCode(cashflowDsts[0].trim()));
				json.put("srcAccountName", CutStringUtil.getPreStringByCh(cashflowDsts[1], '('));
				json.put("srcAccountTailStr", "(" + CutStringUtil.getSufStringByCh(cashflowDsts[1], '(') + ")");
			} else {
				json.put("srcAccountName", "bank.png");
				json.put("srcAccountPic", "银行卡");
				json.put("srcAccountTailStr", "");
			}
			json.put("dstAccountTailStr", "");
			json.put("dstAccountName", cashFlow.getDstAccountName());
			json.put("dstAccountPic", getAccountPicById(cashFlow.getDstAccountID()));
			json.put("actionType", 1);
			json.put("actionStr", "投资");
			break;
		case 2:
			if (cashFlow.getDstAccountName() != null && cashFlow.getDstAccountName().contains("_")) {
				String cashflowDsts[] = cashFlow.getDstAccountName().split("_");
				json.put("dstAccountPic", getBankPicByCode(cashflowDsts[0].trim()));
				json.put("dstAccountName", CutStringUtil.getPreStringByCh(cashflowDsts[1], '('));
				json.put("dstAccountTailStr", "(" + CutStringUtil.getSufStringByCh(cashflowDsts[1], '(') + ")");
			} else {
				json.put("dstAccountName", "bank.png");
				json.put("dstAccountPic", "银行卡");
				json.put("dstAccountTailStr", "");
			}
			// 设置理财账户,源账户
			json.put("srcAccountName", cashFlow.getAccountName());
			json.put("srcAccountPic", getAccountPicById(cashFlow.getAccountID()));
			json.put("srcAccountTailStr", "");
			json.put("actionType", 2);
			json.put("actionStr", "提现");
			break;
		case 3:
			json.put("srcAccountName", cashFlow.getAccountName());
			json.put("srcAccountPic", getAccountPicById(cashFlow.getAccountID()));
			json.put("srcAccountTailStr", "");

			json.put("dstAccountName", cashFlow.getDstAccountName());
			json.put("dstAccountPic", getAccountPicById(cashFlow.getDstAccountID()));
			json.put("dstAccountTailStr", "");

			json.put("actionType", 3);
			json.put("actionStr", "转账");
			break;
		case 4:
			if (cashFlow.getAccountID().equals("200")) {
				if (cashFlow.getAccountName() != null && cashFlow.getAccountName().contains("_")) {
					String cashflowDsts[] = cashFlow.getAccountName().split("_");
					json.put("srcAccountName", CutStringUtil.getPreStringByCh(cashflowDsts[1], '('));
					json.put("srcAccountPic", getBankPicByCode(cashflowDsts[0].trim()));
					json.put("srcAccountTailStr", "(" + CutStringUtil.getSufStringByCh(cashflowDsts[1], '(') + ")");
				} else {
					json.put("srcAccountName", "bank.png");
					json.put("srcAccountPic", "银行卡");
					json.put("srcAccountTailStr", "");
				}
			} else {
				json.put("srcAccountName", cashFlow.getAccountName());
				json.put("srcAccountPic", getAccountPicById(cashFlow.getAccountID()));
				json.put("srcAccountTailStr", "");
			}
			json.put("dstAccountName", cashFlow.getDstAccountName());
			json.put("dstAccountPic", getAccountPicById(cashFlow.getDstAccountID()));
			json.put("dstAccountTailStr", "");
			json.put("actionType", 4);
			json.put("actionStr", "话费充值");
			break;
		case 6:
			json.put("srcAccountName", cashFlow.getAccountName());
			json.put("srcAccountPic", getAccountPicById(cashFlow.getAccountID()));
			json.put("actionType", 6);
			json.put("actionStr", "体验金赠送");
			break;
		case 7:
			if (cashFlow.getCategoryName() != null && "体验金结转".equals(cashFlow.getCategoryName())) {
				json.put("srcAccountName", cashFlow.getAccountName());
				json.put("srcAccountPic", getAccountPicById(cashFlow.getAccountID()));
				json.put("srcAccountTailStr", "");

				json.put("dstAccountName", cashFlow.getDstAccountName());
				json.put("dstAccountPic", getAccountPicById(cashFlow.getDstAccountID()));
				json.put("dstAccountTailStr", "");

				json.put("actionType", 701);
				json.put("actionStr", "体验金结转");
				break;
			} else {
				json.put("srcAccountName", cashFlow.getAccountName());
				json.put("srcAccountPic", getAccountPicById(cashFlow.getAccountID()));
				json.put("actionType", 7);
				json.put("actionStr", "体验金返还");
			}
			break;
		default:
			break;
		}

		json.put("dateStr", sdf.format(cashFlow.getCreateTimestamp()));
		json.put("status", cashFlow.getStatus());
		switch (cashFlow.getStatus()) {
		case 0:
			json.put("statusText", "交易成功");
			break;
		case 1:
			json.put("statusText", "处理中");
			break;
		case 2:
			json.put("statusText", "交易失败");
			break;
		default:
			break;
		}
		return json;
	}

	/**
	 * 
	 * @param id
	 *            理财产品代号
	 * @return 理财产品的名称
	 */
	public static String getAccountNameById(String accountId) {
		if (accountId.startsWith("400")) {
			return "悠米活期";
		} else if (accountId.startsWith("100")) {
			return "悠米6天";
		} else if (accountId.startsWith("300")) {
			return "悠米30天";
		} else if (accountId.startsWith("700")) {
			return "悠米60天";
		} else if (accountId.startsWith("900")) {
			return "悠米90天";
		} else if (accountId.startsWith("800")) {
			return "悠米账户";
		} else if (accountId.startsWith("888")) {
			StringBuffer retName = new StringBuffer("悠米定制");
			if (accountId.length() > 9) {
				int timeLimit = 0;
				String temp = accountId.substring(9);
				if (temp != null && !temp.trim().equals("")) {
					timeLimit = Integer.parseInt(temp);
				}
				if (timeLimit > 6) {
					retName.append("-");
					retName.append(timeLimit);
					retName.append("天");
				}
			}
			return retName.toString();
		}
		return "银行卡";
	}

	/**
	 * 
	 * @param id
	 *            理财产品代号
	 * @return 理财产品的图标
	 */
	public static String getAccountPicById(String accountId) {
		// 悠米活期
		if (accountId.startsWith("400")) {
			return "index_09.png";
			// 悠米6天
		} else if (accountId.startsWith("100")) {
			return "index_12.png";
			// 银行卡
		} else if (accountId.startsWith("200")) {
			return "bank.png";
			// 悠米30天
		} else if (accountId.startsWith("300")) {
			return "index_15.png";
			// 话费
		} else if (accountId.startsWith("600")) {
			return "logo-bill.png";
			// 悠米60天
		} else if (accountId.startsWith("700")) {
			return "index_19.png";
			// 悠米90天
		} else if (accountId.startsWith("900")) {
			return "index_90.png";
			// 悠米定制
		} else if (accountId.startsWith("888")) {
			return "logo-custom.png";
		}
		return "logo-help.png";
	}

	/**
	 * 获取银行图标
	 */
	public static String getBankPicByCode(String code) {

		switch (code) {
		// 农业银行
		case "ABC": {
			return "bk-ny.png";
		}
			// 中国银行
		case "BOC": {
			return "bk-zg.png";
		}
			// 建设银行
		case "CCB": {
			return "bk-js.png";
		}
			// 光大银行
		case "CEB": {
			return "bk-gd.png";
		}
			// 兴业银行
		case "CIB": {
			return "bk-xy.png";
		}
			// 中信银行
		case "CITIC": {
			return "bk-zx.png";
		}
			// 招商银行
		case "CMB": {
			return "bk-zs.png";
		}
			// 民生银行
		case "CMBC": {
			return "bk-ms.png";
		}
			// 广东发展银行
		case "GDB": {
			return "bk-gf.png";
		}
			// 工商银行
		case "ICBC": {
			return "bk-gs.png";
		}
			// 中国邮政储蓄银行
		case "PSBC": {
			return "bk-yc.png";
		}
			// 浦东发展银行
		case "SPDB": {
			return "bk-pf.png";
		}
			// 平安银行
		case "SZPAB": {
			return "bk-pa.png";
		}
		default:
			return "bank.png";
		}
	}

}

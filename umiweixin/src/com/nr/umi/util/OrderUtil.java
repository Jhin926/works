package com.nr.umi.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import com.nr.umi.bean.CashFlow;
import com.nr.umi.bean.OrderDetail;
import com.nr.umi.beanVo.Detail;
import com.nr.umi.service.UmiService;

import net.sf.json.JSONArray;

/**
 * 订单详情处理类
 * 
 * @author tzhang
 * @author update By yi.yuan
 * 
 */
public class OrderUtil {
	/**
	 * 根据流水查询流水详情信息
	 * 
	 * @param service
	 * @param cash
	 * @return
	 */
	public static String getDetail(UmiService service, CashFlow cash) {
		int orderID = cash.getOrderID();
		/*
		 * accID用来记录转入账户的id
		 */
		String accID = cash.getAccountID();
		if (cash.getAmount() < 0) {
			accID = cash.getDstAccountID();
		}
		// 流水详情信息
		OrderDetail order = service.getOrderDetail(orderID);
		int step = order.getStep();
		Date comTime = order.getComTime();
		Date createTime = order.getCreateTime();
		int type = order.getType();
		String dateFormat1 = "MM-dd HH:mm";
		String dateFormat2 = "MM-dd";
		String dateFormat3 = "yyyy-MM-dd HH:mm";
		String dateFormat4 = "yyyy-MM-dd";
		// 两种时间格式
		SimpleDateFormat sdf = new SimpleDateFormat(dateFormat1);
		SimpleDateFormat sd = new SimpleDateFormat(dateFormat2);
		SimpleDateFormat idFormat = new SimpleDateFormat("yyMMdd");
		
		List<Detail> list = new ArrayList<Detail>();
		Detail d0 = new Detail();
		Detail d1 = new Detail();
		Detail d2 = new Detail();
		Detail d3 = new Detail();
		String time1 = null;
		String time2 = null;
		String time3 = null;
		d0.setName("交易处理");
		d0.setTime(sdf.format(createTime));
		d0.setDateFormat(dateFormat1);
		list.add(d0);

		Calendar calender = Calendar.getInstance();
		if (comTime == null) {
			calender.setTime(new Date());
		} else {
			calender.setTime(comTime);
		}
		switch (type) {
		case 1:
			d1.setName("交易成功");
			d2.setName("开始计息");
			d2.setDateFormat(dateFormat2);
			switch (step) {
			case 1:
				d1.setDateFormat(dateFormat2);
				d1.setTime("预计" + sd.format(calender.getTime()));
				calender.add(Calendar.DAY_OF_YEAR, 1);
				d2.setTime("预计" + sd.format(calender.getTime()));
				break;
			case 2:
				d1.setDateFormat(dateFormat1);
				d1.setTime(sdf.format(calender.getTime()));
				// 如果每天三点(03:00:00)之后买入的悠米活期(新浪理财产品),第三天开始计息
				/*String todayStr = new SimpleDateFormat("yyyyMMdd")
						.format(new Date()) + " 15:00:00";
				try {
					Date today = new SimpleDateFormat("yyyyMMdd HH:mm:ss")
							.parse(todayStr);
					if (today.getTime() < comTime.getTime()) {
						calender.add(Calendar.DAY_OF_YEAR, 1);
					}
				} catch (ParseException e) {
					e.printStackTrace();
				}
				// 如果是周五三点之前买入的悠米活期(新浪理财产品),下周一开始计息,如果是周五三点(加一天之后变成周六)之后买入的,下周二开始计息
				if (calender.get(Calendar.DAY_OF_WEEK) == Calendar.FRIDAY
						|| calender.get(Calendar.DAY_OF_WEEK) == Calendar.SATURDAY) {
					calender.add(Calendar.DAY_OF_YEAR, 2);
				}*/
				calender.add(Calendar.DAY_OF_YEAR, 1);
				d2.setTime("预计" + sd.format(calender.getTime()));
				break;
			case 3:
				d1.setDateFormat(dateFormat1);
				d1.setTime(sdf.format(calender.getTime()));
				calender.add(Calendar.DAY_OF_YEAR, 1);
				d2.setTime(sd.format(calender.getTime()));
				break;
			}
			list.add(d1);
			list.add(d2);
			break;
		case 2:
			d1.setName("交易失败");
			d1.setTime(sdf.format(comTime));
			d1.setDateFormat(dateFormat1);
			list.add(d1);
			break;
		case 3:
			d1.setName("交易成功");
			d2.setName("开始计息");
			d3.setName("到期");
			d2.setDateFormat(dateFormat2);
			d3.setDateFormat(dateFormat2);
			switch (step) {
			case 1:
				d1.setDateFormat(dateFormat2);
				// 如果是理财账户，算出计息时间和到期时间，未完成账户加上预计二字
				if (accID.startsWith("1")) {
					time1 = "预计" + sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time2 = "预计" + sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 6);
					time3 = "预计" + sd.format(calender.getTime());
				} else if (accID.startsWith("3")) {
					time1 = "预计" + sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time2 = "预计" + sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 30);
					time3 = "预计" + sd.format(calender.getTime());
				} else if (accID.startsWith("7")) {
					time1 = "预计" + sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time2 = "预计" + sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 60);
					time3 = "预计" + sd.format(calender.getTime());
				} else if (accID.startsWith("9")) {
					time1 = "预计" + sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time2 = "预计" + sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 90);
					time3 = "预计" + sd.format(calender.getTime());
				} else if (accID.startsWith("888")) {
					int days = 0;
					time1 = "预计" + sd.format(calender.getTime());
					if(accID.length() >= 12) {
						days = Integer.parseInt(accID.substring(9));
						try {
							comTime = idFormat.parse(accID.substring(3,9));
							calender.setTime(comTime);
						} catch (ParseException e) {
							e.printStackTrace();
						}
					}
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time2 = "预计" + sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, days);
					time3 = "预计" + sd.format(calender.getTime());
				}
				break;
			case 2:
				d1.setDateFormat(dateFormat1);
				// 如果是理财账户，算出计息时间和到期时间，未完成账户加上预计二字
				if (accID.startsWith("1")) {
					time1 = sdf.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time2 = "预计" + sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 6);
					time3 = "预计" + sd.format(calender.getTime());
				} else if (accID.startsWith("3")) {
					time1 = sdf.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time2 = "预计" + sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 30);
					time3 = "预计" + sd.format(calender.getTime());
				} else if (accID.startsWith("7")) {
					time1 = sdf.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time2 = "预计" + sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 60);
					time3 = "预计" + sd.format(calender.getTime());
				} else if (accID.startsWith("9")) {
					time1 = sdf.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time2 = "预计" + sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 90);
					time3 = "预计" + sd.format(calender.getTime());
				} else if (accID.startsWith("888")) {
					int days = 0;
					time1 = sdf.format(calender.getTime());
					if(accID.length() >= 12) {
						days = Integer.parseInt(accID.substring(9));
						try {
							comTime = idFormat.parse(accID.substring(3,9));
							calender.setTime(comTime);
						} catch (ParseException e) {
							e.printStackTrace();
						}
					}
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time2 = "预计" + sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, days);
					time3 = "预计" + sd.format(calender.getTime());
				}
				break;
			case 3:
				d1.setDateFormat(dateFormat1);
				// 如果是理财账户，算出计息时间和到期时间，未完成账户加上预计二字
				if (accID.startsWith("1")) {
					time1 = sdf.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time2 = sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 6);
					time3 = "预计" + sd.format(calender.getTime());
				} else if (accID.startsWith("3")) {
					time1 = sdf.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time2 = sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 30);
					time3 = "预计" + sd.format(calender.getTime());
				} else if (accID.startsWith("7")) {
					time1 = sdf.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time2 = sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 60);
					time3 = "预计" + sd.format(calender.getTime());
				} else if (accID.startsWith("9")) {
					time1 = sdf.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time2 = sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 90);
					time3 = "预计" + sd.format(calender.getTime());
				} else if (accID.startsWith("888")) {
					int days = 0;
					time1 = sdf.format(calender.getTime());
					if(accID.length() >= 12) {
						days = Integer.parseInt(accID.substring(9));
						try {
							comTime = idFormat.parse(accID.substring(3,9));
							calender.setTime(comTime);
						} catch (ParseException e) {
							e.printStackTrace();
						}
					}
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time2 = sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, days);
					time3 = "预计" + sd.format(calender.getTime());
				}
				break;
			case 4:
				d1.setDateFormat(dateFormat1);
				// 如果是理财账户，算出计息时间和到期时间，未完成账户加上预计二字
				if (accID.startsWith("1")) {
					time1 = sdf.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time2 = sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 6);
					time3 = sd.format(calender.getTime());
				} else if (accID.startsWith("3")) {
					time1 = sdf.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time2 = sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 30);
					time3 = sd.format(calender.getTime());
				} else if (accID.startsWith("7")) {
					time1 = sdf.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time2 = sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 60);
					time3 = sd.format(calender.getTime());
				} else if (accID.startsWith("9")) {
					time1 = sdf.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time2 = sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 90);
					time3 = sd.format(calender.getTime());
				} else if (accID.startsWith("888")) {
					int days = 0;
					time1 = sdf.format(calender.getTime());
					if(accID.length() >= 12) {
						days = Integer.parseInt(accID.substring(9));
						try {
							comTime = idFormat.parse(accID.substring(3,9));
							calender.setTime(comTime);
						} catch (ParseException e) {
							e.printStackTrace();
						}
					}
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time2 = sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, days);
					time3 = sd.format(calender.getTime());
				}
				break;
			}

			d1.setTime(time1);
			d2.setTime(time2);
			d3.setTime(time3);
			list.add(d1);
			list.add(d2);
			list.add(d3);
			break;
		case 4:
			d1.setName("交易成功");
			d2.setName("到账");
			d1.setDateFormat(dateFormat1);
			if (accID.equals("600")) {
				if (comTime == null) {
					d2.setDateFormat(dateFormat1);
					d1.setTime("预计" + sd.format(calender.getTime()));
					d2.setTime("预计" + sd.format(calender.getTime()));
				} else if (step == 2) {
					d2.setDateFormat(dateFormat2);
					d1.setTime(sdf.format(calender.getTime()));
					d2.setTime("预计" + sd.format(calender.getTime()));
				} else if (step == 3) {
					d2.setDateFormat(dateFormat2);
					d1.setTime(sdf.format(calender.getTime()));
					d2.setTime(sd.format(calender.getTime()));
				}
			} else {
				String todayStr = new SimpleDateFormat("yyyyMMdd").format(new Date()) + " 15:00:00";
				try {
					Date today = new SimpleDateFormat("yyyyMMdd HH:mm:ss").parse(todayStr);
					if (today.getTime() < createTime.getTime()) {
						calender.add(Calendar.DAY_OF_YEAR, 1);
					}
					calender.add(Calendar.DAY_OF_YEAR, 1);
				} catch (ParseException e) {
					e.printStackTrace();
				}
				// calender = ProfitDate.getIncomeDate(calender, service);
				if (step == 1) {
					d2.setDateFormat(dateFormat1);
					d1.setTime("预计" + sd.format(new Date()));
					d2.setTime("预计" + sd.format(calender.getTime()));
				} else if (step == 2) {
					d2.setDateFormat(dateFormat2);
					if (comTime == null) {
						d1.setTime(sdf.format(new Date()));
					} else {
						d1.setTime(sdf.format(comTime));
					}
					d2.setTime("预计" + sd.format(calender.getTime()));
				} else if (step == 3) {
					d2.setDateFormat(dateFormat2);
					d1.setTime(sdf.format(comTime));
					d2.setTime(sd.format(calender.getTime()));
				}
			}
			list.add(d1);
			list.add(d2);
			break;
		case 5:
			d0.setName("体验金赠送");
			d1.setName("开始计息");
			d2.setName("体验金返还");
			d1.setDateFormat(dateFormat2);
			d2.setDateFormat(dateFormat2);
			calender.setTime(createTime);
			switch (step) {
			case 1:
				if (accID.startsWith("1")) {
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time1 = "预计" + sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 6);
					time2 = "预计" + sd.format(calender.getTime());
				} else if (accID.startsWith("3")) {
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time1 = "预计" + sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 30);
					time2 = "预计" + sd.format(calender.getTime());
				} else if (accID.startsWith("7")) {
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time1 = "预计" + sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 60);
					time2 = "预计" + sd.format(calender.getTime());
				} else if (accID.startsWith("9")) {
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time1 = "预计" + sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 90);
					time2 = "预计" + sd.format(calender.getTime());
				} else if (accID.startsWith("888")) {
					int days = 0;
					if (accID.length() >= 12) {
						days = Integer.parseInt(accID.substring(9));
					}
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time1 = "预计" + sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, days);
					time2 = "预计" + sd.format(calender.getTime());
				}
				break;
			case 2:
				if (accID.startsWith("1")) {
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time1 = sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 6);
					time2 = "预计" + sd.format(calender.getTime());
				} else if (accID.startsWith("3")) {
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time1 = sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 30);
					time2 = "预计" + sd.format(calender.getTime());
				} else if (accID.startsWith("7")) {
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time1 = sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 60);
					time2 = "预计" + sd.format(calender.getTime());
				} else if (accID.startsWith("9")) {
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time1 = sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 90);
					time2 = "预计" + sd.format(calender.getTime());
				} else if (accID.startsWith("888")) {
					int days = 0;
					if (accID.length() >= 12) {
						days = Integer.parseInt(accID.substring(9));
					}
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time1 = sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, days);
					time2 = "预计" + sd.format(calender.getTime());
				}
				break;
			case 3:
				if (accID.startsWith("1")) {
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time1 = sdf.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 6);
					time2 = sd.format(calender.getTime());
				} else if (accID.startsWith("3")) {
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time1 = sdf.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 30);
					time2 = sd.format(calender.getTime());
				} else if (accID.startsWith("7")) {
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time1 = sdf.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 60);
					time2 = sd.format(calender.getTime());
				} else if (accID.startsWith("9")) {
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time1 = sdf.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, 90);
					time2 = sd.format(calender.getTime());
				} else if (accID.startsWith("888")) {
					int days = 0;
					if (accID.length() >= 12) {
						days = Integer.parseInt(accID.substring(9));
					}
					calender.add(Calendar.DAY_OF_YEAR, 1);
					time1 = sd.format(calender.getTime());
					calender.add(Calendar.DAY_OF_YEAR, days);
					time2 = sd.format(calender.getTime());
				}
				break;
			}
			d1.setTime(time1);
			d2.setTime(time2);
			list.add(d1);
			list.add(d2);
			break;
		}
		
		for(Detail detail : list) {
			String dateStr = detail.getTime();
			long timeMillis = 0;
			boolean isCom = true;
			SimpleDateFormat timeWithYear = new SimpleDateFormat(dateFormat3);
			SimpleDateFormat dateWithYear = new SimpleDateFormat(dateFormat4);
			try {
				if(dateStr.startsWith("预计")) {
					dateStr = dateStr.split("预计")[1];
					
					timeMillis = dateWithYear.parse(calender.get(Calendar.YEAR) + "-" + dateStr).getTime();
					isCom = false;
				} else {
					if(dateStr.length() == 11) {
						timeMillis = timeWithYear.parse(calender.get(Calendar.YEAR) + "-" + dateStr).getTime();
					}else if(dateStr.length() == 5) {
						timeMillis = dateWithYear.parse(calender.get(Calendar.YEAR) + "-" + dateStr).getTime();
					}
				}
			} catch (ParseException e) {
				e.printStackTrace();
			}
			detail.setTimeMillis(timeMillis);
			detail.setIsCom(isCom);
		}
		JSONArray array = JSONArray.fromObject(list);
		return array.toString();
	}
	
	/**
	 * 流水详情状态更新
	 * 
	 * @param cash
	 *            流水信息
	 * @param order
	 *            流水详情信息
	 * @return
	 */
	public static OrderDetail orderStep(CashFlow cash, OrderDetail order) {

		String accID = cash.getAccountID();
		if (cash.getAmount() < 0) {
			accID = cash.getDstAccountID();
		}
		Date comTime = order.getComTime();
		int step = order.getStep();
		int type = order.getType();
		if (comTime == null) {
			return order;
		} else {
			if (step == 1) {
				if(type != 4) {
					if(type != 5) {
						order.setStep(2);
					}else {
						Calendar calender = Calendar.getInstance();
						calender.setTime(comTime);
						int com = calender.get(Calendar.DAY_OF_YEAR);
						calender.setTime(new Date());
						int today = calender.get(Calendar.DAY_OF_YEAR);
						if(today - com > 1) {
							order.setStep(2);
						}
						if (accID.startsWith("1")) {
							if (today - com >= 1) {
								order.setStep(3);
							}
						} else if (accID.startsWith("3")) {
							 if (today - com >= 31) {
								order.setStep(3);
							}
						} else if (accID.startsWith("7")) {
							if (today - com >= 61) {
								order.setStep(3);
							}
						} else if (accID.startsWith("9")) {
							if (today - com >= 91) {
								order.setStep(3);
							}
						} else if(accID.startsWith("888")) {
							int days = Integer.parseInt(accID.substring(9));
							if (today - com > days) {
								order.setStep(3);
							}
						} else if (accID.startsWith("400")) {
							if (today - com > 0) {
								order.setStep(3);
							}
						}
					}
				}
			} else {
				Calendar calender = Calendar.getInstance();
				calender.setTime(new Date());
				int today = calender.get(Calendar.DAY_OF_YEAR);
				calender.setTime(comTime);
				int com = calender.get(Calendar.DAY_OF_YEAR);
				if (type == 5) {
					/*if (accID.startsWith("1")) {
						if (today - com >= 7) {
							order.setStep(3);
						}
					} else 
					if (accID.startsWith("3")) {
						 if (today - com >= 31) {
							order.setStep(3);
						}
					} else if (accID.startsWith("7")) {
						if (today - com >= 61) {
							order.setStep(3);
						}
					} else if (accID.startsWith("9")) {
						if (today - com >= 91) {
							order.setStep(3);
						}
					}  else */if(accID.startsWith("888")) {
						int days = Integer.parseInt(accID.substring(9));
						if (today - com > days) {
							order.setStep(3);
						}
					}
				}else if(type == 3){
					/*if (accID.startsWith("1")) {
						if (today - com > 0 && today - com < 7) {
							order.setStep(3);
						} else if (today - com >= 7) {
							order.setStep(4);
						}
					} else if (accID.startsWith("3")) {
						if (today - com > 0 && today - com < 31) {
							order.setStep(3);
						} else if (today - com >= 31) {
							order.setStep(4);
						}
					} else if (accID.startsWith("7")) {
						if (today - com > 0 && today - com < 61) {
							order.setStep(3);
						} else if (today - com >= 61) {
							order.setStep(4);
						}
					} else if (accID.startsWith("9")) {
						if (today - com > 0 && today - com < 91) {
							order.setStep(3);
						} else if (today - com >= 91) {
							order.setStep(4);
						}
					}else */if (accID.startsWith("888")) {
						int days = 0;
						if(accID.length() >= 12) {
							days = Integer.parseInt(accID.substring(9));
						}
						if (today - com > 0 && today - com < days + 1) {
							order.setStep(3);
						} else if (today - com >= days + 1) {
							order.setStep(4);
						}
					}
				} else if (type == 4){
					if (accID.startsWith("6")) {
						if (new Date().getTime() - comTime.getTime() > 10 * 60 * 1000) {
							order.setStep(3);
						}
					}else if (accID.startsWith("2")) {
						SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
						SimpleDateFormat sd = new SimpleDateFormat("yyyyMMdd HH:mm:ss");
						String todayStr = sdf.format(comTime) + " 15:00:00";
						try {
							Date todayTime = sd.parse(todayStr);
							if (todayTime.getTime() < comTime.getTime()) {
								calender.add(Calendar.DAY_OF_YEAR, 1);
							}
							calender.add(Calendar.DAY_OF_YEAR, 1);
						} catch (ParseException e) {
							// TODO Auto-generated catch block
							e.printStackTrace();
						}
						try {
							Date comDate = sd.parse(sdf.format(calender.getTime()) + " 09:00:00");
							if (new Date().getTime()  > comDate.getTime()) {
								order.setStep(3);
							}
						} catch (ParseException e) {
							e.printStackTrace();
						}
					}
				}else if(type == 1) {
					Calendar calender1 = Calendar.getInstance();
					calender1.setTime(comTime);
//					SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
					// 如果每天三点半(03:00:00)之后买入的悠米活期(新浪理财产品),第三天开始计息
					/*SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
					String todayStr = sdf.format(comTime) + " 15:00:00";
					try {
						Date todayTime = new SimpleDateFormat("yyyyMMdd HH:mm:ss")
								.parse(todayStr);
						if (todayTime.getTime() < comTime.getTime()) {
							calender1.add(Calendar.DAY_OF_YEAR, 1);
						}
					} catch (ParseException e) {
						e.printStackTrace();
					}
					// 如果是周五三点半之前买入的悠米活期(新浪理财产品),下周一开始计息,如果是周五三点半(加一天之后变成周六)之后买入的,下周二开始计息
					if (calender1.get(Calendar.DAY_OF_WEEK) == Calendar.FRIDAY
							|| calender1.get(Calendar.DAY_OF_WEEK) == Calendar.SATURDAY) {
						calender1.add(Calendar.DAY_OF_YEAR, 2);
					}
					calender1.add(Calendar.DAY_OF_YEAR, 2);*/
					Calendar cal = Calendar.getInstance();
					cal.setTime(new Date());
					if(cal.get(Calendar.DATE) - calender1.get(Calendar.DATE) > 0) {
						order.setStep(3);
					}
				}
			}
		}
		return order;
	}
}

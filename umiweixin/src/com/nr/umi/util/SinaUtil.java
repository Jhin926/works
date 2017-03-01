package com.nr.umi.util;

import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.nr.umi.action.UserAction;
import com.nr.umi.bean.ApiRequest;
import com.nr.umi.bean.BankInfo;
import com.nr.umi.bean.UMIUser;
import com.nr.umi.bean.UserBank;
import com.nr.umi.service.UmiService;
import com.nr.umi.util.securityTool.Base64;
import com.nr.umi.util.securityTool.CallServiceUtil;
import com.nr.umi.util.securityTool.GsonUtil;
import com.nr.umi.util.securityTool.RSA;
import com.nr.umi.util.securityTool.SignUtil;
import com.nr.umi.util.securityTool.Tools;

import net.sf.json.JSONObject;

/**
 * 
 * 新浪请求的各种方法调用
 * 
 * @author tzhang
 * @author yi.yuan,update
 *
 */
public class SinaUtil {
	static String privateKeyRSA = "MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAA"
			+ "oGBANAlLhkTjPp7490BYwKAjRXYxTEgbzOzae0i3vhwwjdlNddhIjCYHgcKFxTOC/k"
			+ "Er4JtkkVrZoJvE0SkFxR7AKTAm93WLRpoxD10jHHkHuNij5YCf0dysZZdoS3W3YQ6+"
			+ "7mq8W6jfTEKhAvNARtpjZ8Lsp6L9e6O/mR6LALtLyg/AgMBAAECgYBZAd0xmfuqTXp"
			+ "GUsZ9Fm2+juDcPitvZ2R/pG7GvKlAuQYKIR5Wu2XzyqvOGMJj7U4EL0jiaKgAVPFfY"
			+ "+/+sQ63n35rJe55S5tkiYOmc2pTy/g9OAVgWXeNjGfIezA4fdNxg2lfLG3p+y7iiUKL"
			+ "Zh19MqPJe2uTZY5QvrRgbOF9oQJBAPKloYGAGoSvw2zck72BdvhIqIzyU1PpwV+iYR5"
			+ "mC7iPfQmyqPvfaZrwaYjJcese+KRC5vdZvjYegX3gOVqKkTECQQDbmX6LhiNzm3V2qa"
			+ "pm8+GqW04szje37Lxt6R/Dr9Nc3uIkkRRcdIg5CzNVVcqcOwuULaULV6l425cx2ggiU"
			+ "HRvAkAIGdeGh0xbWbLgk4yrKwNZzrMx4XU+u/MkyjsL1MRXaRL3m+tgXVkdPyGG25Le"
			+ "Eq6ibUlgwLJFBEe2eCHyD+ZBAkEApqoBM81TXKtQ5AVy0X4o+A0h8Ll16j5e6B/1PqRU"
			+ "CvkRsuT1ChJbTMfmZs6c3iOl7wkRaOFYOuSWBHzQjZJ4OwJBANRuvTMogyckZOIgLdN2"
			+ "HpAoj/AVBArMiNe0f/UvoOhgOxSXtXoCpk7dDnaU5j8mjC0FwBJGr4TWvKtoi0Z03Oo=";
	// 联调环境私钥
	// static String privateKeyRSA =
	// "MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAO/6rPCvyCC+IMalLzTy3cVBz/+wamCFNiq9qKEilEBDTttP7Rd/GAS51lsfCrsISbg5td/w25+wulDfuMbjjlW9Afh0p7Jscmbo1skqIOIUPYfVQEL687B0EmJufMlljfu52b2efVAyWZF9QBG1vx/AJz1EVyfskMaYVqPiTesZAgMBAAECgYEAtVnkk0bjoArOTg/KquLWQRlJDFrPKP3CP25wHsU4749t6kJuU5FSH1Ao81d0Dn9m5neGQCOOdRFi23cV9gdFKYMhwPE6+nTAloxI3vb8K9NNMe0zcFksva9c9bUaMGH2p40szMoOpO6TrSHO9Hx4GJ6UfsUUqkFFlN76XprwE+ECQQD9rXwfbr9GKh9QMNvnwo9xxyVl4kI88iq0X6G4qVXo1Tv6/DBDJNkX1mbXKFYL5NOW1waZzR+Z/XcKWAmUT8J9AkEA8i0WT/ieNsF3IuFvrIYG4WUadbUqObcYP4Y7Vt836zggRbu0qvYiqAv92Leruaq3ZN1khxp6gZKl/OJHXc5xzQJACqr1AU1i9cxnrLOhS8m+xoYdaH9vUajNavBqmJ1mY3g0IYXhcbFm/72gbYPgundQ/pLkUCt0HMGv89tn67i+8QJBALV6UgkVnsIbkkKCOyRGv2syT3S7kOv1J+eamGcOGSJcSdrXwZiHoArcCZrYcIhOxOWB/m47ymfE1Dw/+QjzxlUCQCmnGFUO9zN862mKYjEkjDN65n1IUB9Fmc1msHkIZAQaQknmxmCIOHC75u4W0PGRyVzq8KkxpNBq62ICl7xmsPM=";

	static String publicKeyRSA = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCxVliFlghSFXhMJFT5o8X3XdJvtyerObSNnSOBkdKTrzjZvygDXlF4xqLWQUPqVPgfwUSMijFfxhIHX69cBYOC7dCfoSYzwNE7WqqRNBygNZ7YT1dzJyAeol3xRdQzvmxTYDTNVnmsyzx/fnWnKixwJRb2CRIdfrMIfbPxeXDfIQIDAQAB";

	// 联调环境公钥
	// static String publicKeyRSA =
	// "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDv0rdsn5FYPn0EjsCPqDyIsYRawNWGJDRHJBcdCldodjM5bpve+XYb4Rgm36F6iDjxDbEQbp/HhVPj0XgGlCRKpbluyJJt8ga5qkqIhWoOd/Cma1fCtviMUep21hIlg1ZFcWKgHQoGoNX7xMT8/0bEsldaKdwxOlv3qGxWfqNV5QIDAQAB";

	// 加密key
	static String encrypt = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDAMHj8072AQjDkJx83LLVjmNdDBKT7k5IUWLFOpaAJSCRfu4JpHw09Oc2pwpgC1hum0htvI4ZJ5DI8EZPqaQkolclB0mY8i6qECmKtqjgzAynvdK7RHV0GETGshbYIwfT590ES2U9E1XFOam6cs8hIq9L4c7KMnj3c1pn5UuMbRQIDAQAB";
	// 新浪接口url
	static String url1 = "https://gate.pay.sina.com.cn/mas/gateway.do";// 生产环境
	// String url = "https://testgate.pay.sina.com.cn/m1s/gateway.do";//联调环境
	static String url2 = "https://gate.pay.sina.com.cn/mgs/gateway.do";// 生产环境，资金流动相关
	// String url = "https://testgate.pay.sina.com.cn/mgs/gateway.do";//联调环境，资金流动相关

	/**
	 * 新浪通信
	 * @param method 主要调用方法
	 * @param params 基本参数
	 * @param user 用户
	 * @param service
	 * @return
	 */
	public static String SinaRequest(String method, Map<String, String> params, UMIUser user, UmiService service,
			String url) {
		// 基础非空判断
		if (method == null || "".equals(method)) {
			// return "{\"errcode\":\"10001\",\"msg\":\"业务接口名称为空！\"}";
			return "{\"response_code\":\"10001\",\"response_message\":\"业务接口名称为空！\"}";
		}

		// 主要参数
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		String sign_type = "RSA";
		String _input_charset = "UTF-8";

		params.put("service", method);// 服务名称
		params.put("version", "1.0");// 接口版本
		params.put("request_time", sdf.format(new Date()));// 请求时间
		// params.put("partner_id", "200004227922");// 合作伙伴ID,联调环境
		params.put("partner_id", "200007747966");// 合作伙伴ID
		params.put("_input_charset", _input_charset);// 字符集编码

		String content = Tools.createLinkString(params, false);
		// 返回值
		String resp = null;
		String paramlist = null;

		// 生成签名
		try {
			String sign = SignUtil.sign(content, sign_type, privateKeyRSA, _input_charset);
			params.put("sign", sign);// 签名
			params.put("sign_type", sign_type);// 签名类型
			paramlist = Tools.createLinkString(params, true);
			resp = URLDecoder.decode(CallServiceUtil.sendPost(url, paramlist), _input_charset);

			// 插入新浪通讯记录
			ApiRequest ar = new ApiRequest();
			ar.setUser_id(user.getId());
			ar.setApi_type(1);
			ar.setApi_name(method);
			ar.setRequest(url + "?" + paramlist);
			ar.setResponse(resp);
			if (!resp.contains("APPLY_SUCCESS")) {
				ar.setIsError(1);
			}
			service.addOrUpdate(ar);

			Map<String, String> contents = GsonUtil.fronJson2Map(resp);
			String signKey = "";
			if ("RSA".equalsIgnoreCase(contents.get("sign_type").toString())) {
				signKey = publicKeyRSA;
			}

			String sign_result = contents.get("sign").toString();
			String sign_type_result = contents.get("sign_type").toString();
			String _input_charset_result = contents.get("_input_charset").toString();
			contents.remove("sign");
			contents.remove("sign_type");
			contents.remove("sign_version");
			String like_result = Tools.createLinkString(contents, false);

			if (!SignUtil.Check_sign(like_result.toString(), sign_result, sign_type_result, signKey,
					_input_charset_result)) {
				// return "{\"errcode\":\"10002\",\"msg\":\"签名异常！\"}";
				return "{\"response_code\":\"10002\",\"response_message\":\"签名异常！\"}";
			}
		} catch (Exception e) {
			e.printStackTrace();
			// return "{\"errcode\":\"10002\",\"msg\":\"签名异常！\"}";
			return "{\"response_code\":\"10002\",\"response_message\":\"签名异常！\"}";
		}

		return resp;
	}

	/**
	 * 充值接口
	 * 
	 * @param service
	 * @param user
	 * @param amount
	 * @return
	 */
	public static String createHostingDeposit(UmiService service, UMIUser user, double amount) {
		UMIUser umiUser = service.getUserByToken(user.getToken());
		if (umiUser == null) {
			return "{\"retcode\":\"2\",\"retmessage\":\"token无效\"}";
		}
		String servicename = "create_hosting_deposit";
		UserBank bank = service.queryVerifiedBankByUserId(user.getId());
		String notify_url = "http://121.41.112.104:8080/UMIbank/rs/users/receive";// 测试服务器
		// String notify_url = "http://120.26.79.84:8080/UMIbank/rs/users/receive";// 生产服务器
		String account_type = "SAVING_POT";
		String cardid = bank.getCard_id();
		String identity_type = "UID";
		String phone_no = bank.getReversedPhone();
		String pay_method = "binding_pay^" + amount + "^" + cardid;
		String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
		String out_trade_no = phone_no + timestamp;
		String summary = "充值";

		Map<String, String> params = new HashMap<String, String>();
		params.put("out_trade_no", out_trade_no);
		params.put("identity_id", user.getIdentityId() + "");
		params.put("identity_type", identity_type);
		params.put("account_type", account_type);
		params.put("amount", amount + "");
		params.put("pay_method", pay_method);
		params.put("notify_url", notify_url);
		params.put("summary", summary);

		String result = SinaRequest(servicename, params, user, service, url1);
		JSONObject resobj = JSONObject.fromObject(result);
		if (!result.contains("APPLY_SUCCESS")) {
			if (resobj.containsKey("response_message")) {
				return "{\"retcode\":\"1\",\"retmessage\":\"" + resobj.getString("response_message") + "\"}";
			} else {
				return "{\"retcode\":\"1\",\"retmessage\":\""
						+ JSONObject.fromObject(resobj.getString("error")).getString("response_message") + "\"}";

			}
		}

		return "{\"retcode\":\"0\",\"out_trade_no\":\"" + out_trade_no + "\"}";
	}

	/**
	 * 充值推进接口
	 * 
	 * @param service
	 * @param user 悠米用户
	 * @param validate_code 短信验证码
	 * @return
	 */
	public static String depositAdvance(UmiService service, UMIUser user, String validate_code) {
		UMIUser umiUser = service.getUserByToken(user.getToken());
		if (umiUser == null) {
			return "{\"retcode\":\"2\",\"retmessage\":\"token无效\"}";
		}
		String servicename = "advance_hosting_pay";
		String preRespon = service.queryApiResponse(user.getId(), "create_hosting_deposit");
		JSONObject obj = JSONObject.fromObject(preRespon);
		String ticket = obj.getString("ticket");
		String phone_no = user.getUserName();
		String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
		String out_trade_no = phone_no + timestamp;

		Map<String, String> params = new HashMap<String, String>();
		params.put("ticket", ticket);
		params.put("validate_code", validate_code);
		params.put("out_advance_no", out_trade_no);

		String result = SinaRequest(servicename, params, user, service, url1);

		return result;
	}

	/**
	 * 新浪充值,返回成功的值,此方法仅测试使用!!!
	 */
	public static String createHostingDepositTest() {
		return "{\"response_message\":\"提交成功\",\"response_code\":\"APPLY_SUCCESS\"}";
	}

	/**
	 * 提现接口
	 * 
	 * @param service
	 * @param user
	 * @param amount 提现金额
	 * @return
	 */
	public static String createHostingWithdraw(UmiService service, UMIUser user, double amount, String card_id)
			throws Exception {
		UMIUser umiUser = service.getUserByToken(user.getToken());
		if (umiUser == null) {
			return "{\"retcode\":\"2\",\"retmessage\":\"token无效\"}";
		}
		String servicename = "create_hosting_withdraw";
		String account_type = "SAVING_POT";
		String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
		String out_trade_no = user.getUserMobile() + timestamp;
		String summary = "提现";
		String identity_type = "UID";
		String notify_url = "http://120.26.79.84:8080/UMIbank/rs/users/receive";// 生产服务器
		Map<String, String> params = new HashMap<String, String>();
		params.put("out_trade_no", out_trade_no);
		params.put("identity_id", user.getIdentityId() + "");
		params.put("identity_type", identity_type);
		params.put("account_type", account_type);
		params.put("amount", amount + "");
		params.put("card_id", card_id);
		params.put("notify_url", notify_url);
		params.put("summary", summary);

		String result = SinaRequest(servicename, params, user, service, url1);

		String responce = result + "@" + out_trade_no;
		return responce;
	}

	/**
	 * 绑卡接口
	 * 
	 * @param service
	 * @param user 悠米用户
	 * @param params 绑卡所需参数,如下:<br />["bank_account_no":"","phone_no":"","bank_code":""]  参数值分别代表: 银行卡号、银行预留手机号、银行编号(ICBC,CCB)
	 * @return 返回json格式字符串( {"retcode":"",...} )<br />
	 * retcode值的含义如下:<br />
	 * 		0: 表示绑卡初步成功;<br />
	 *  	1: 表示绑卡初步失败;<br />
	 *  	2: 表示token失效
	 */
	public static String bindingBankCard(UmiService service, UMIUser user, Map<String, String> params) {
		UMIUser umiUser = service.getUserByToken(user.getToken());
		if (umiUser == null) {
			return "{\"retcode\":\"2\",\"retmessage\":\"token无效\"}";
		}

		String servicename = "binding_bank_card";// 服务名称
		String cardType = "DEBIT";// 卡类型
		String cardAttribute = "C";// 卡属性
		String verify_mode = "SIGN";// 认证类型
		String identity_type = "UID";// 标识类型
		String identity_id = user.getIdentityId() + "";// 会员标识
		String request_no = user.getId() + new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());// 绑卡请求号

		// String province = null;// 省份
		// String city = null;// 城市
		// 银行卡号和手机号加密处理
		String bank_account_no = params.get("bank_account_no");
		String phone_no = params.get("phone_no");
		try {
			byte[] bank_account_no_byte = RSA.encryptByPublicKey(bank_account_no.getBytes(), encrypt);
			bank_account_no = Base64.encode(bank_account_no_byte);

			if (phone_no != null) {
				byte[] phone_no_byte = RSA.encryptByPublicKey(phone_no.getBytes(), encrypt);
				phone_no = Base64.encode(phone_no_byte);
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		params.put("request_no", request_no);
		params.put("identity_id", identity_id);
		params.put("identity_type", identity_type);
		params.put("bank_account_no", bank_account_no);
		params.put("card_type", cardType);
		params.put("card_attribute", cardAttribute);
		params.put("phone_no", phone_no);
		params.put("verify_mode", verify_mode);

		String result = SinaRequest(servicename, params, user, service, url2);

		JSONObject resobj = JSONObject.fromObject(result);
		// 绑卡推进失败
		if (!result.contains("APPLY_SUCCESS")) {
			if (resobj.containsKey("response_message")) {
				return "{\"retcode\":\"1\",\"retmessage\":\"" + resobj.getString("response_message") + "\"}";
			} else {
				return "{\"retcode\":\"1\",\"retmessage\":\""
						+ JSONObject.fromObject(resobj.getString("error")).getString("response_message") + "\"}";
			}
		}
		return "{\"retcode\":\"0\"}";
	}

	/**
	 * 绑定银行卡推进接口
	 * 
	 * @param service
	 * @param user 悠米用户
	 * @param params 绑卡推进所需参数,如下:<br />["ticket":"","valid_code":""]  参数值分别代表: 绑卡时返回的ticket、短信验证码
	 * @return 返回json格式字符串( {"retcode":"",...} )<br />
	 * retcode值的含义如下:<br />
	 * 		0: 表示推进成功;<br />
	 *  	1: 表示推进失败;<br />
	 *  	2: 表示token失效
	 */
	public static String bindingBankCardAdvance(UmiService service, Map<String, String> params, UMIUser user) {
		user = service.getUserByToken(user.getToken());
		if (user == null) {
			return "{\"retcode\":\"2\",\"retmessage\":\"token无效\"}";
		}
		String servicename = "binding_bank_card_advance";

		String result = SinaRequest(servicename, params, user, service, url2);

		JSONObject resobj = JSONObject.fromObject(result);
		// 绑卡推进失败
		if (!result.contains("APPLY_SUCCESS")) {
			if (resobj.containsKey("response_message")) {
				return "{\"retcode\":\"1\",\"retmessage\":\"" + resobj.getString("response_message") + "\"}";
			} else {
				return "{\"retcode\":\"1\",\"retmessage\":\""
						+ JSONObject.fromObject(resobj.getString("error")).getString("response_message") + "\"}";
			}
		}
		return "{\"retcode\":\"0\",\"retmessage\":\"" + resobj.getString("response_message") + "\",\"card_id\":"
				+ resobj.getString("card_id") + "}";
	}

	/**
	 * 查询用户的所有银行卡信息
	 * 
	 * @param service
	 * @param user 悠米用户
	 * @return 返回json格式字符串( {"retcode":"",...} )<br />
	 * retcode值的含义如下:<br />
	 * 		0: 表示查询成功,获取用户的银行卡集合card_list;<br />
	 *  	1: 表示查询失败;
	 */
	public static String queryBankCards(UmiService service, UMIUser user) {
		String servicename = "query_bank_card";
		String identity_id = user.getIdentityId() + "";
		String identity_type = "UID";
		// String extend_param = "";
		Map<String, String> params = new HashMap<String, String>();
		params.put("identity_id", identity_id);// 用户标识信息
		params.put("identity_type", identity_type);// 用户标识类型
		// params.put("card_id", card_id);// 卡ID
		// params.put("extend_param", extend_param);// 扩展信息

		String response = SinaRequest(servicename, params, user, service, url2);
		JSONObject resobj = JSONObject.fromObject(response);
		if (!response.contains("APPLY_SUCCESS")) {
			return "{\"retcode\":\"1\",\"retmessage\":\"" + response + "\"}";
		}

		return "{\"retcode\":\"0\",\"card_list\":\"" + resobj.getString("card_list") + "\"}";

	}

	/**
	 * 查询用户的安全卡
	 * @param service
	 * @param user 悠米用户
	 * @return 安全卡存在,则安全卡的新浪ID <br />
	 * 		         不存在,则返回null
	 */
	public static String queryBankCard(UmiService service, UMIUser user) {
		String servicename = "query_bank_card";
		String identity_id = user.getIdentityId() + "";
		String identity_type = "UID";
		String card_id = null;
		// String extend_param = "";
		Map<String, String> params = new HashMap<String, String>();
		params.put("identity_id", identity_id);// 用户标识信息
		params.put("identity_type", identity_type);// 用户标识类型
		// params.put("card_id", card_id);// 卡ID
		// params.put("extend_param", extend_param);// 扩展信息

		String responce = SinaRequest(servicename, params, user, service, url2);
		JSONObject json = JSONObject.fromObject(responce);
		if (responce.contains("APPLY_SUCCESS")) {
			String card_list = json.getString("card_list");
			String[] cardList = card_list.split("\\|");
			for (String cardInfo : cardList) {
				String[] cardInfos = cardInfo.split("\\^");
				if (cardInfos[cardInfos.length - 1].equalsIgnoreCase("Y")) {
					card_id = cardInfos[0];
				}
			}
		}

		return card_id;
	}

	/**
	 * 解绑银行卡,不判断解绑成功与否
	 * @param service
	 * @param user_json
	 * @return  0 表示正常流程跑完 <br />
	 */
	public static int undoBindingCard(UmiService service, UMIUser user, String card_id) {
		String servicename = "unbinding_bank_card";

		String identity_id = user.getIdentityId() + "";
		String identity_type = "UID";
		if (card_id == null || card_id.equals("0")) {
			BankInfo bank = service.findDBC(user.getId());
			card_id = bank.getCardId();
		}
		// String extend_param = "";
		Map<String, String> params = new HashMap<String, String>();
		params.put("identity_id", identity_id);// 用户标识信息
		params.put("identity_type", identity_type);// 用户标识类型
		params.put("card_id", card_id);// 卡ID
		// params.put("extend_param", extend_param);// 扩展信息

		SinaRequest(servicename, params, user, service, url2);

		return 0;
	}

	/**
	 * 新浪的转账接口
	 * @param service
	 * @param user
	 * @param amount 交易金额
	 * @param payer_identity_id 付款方新浪账户
	 * @param payee_identity_id 收款方新浪账户
	 * @return 转账成功 或者 收款方与付款方是同一个ID 则返回{"retcode":0} ;
	 * 		<br /> 失败,则返回 {"retcode":1}
	 */
	public static String transferSina(UmiService service, UMIUser user, double amount, String payer_identity_id,
			String payee_identity_id) {
		if (payer_identity_id.equals(payee_identity_id)) {
			return "{\"retcode\":\"0\"}";
		}
		int result = createHostingCollectTrade(service, user, amount, payer_identity_id);
		if (result == 0) {
			result = createSingleHostingPayTrade(service, user, amount, payee_identity_id);
			if (result == 0) {
				return "{\"retcode\":\"0\"}";
			}
		}
		return "{\"retcode\":\"1\"}";

	}

	/**
	 * 测试充值专用,其他地方不可用!!!!
	 */
	public static String transferSinaTest() {
		return "{\"retcode\":\"0\"}";
	}

	/**
	 * 查询用户的新浪账户余额
	 * 
	 * @param service
	 * @param user 悠米用户
	 * @return 直接返回新浪返回的内容
	 */
	public static String queryBalance(UmiService service, UMIUser user) {
		String servicename = "query_balance";
		Map<String, String> params = new HashMap<String, String>();
		params.put("identity_id", user.getIdentityId() + "");// 会员标识
		params.put("identity_type", "UID");// 标识类型
		params.put("account_type", "SAVING_POT");// 账户类型
		String result = SinaRequest(servicename, params, user, service, url2);
		return result;
	}

	/**
	 * 查询新浪账户余额
	 * @param service
	 * @param user 悠米用户
	 * @return 返回一个json字符串(格式: {"retcode":, ... } )<br />
	 * retcode为 0,表示查询成功;retcode为2,则表示失败,可以获取返回的提示信息或出错信息
	 */
	public static String queryBalanceSina(UmiService service, UMIUser user) {
		String response = queryBalance(service, user);

		JSONObject resobj = JSONObject.fromObject(response);
		if (response.contains("APPLY_SUCCESS")) {
			Double balance = resobj.getDouble("balance");
			return "{\"retcode\":\"0\",\"balance\":\"" + balance + "\"}";
		} else {
			if (resobj.containsKey("response_message")) {
				return "{\"retcode\":\"2\",\"retmessage\":\"" + resobj.getString("response_message") + "\"}";
			} else {
				return "{\"retcode\":\"2\",\"retmessage\":\""
						+ JSONObject.fromObject(resobj.getString("error")).getString("response_message") + "\"}";
			}
		}
	}

	/**
	 * 将 payer_identity_id 账户下的钱转到  payee_identity_id 账户下
	 * 
	 * @param service
	 * @param user 用户
	 * @param amount 交易金额
	 * @param payer_identity_id 付款方
	 * @param payee_identity_id 收款方
	 * @return 返回转账金额  <br />
	 * 			其值为 0 或者 大于0
	 */
	public static double transferAllSina(UmiService service, UMIUser user, Double amount, String payer_identity_id,
			String payee_identity_id) {
		if (amount == 0) {
			return 0.0;
		}
		String responseStr = transferSina(service, user, amount, payer_identity_id, payee_identity_id);
		JSONObject retObj = JSONObject.fromObject(responseStr);

		UserAction ua = new UserAction();
		ua.setAction_amount(amount + "");
		ua.setAction_detail("从" + payer_identity_id + "转到" + payee_identity_id + " ...微信端");
		ua.setAction_type("转出所有");
		ua.setUser_id(user.getId());
		if (retObj.getInt("retcode") == 0) {
			ua.setAction_res("转账完成");
		} else {
			ua.setAction_res("转账失败");
		}
		service.addOrUpdate(ua);

		return amount;
	}

	/**
	 * 确保不是安全卡用戶,如果是,则解绑该用户的安全卡
	 * @param service
	 * @param user 悠米客户
	 * @return 如果存在安全卡,则解绑安全卡并且返回安全卡的card_id,否则返回null
	 */
	public static String ensureNoSafeCard(UmiService service, UMIUser user) {
		String card_id = queryBankCard(service, user);
		if (card_id != null) {
			undoBindingCard(service, user, card_id);
		}
		return card_id;
	}

	/**
	 * 解绑银行卡,本操作是在 绑卡A 推进成功后执行,用于解绑用户下的 非卡A 的银行卡
	 * @param umiService
	 * @param company_400_id 公司个人账户
	 * @param user_json 解绑所需参数,如下:<br /> {"token":"","card_list":""} 参数值分别代表: 用户token、银行卡集合
	 * @return 返回一个json字符串(格式: {"retcode":"", ... } )<br />
	 * retcode值的含义如下:<br />
	 * 		0: 表示查询成功;<br />
	 *  	2: 表示失败,返回的提示信息或出错信息
	 */
	public static String unBindingCard(UmiService umiService, JSONObject user_json, String company_400_id) {
		String token = user_json.getString("token");
		UMIUser user = umiService.getUserByToken(token);
		if (user == null) {
			return "{\"retcode\":\"2\",\"retmessage\":\"token无效\"}";
		}
		String result = queryBalanceSina(umiService, user);
		JSONObject resobj = JSONObject.fromObject(result);
		if (resobj.getString("retcode").equals("0")) {
			String safeCard_id = null;
			double amount = resobj.getDouble("balance");
			if (amount > 0) {
				JSONObject params = new JSONObject();
				params.put("userID", user.getId());
				params.put("amount", amount);

				// 把用户卡上的钱暂时转到公司账户上,在解绑了安全卡之后会把转如公司账户的钱转回
				double tag = transferAllSina(umiService, user, amount, user.getIdentityId() + "", company_400_id);
				// 如果成功,则继续下一步
				// 确保新浪账户没有安全卡
				safeCard_id = ensureNoSafeCard(umiService, user);

				if (tag > 0) {
					// 把之前转入公司账户的钱重新转到用户账户上
					transferSina(umiService, user, tag, company_400_id, user.getIdentityId() + "");
				}
			}

			@SuppressWarnings("unchecked")
			List<String> cardList = (List<String>) user_json.get("card_list");
			for (String card_id : cardList) {
				if (card_id.equals(safeCard_id)) {
					continue;
				}
				undoBindingCard(umiService, user, card_id);
			}
			return "{\"retcode\":\"0\"}";
			// 查询失败
		} else {
			return "{\"retcode\":\"2\",\"retmessage\":\"" + resobj.getString("retmessage") + "\"}";
		}
	}

	/* 实名认证
	 * operation start */
	/**
	 * 创建激活会员
	 * 实名认证
	 * @param service
	 * @param params
	 * @param user
	 * @return
	 */
	public static String createActivateMember(UmiService service, Map<String, String> params, UMIUser user) {
		String servicename = "create_activate_member";
		String identity_type = "UID";// 用户标识信息
		params.put("identity_type", identity_type);
		String result = SinaRequest(servicename, params, user, service, url2);

		return result;
	}

	/**
	 * 设置实名信息
	 * 
	 * @param service
	 * @param params
	 * @param user
	 * @return
	 */
	public static String setRealName(UmiService service, Map<String, String> params, UMIUser user) {
		String servicename = "set_real_name";
		String identity_type = "UID";// 用户标识信息
		String cert_type = "IC";// 证件类型
		String need_confirm = "Y";// 是否认证
		String real_name = params.get("real_name");
		String cert_no = params.get("cert_no");
		try {
			byte[] real_name_byte = RSA.encryptByPublicKey(real_name.getBytes("utf-8"), encrypt);
			byte[] cert_no_byte = RSA.encryptByPublicKey(cert_no.getBytes(), encrypt);
			real_name = Base64.encode(real_name_byte);
			cert_no = Base64.encode(cert_no_byte);
		} catch (Exception e1) {
			e1.printStackTrace();
		}
		params.put("real_name", real_name);
		params.put("cert_no", cert_no);
		params.put("identity_type", identity_type);
		params.put("cert_type", cert_type);
		params.put("need_confirm", need_confirm);
		String result = SinaRequest(servicename, params, user, service, url2);

		return result;
	}

	/**
	 * 绑定认证信息
	 * 
	 * @param service
	 * @param params
	 * @param user
	 * @return
	 */
	public static String bindingVerify(UmiService service, Map<String, String> params, UMIUser user) {
		String servicename = "binding_verify";
		String identity_type = "UID";// 用户标识信息
		String verify_type = "MOBILE";// 认证类型
		params.put("verify_type", verify_type);
		params.put("identity_type", identity_type);
		String result = SinaRequest(servicename, params, user, service, url2);

		return result;
	}

	/**
	 * 实名验证
	 * 
	 * @param service
	 * @param user 悠米用户
	 * @param ic_json 实名验证所需参数,如下:<br /> {"identityCard":"","name":""} 参数值分别代表: 身份证号码、真实姓名
	 * @return 返回一个json字符串(格式: {"retcode":"", ... } )<br />
	 * retcode值的含义如下:<br />
	 * 		0: 表示查询成功;<br />
	 * 		1: 表示验证失败
	 *  	2: 表示token失效
	 */
	public static String realNameVerify(UmiService service, UMIUser user, JSONObject ic_json) {
		UMIUser umiUser = service.getUserByToken(user.getToken());
		if (umiUser == null) {
			return "{\"retcode\":\"2\",\"retmessage\":\"token无效\"}";
		}
		String cert_no = ic_json.getString("identityCard");
		String real_name = ic_json.getString("name");
		ApiRequest ar = new ApiRequest();

		long UID = user.getIdentityId();
		ar.setUser_id(user.getId());
		ar.setApi_type(1);
		if (UID == 0) {
			UID = user.getId() + 2000000;
			Map<String, String> params = new HashMap<String, String>();
			params.put("identity_id", UID + "");
			createActivateMember(service, params, user);
		}

		Map<String, String> params = new HashMap<String, String>();
		params.put("identity_id", UID + "");
		params.put("real_name", real_name);
		params.put("cert_no", cert_no);
		String response = setRealName(service, params, user);

		JSONObject resobj = JSONObject.fromObject(response);
		if (resobj.containsValue("APPLY_SUCCESS")) {
			Map<String, String> paramz = new HashMap<String, String>();
			params.put("identity_id", UID + "");// 用户标识信息
			params.put("verify_entity", user.getUserMobile());// 认证内容
			response = bindingVerify(service, paramz, user);
			JSONObject resobj2 = JSONObject.fromObject(response);
			if (resobj2.containsValue("APPLY_SUCCESS")) {
				user.setIdentityId(UID);
				user.setIsVerified(1);
				user.setRealName(real_name);
				user.setCertNo(cert_no);
				service.addOrUpdate(user);
				return "{\"retcode\":\"0\",\"retmessage\":\"认证成功\"}";
			} else {
				if (resobj.containsKey("response_message")) {
					return "{\"retcode\":\"1\",\"retmessage\":\"" + resobj2.getString("response_message") + "\"}";
				} else {
					return "{\"retcode\":\"1\",\"retmessage\":\""
							+ JSONObject.fromObject(resobj.getString("error")).getString("response_message") + "\"}";
				}
			}
		} else {
			return "{\"retcode\":\"1\",\"retmessage\":\"" + resobj.getString("response_message") + "\"}";
		}
	}
	/* 实名认证
	 * operation END */

	/**
	 * 托管代收
	 * @param service
	 * @param user
	 * @param amount 付款金额
	 * @param payer_id 付款客户新浪ID
	 * @return 成功返回 0 ; 失败返回 1
	 */
	public static int createHostingCollectTrade(UmiService service, UMIUser user, double amount, String payer_id) {
		String servicename = "create_hosting_collect_trade";
		String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
		String out_trade_no = user.getUserName() + timestamp;
		String out_trade_code = "1001";
		String summary = "转账";
		String payer_identity_type = "UID";
		String pay_method = "balance^" + amount + "^SAVING_POT";

		Map<String, String> params = new HashMap<String, String>();
		params.put("out_trade_no", out_trade_no);
		params.put("summary", summary);
		params.put("payer_id", payer_id);
		params.put("pay_method", pay_method);
		params.put("out_trade_code", out_trade_code);
		params.put("payer_identity_type", payer_identity_type);

		String result = SinaRequest(servicename, params, user, service, url1);
		if (result.contains("APPLY_SUCCESS")) {
			return 0;
		} else {
			return 1;
		}
	}

	/**
	 * 托管代付
	 * @param service
	 * @param user
	 * @param amount 交易金额
	 * @param payer_id 收款客户新浪ID
	 * @return 成功返回 0 ; 失败返回 1
	 */
	public static int createSingleHostingPayTrade(UmiService service, UMIUser user, double amount, String payer_id) {
		String servicename = "create_single_hosting_pay_trade";
		String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
		String out_trade_no = user.getUserName() + timestamp;
		String out_trade_code = "2001";
		String summary = "转账";
		String payee_identity_type = "UID";

		Map<String, String> params = new HashMap<String, String>();
		params.put("out_trade_no", out_trade_no);
		params.put("out_trade_code", out_trade_code);
		params.put("payee_identity_id", payer_id);
		params.put("payee_identity_type", payee_identity_type);
		params.put("amount", amount + "");
		params.put("summary", summary);

		String result = SinaRequest(servicename, params, user, service, url1);
		if (result.contains("APPLY_SUCCESS")) {
			return 0;
		} else {
			return 1;
		}
	}

}

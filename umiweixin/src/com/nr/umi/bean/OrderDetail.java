package com.nr.umi.bean;

import java.util.Date;
/**
 * 订单详情类
 * @author tzhang
 *
 */
public class OrderDetail {
	
	private Integer id;
	//创建时间
	private Date createTime;
	//完成时间
	private Date comTime;
	//到了哪一步
	private Integer step;
	//类型,5种类型.1:交易处理->交易成功->开始计息;2:交易处理->交易失败;3:交易处理->交易成功->开始计息->到期可转出;4:交易处理->交易成功->到账;5:体验金赠送->开始计息->体验金返还.
	private Integer type;
	//是否成功,0:成功;1:处理中;2:失败
	private Integer isSuccess;

	public Integer getIsSuccess() {
		return isSuccess;
	}

	public void setIsSuccess(Integer isSuccess) {
		this.isSuccess = isSuccess;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Date getComTime() {
		return comTime;
	}

	public void setComTime(Date comTime) {
		this.comTime = comTime;
	}

	public Integer getStep() {
		return step;
	}

	public void setStep(Integer step) {
		this.step = step;
	}

	public Integer getType() {
		return type;
	}

	public void setType(Integer type) {
		this.type = type;
	}

	@Override
	public String toString() {
		return "OrderDetail [id=" + id + ", createTime=" + createTime + ", comTime=" + comTime + ", step=" + step
				+ ", type=" + type + ", isSuccess=" + isSuccess + "]";
	}

}

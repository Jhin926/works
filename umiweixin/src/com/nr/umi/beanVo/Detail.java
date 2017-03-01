package com.nr.umi.beanVo;

public class Detail {
	private String name;
	private String time;
	private long timeMillis;
	private boolean isCom;
	private String dateFormat;

	public String getDateFormat() {
		return dateFormat;
	}

	public void setDateFormat(String dateFormat) {
		this.dateFormat = dateFormat;
	}

	public boolean getIsCom() {
		return isCom;
	}

	public void setIsCom(boolean isCom) {
		this.isCom = isCom;
	}

	public long getTimeMillis() {
		return timeMillis;
	}

	public void setTimeMillis(long timeMillis) {
		this.timeMillis = timeMillis;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

}
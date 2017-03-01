package com.nr.umi.bean;

import java.util.Date;

public class Text {
	private int id;
	// 文本名称
	private String name;
	// 文本内容
	private String content;
	// 版本
	private String version;
	// 时间
	private Date time;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

	public Date getTime() {
		return time;
	}

	public void setTime(Date time) {
		this.time = time;
	}

	@Override
	public String toString() {
		return "Text [id=" + id + ", name=" + name + ", content=" + content + ", version=" + version + ", time=" + time
				+ "]";
	}

}

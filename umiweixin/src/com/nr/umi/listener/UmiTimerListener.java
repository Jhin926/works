package com.nr.umi.listener;

import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

public class UmiTimerListener implements ServletContextListener {

	@Override
	public void contextDestroyed(ServletContextEvent arg0) {
		System.out.println("");
		
	}

	@Override
	public void contextInitialized(ServletContextEvent arg0) {
		System.out.println("");
	}

	public Date getDate() {
		System.out.println("com.test.TestTimer.getDate()...");
		Calendar now = Calendar.getInstance();
		int year = now.get(Calendar.YEAR);
		int mouth = now.get(Calendar.MONTH);
		int day = now.get(Calendar.DAY_OF_MONTH);

		System.out.println("year:\t" + year);
		System.out.println("mouth:\t" + mouth);
		System.out.println("day:\t" + day);
		// criticalDate,每天临界日期:每天15点
		Calendar tempCalendar = new GregorianCalendar();
		tempCalendar.set(year, mouth, day, 15, 20, 0);
		return tempCalendar.getTime();
	}
}

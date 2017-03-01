package com.nr.umi.listener;

import javax.servlet.http.HttpSessionEvent;
import javax.servlet.http.HttpSessionListener;

public class ConnectionListener implements HttpSessionListener {

    public ConnectionListener() {
    	System.out.println("com.nr.umi.listener.ConnectionListener.ConnectionListener()...");
    }

    public void sessionCreated(HttpSessionEvent event)  { 
    	System.out.println();
    }

    public void sessionDestroyed(HttpSessionEvent event)  { 
    	System.out.println("com.nr.umi.listener.ConnectionListener.sessionDestroyed(HttpSessionEvent)");
    }
	
}

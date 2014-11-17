package com.restaurant.dwr;

import java.util.Collection;

import org.directwebremoting.Browser;
import org.directwebremoting.ScriptBuffer;
import org.directwebremoting.ScriptSession;
import org.directwebremoting.ScriptSessionFilter;
import org.directwebremoting.WebContextFactory;

public class DWR {
	
	public void onPageLoad(String userId) {
		ScriptSession scriptSession = WebContextFactory.get()
				.getScriptSession();
		scriptSession.setAttribute("userId", userId);
	}
	
    public static void send(final String userId, final String message, final String func){  
        
        //过滤器  
       ScriptSessionFilter filter = new ScriptSessionFilter() {  
              
			@Override
			public boolean match(ScriptSession scriptSession) {
				 if (scriptSession.getAttribute("userId") == null)
	 					return false;
	 				else
	 					return (scriptSession.getAttribute("userId")).equals(userId);
			}  
       };  

       Runnable run = new Runnable(){  
    	   private ScriptBuffer script = new ScriptBuffer();

			public void run() {
				//设置要调用的 js及参数  
				script.appendCall(func, message);
				 //得到所有ScriptSession 
				Collection<ScriptSession> sessions = Browser
						.getTargetSessions();
				//遍历每一个ScriptSession
				for (ScriptSession scriptSession : sessions) {
					scriptSession.addScript(script);
				}
			}
       };  
        //执行推送  
       Browser. withAllSessionsFiltered(filter, run);    //注意这里调用了有filter功能的方法  
    }  
}

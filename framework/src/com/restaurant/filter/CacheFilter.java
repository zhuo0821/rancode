package com.restaurant.filter;

import java.io.IOException;
import java.util.Map;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.MDC;

import com.restaurant.bean.User;
import com.restaurant.util.CacheLoader;

/**  
 * 创建时间：2014-6-4 下午4:01:32  
 * 项目名称：restaurant  
 * @author 朱卓
 * 文件名称：CacheFilter.java  
 * 说明：  
 */
public class CacheFilter implements Filter {

	protected FilterConfig filterConfig = null;

	public void destroy() {
		this.filterConfig = null;
	}

	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
	    HttpServletRequest req = (HttpServletRequest)request;
	    HttpServletResponse res = (HttpServletResponse)response;
	    HttpSession session= req.getSession();
	    

	    User user=(User)session.getAttribute("userInfo");
	    if(user!=null) {
	    	MDC.put("userId", user.getUserId());
	    	MDC.put("userName", user.getUserName());
	    }else {
	    	MDC.put("userId", "系统");
	    	MDC.put("userName", "系统");
		}
	    
	    req.setAttribute("cache", CacheLoader.getCache());
		chain.doFilter(request, response);
	}

	public void init(FilterConfig filterConfig) throws ServletException {
		this.filterConfig = filterConfig;
	}

}

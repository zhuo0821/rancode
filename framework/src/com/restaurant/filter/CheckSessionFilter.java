package com.restaurant.filter;

import java.io.*;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.restaurant.bean.User;

public class CheckSessionFilter implements Filter {

	protected FilterConfig filterConfig = null;

	public void destroy() {
		this.filterConfig = null;
	}

	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
	    HttpServletRequest req = (HttpServletRequest)request;
	    HttpServletResponse res = (HttpServletResponse)response;
	    HttpSession session= req.getSession();
        String uri= req.getRequestURI();
	    User user = (User)session.getAttribute("userInfo");
	    String head = req.getHeader("x-requested-with");
	    if (head != null && (head.equalsIgnoreCase("XMLHttpRequest"))) {   
	    	if (null == user && !uri.contains("login.do")) { 
	    		res.sendError(999);
	    	}  
	    	else{  
	    		chain.doFilter(request, response);   
	    	}  
	    }  else {
	    	if(null == user && !uri.contains("login.do")&& !uri.contains("admin")){
	    		//如果请求页是登录页，不转向
	    		res.sendRedirect(uri.subSequence(0,uri.indexOf('/', 1))+"/404.html");
	    	}else{
	    		chain.doFilter(request, response);
	    	}
	    }
	}

	public void init(FilterConfig filterConfig) throws ServletException {
		this.filterConfig = filterConfig;
	}

}
